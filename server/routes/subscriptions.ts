/**
 * Register subscription-related routes.
 *
 * Mount this file from your main routes loader (server/routes/gefiRoutes.ts or server/src/index.ts):
 *   const registerSubscriptions = require('./routes/subscriptions').default;
 *   registerSubscriptions(app);
 *
 * Endpoints added:
 *  - POST /api/ai-models/:id/subscribe
 *  - GET  /api/ai-models/:id/subscription
 *  - POST /api/webhooks/stripe  (optional webhook handler for checkout.session.completed)
 *
 * Notes:
 *  - This file uses a small local isAuthenticated guard when no central auth middleware is available.
 *  - Stripe integration is optional (requires STRIPE_API_KEY environment variable).
 *  - Falls back to demo mode (immediate active subscription) when Stripe is not configured.
 */

import { Router } from 'express';
import type { Express } from 'express';
import * as subs from '../models/subscriptions';
import { aiModelsData } from '../data/ai-models.js';

// Import auth middleware - try multiple possible imports
let ensureAuth: any;
try {
  const multiAuth = require('../multiAuth');
  ensureAuth = multiAuth.isAuthenticated;
} catch (e) {
  try {
    const replitAuth = require('../replitAuth');
    ensureAuth = replitAuth.isAuthenticated;
  } catch (e2) {
    // Fallback auth middleware
    ensureAuth = (req: any, res: any, next: any) => {
      if (!req.user || !req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      next();
    };
  }
}

// Stripe helpers (optional)
async function createStripeCheckout(params: {
  priceId?: string;
  amount?: number;
  currency?: string;
  productName?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, any>;
}) {
  const stripe = require('stripe')(process.env.STRIPE_API_KEY);
  
  // Create a checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price_data: {
          currency: params.currency || 'usd',
          product_data: {
            name: params.productName || 'AI Model Subscription',
          },
          unit_amount: Math.round((params.amount || 149) * 100), // Convert to cents
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata || {},
  });

  return { id: session.id, url: session.url };
}

const router = Router();

/**
 * POST /api/ai-models/:id/subscribe
 * Subscribes the authenticated user to the specified AI model.
 * 
 * Behavior:
 * - If STRIPE_API_KEY is set, creates a Stripe checkout session and returns { checkoutUrl }
 * - Otherwise, creates an active subscription immediately (demo mode)
 * - Returns 400 if user already has an active subscription
 */
router.post("/api/ai-models/:id/subscribe", ensureAuth, async (req: any, res: any) => {
  try {
    const modelId = Number(req.params.id);
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    if (!modelId || isNaN(modelId)) {
      return res.status(400).json({ success: false, message: "Invalid model ID" });
    }

    // Check if user already has an active subscription
    const existing = await subs.findSubscriptionByUserAndModel(userId, modelId);
    if (existing && existing.status === 'active') {
      return res.json({ success: true, message: "Already subscribed", subscription: existing });
    }

    // Find the model to get pricing info
    const model = aiModelsData.find((m: any) => m.id === modelId);
    if (!model) {
      return res.status(404).json({ success: false, message: "Model not found" });
    }

    // Try Stripe checkout if configured
    if (process.env.STRIPE_API_KEY) {
      try {
        const checkout = await createStripeCheckout({
          amount: Number(model.price) || 149,
          currency: 'usd',
          productName: `${model.name} - AI Model Subscription`,
          successUrl: `${req.protocol}://${req.get('host')}/my-subscriptions?success=true`,
          cancelUrl: `${req.protocol}://${req.get('host')}/ai-models`,
          metadata: { userId: String(userId), modelId: String(modelId) }
        });

        // Create pending subscription
        const pending = await subs.createSubscription({
          userId,
          modelId,
          price: Number(model.price) || 149,
          currency: 'USD',
          status: 'pending',
          metadata: { checkoutSessionId: checkout.id },
        });

        return res.json({ success: true, checkoutUrl: checkout.url, subscription: pending });
      } catch (stripeError) {
        console.error('Stripe checkout failed:', stripeError);
        // fallthrough to demo fallback
      }
    }

    // Demo/local fallback: create active subscription immediately
    const created = await subs.createSubscription({
      userId,
      modelId,
      price: Number(model.price) || 149,
      currency: "USD",
      status: "active",
      metadata: {},
    });

    return res.json({ success: true, message: "Successfully subscribed (demo mode)", subscription: created });
  } catch (err) {
    console.error("Subscribe endpoint error:", err);
    return res.status(500).json({ success: false, message: "Failed to subscribe to model" });
  }
});

/**
 * GET /api/ai-models/:id/subscription
 * Returns the current user's subscription record for the given model (or null).
 */
router.get("/api/ai-models/:id/subscription", ensureAuth, async (req: any, res: any) => {
  try {
    const modelId = Number(req.params.id);
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!modelId || isNaN(modelId)) {
      return res.status(400).json({ message: "Invalid model ID" });
    }

    const subscription = await subs.findSubscriptionByUserAndModel(userId, modelId);
    return res.json({ subscription });
  } catch (err) {
    console.error("Get subscription endpoint error:", err);
    return res.status(500).json({ message: "Failed to get subscription" });
  }
});

/**
 * GET /api/my-subscriptions
 * Returns all subscriptions for the authenticated user.
 */
router.get("/api/my-subscriptions", ensureAuth, async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const subscriptions = await subs.listSubscriptionsByUser(userId);
    return res.json({ subscriptions });
  } catch (err) {
    console.error("List subscriptions endpoint error:", err);
    return res.status(500).json({ message: "Failed to list subscriptions" });
  }
});

/**
 * POST /api/webhooks/stripe
 * Stripe webhook handler for checkout.session.completed events.
 * Activates pending subscriptions when payment is successful.
 */
router.post("/api/webhooks/stripe", async (req: any, res: any) => {
  if (!process.env.STRIPE_API_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(404).json({ message: "Stripe not configured" });
  }

  const stripe = require('stripe')(process.env.STRIPE_API_KEY);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e: any) {
    console.error('Stripe webhook signature verification failed:', e.message);
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = session.metadata || {};
    const modelId = metadata.modelId ? Number(metadata.modelId) : null;
    const userId = metadata.userId || null;
    const checkoutSessionId = session.id;

    if (userId && modelId) {
      const pending = await subs.findSubscriptionByUserAndModel(userId, modelId);
      if (pending && pending.metadata?.checkoutSessionId === checkoutSessionId) {
        await subs.updateSubscription(pending.id, { 
          status: "active", 
          metadata: { ...pending.metadata, stripeSession: session } 
        });
        console.log("Subscription activated for user", userId, "model", modelId);
      }
    }
  }

  res.json({ received: true });
});

/**
 * Register all subscription routes on the Express app
 */
export default function registerSubscriptionRoutes(app: Express) {
  app.use(router);
}