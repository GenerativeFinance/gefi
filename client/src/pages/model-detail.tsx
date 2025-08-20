/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import SubscribeConfirm from "@/components/subscriptions/SubscribeConfirm";
import { addLocalSubscription, isUserSubscribedLocal } from "@/lib/subscriptionsLocal";
import { useLocation } from "wouter";

export default function ModelDetail() {
  // Try known route patterns (added /ai-models/:id to support links like /ai-models/12)
  const [, modelRouteParams] = useRoute("/model/:id");
  const [, marketplaceRouteParams] = useRoute("/marketplace/:id");
  const [, aiModelsRouteParams] = useRoute("/ai-models/:id");

  // Resolve idParam from route params or fallback to pathname parsing
  const idParamRaw =
    modelRouteParams?.id ??
    marketplaceRouteParams?.id ??
    aiModelsRouteParams?.id ??
    (typeof window !== "undefined"
      ? (window.location.pathname.match(/\/(?:model|marketplace|models|ai-models)\/(\d+)/) || [])[1]
      : undefined);

  const idParam = idParamRaw ? String(idParamRaw) : undefined;

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Subscription confirmation dialog state
  const [subscribeConfirmOpen, setSubscribeConfirmOpen] = useState(false);

  // Optional: Check for special cases and redirect (disabled to show actual model details)
  // Only redirect if coming from old routes, but allow direct /ai-models/:id access
  useEffect(() => {
    if (!idParam) return;

    // Only redirect if we're NOT on the /ai-models route
    const isAiModelsRoute = window.location.pathname.startsWith('/ai-models/');
    if (isAiModelsRoute) return; // Show model details for /ai-models/:id

    // Legacy redirects for old routes only
    if (idParam === '8') {
      window.location.href = '/social-sentiment-trading';
      return;
    }
    if (idParam === '10') {
      window.location.href = '/defi-yield-optimizer';
      return;
    }
    if (idParam === '11') {
      window.location.href = '/defi-anomaly-detection';
      return;
    }
    if (idParam === '9') {
      window.location.href = '/hrp-portfolio-optimization';
      return;
    }
    if (idParam === '12') {
      window.location.href = '/esg-climate-risk';
      return;
    }
    if (idParam === '13') {
      window.location.href = '/gru-forecasting';
      return;
    }
    if (idParam === '14') {
      window.location.href = '/esg-geospatial-commodities';
      return;
    }
    if (idParam === '6') {
      window.location.href = '/algorithmic-hft-trading';
      return;
    }
    if (idParam === '5') {
      window.location.href = '/fraud-detection-bayesian';
      return;
    }
  }, [idParam]);

  // Fetch model
  const {
    data: model,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["api", "ai-models", idParam],
    queryFn: async () => {
      if (!idParam) {
        // Let callers handle missing id; the query should be disabled when no id
        throw Object.assign(new Error("No model id provided"), { status: 400 });
      }

      // apiRequest signature: apiRequest(method, url, data?, options?)
      const resp = await apiRequest("GET", `/api/ai-models/${idParam}`);

      // If helper returned a Response-like object, check status & parse JSON
      if (resp && typeof (resp as any).status === "number" && typeof (resp as any).json === "function") {
        if (!(resp as any).ok) {
          let body;
          try {
            body = await (resp as any).json();
          } catch (e) {
            // ignore parse errors
          }
          const msg = body?.message || `Failed to fetch model (status ${resp.status})`;
          const err: any = new Error(msg);
          err.status = resp.status;
          throw err;
        }
        return (resp as any).json();
      }

      // If helper returned parsed JSON already
      return resp;
    },
    enabled: !!idParam,
    retry: false,
  });

  // Subscribe mutation (keeps previous behavior but uses correct apiRequest signature)
  const subscribeMutation = useMutation({
    mutationFn: async () => {
      if (!idParam) throw new Error("No model id provided");
      const resp = await apiRequest("POST", `/api/ai-models/${idParam}/subscribe`, {});
      if (resp && typeof (resp as any).json === "function") return (resp as any).json();
      return resp;
    },
    onSuccess: (data: any) => {
      // If server returned a checkoutUrl, redirect
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      // Save to local storage for immediate UI feedback
      if (model) {
        addLocalSubscription({
          modelId: model.id,
          modelName: model.name,
          price: model.price || 199, // Default price if not provided
          billingCycle: 'monthly',
          status: 'active',
          subscribedDate: new Date().toISOString(),
          developerName: model.developerName,
          category: model.category
        });
      }

      toast({
        title: "Subscribed",
        description: "You have successfully subscribed to this model.",
      });
      queryClient.invalidateQueries({ queryKey: ["api", "ai-models", idParam] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/ai-models"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/subscriptions"] });
      
      // Navigate to my-subscriptions page
      navigate("/my-subscriptions");
    },
    onError: (err: any) => {
      if (err?.status === 401) {
        toast({
          title: "Unauthorized",
          description: "You must be logged in to subscribe.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Subscription failed",
        description: String(err?.message || "Please try again."),
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error loading model:", error);
      
      // Show toast for non-404 errors
      if (!(error as any)?.status || Number((error as any).status) !== 404) {
        toast({
          title: "Failed to load model",
          description: String((error as any)?.message || "Unable to load model details"),
          variant: "destructive",
        });
      }
    }
  }, [error, toast]);

  const handleRetry = async () => {
    try {
      await refetch();
    } catch (e) {
      toast({
        title: "Retry failed",
        description: "Unable to reload the model. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSubscribeClick = () => {
    setSubscribeConfirmOpen(true);
  };

  const handleSubscribeConfirm = () => {
    subscribeMutation.mutate();
    setSubscribeConfirmOpen(false);
  };

  // Defensive UI states
  if (!idParam) {
    return (
      <Layout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-600 mb-4">Model Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400">No model id was provided in the URL.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" onClick={() => (window.location.href = "/marketplace")}>
                Browse Marketplace
              </Button>
              <Button onClick={() => (window.location.href = "/ai-models")}>All AI Models</Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading && !model) {
    return (
      <Layout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading model...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // If there was an error and no cached model, show actionable error UI
  if (error && !model) {
    const message = (error as any)?.message || "Unable to load the model details. Please try again later.";
    return (
      <Layout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Model</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
            <div className="flex justify-center gap-3">
              <Button onClick={handleRetry} variant="outline">
                Retry
              </Button>
              <Button onClick={() => (window.location.href = "/marketplace")}>Browse Marketplace</Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // If no model (404), show not found UI with suggestions
  if (!model) {
    return (
      <Layout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-600 mb-4">Model Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The model with ID "{idParam}" could not be found.
            </p>
            <div className="bg-muted/30 p-4 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground mb-3">Available model IDs: 1, 2, 3, 5, 6, 7, 8, 9, 12, 19</p>
              <p className="text-sm text-muted-foreground">
                Try visiting one of these models:
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {[1, 2, 3, 5, 6, 7, 8, 9, 12, 19].map((modelId) => (
                  <Button 
                    key={modelId}
                    variant="outline" 
                    size="sm"
                    onClick={() => (window.location.href = `/ai-models/${modelId}`)}
                  >
                    Model {modelId}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => (window.location.href = "/marketplace")}>
                Browse Marketplace
              </Button>
              <Button onClick={() => (window.location.href = "/ai-models")}>
                All AI Models
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Render the model details (keep existing UI/layout)
  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Enhanced model details rendering */}
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{(model as any)?.name || 'Model'}</h1>
                <p className="text-muted-foreground">{(model as any)?.description || 'No description available'}</p>
              </div>
              {(model as any)?.category && (
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {(model as any).category}
                </div>
              )}
            </div>

            {/* Tags */}
            {(model as any)?.tags && (model as any).tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {(model as any).tags.map((tag: string, index: number) => (
                  <span key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
              {(model as any)?.createdAt && (
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <div className="font-medium">
                    {new Date((model as any).createdAt).toLocaleDateString()}
                  </div>
                </div>
              )}
              {(model as any)?.updatedAt && (
                <div>
                  <span className="text-muted-foreground">Updated:</span>
                  <div className="font-medium">
                    {new Date((model as any).updatedAt).toLocaleDateString()}
                  </div>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">ID:</span>
                <div className="font-medium">{idParam}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button onClick={handleSubscribeClick} disabled={subscribeMutation.isPending}>
                {subscribeMutation.isPending ? "Processing..." : "Subscribe to Model"}
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/marketplace")}>
                Browse Marketplace
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/ai-models")}>
                All AI Models
              </Button>
            </div>
          </div>

          {/* Additional Details */}
          {(model as any)?.longDescription && (
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-3">About This Model</h2>
              <p className="text-muted-foreground leading-relaxed">{(model as any).longDescription}</p>
            </div>
          )}
        </div>
      </div>

      {/* Subscription Confirmation Dialog */}
      {model && (
        <SubscribeConfirm
          open={subscribeConfirmOpen}
          onOpenChange={setSubscribeConfirmOpen}
          modelName={model.name}
          price={model.price || 199}
          billingCycle="monthly"
          isSubmitting={subscribeMutation.isPending}
          onConfirm={handleSubscribeConfirm}
          developerName={model.developerName}
        />
      )}
    </Layout>
  );
}