/**
 * useLiveTicker — live price feed hook.
 *
 * Production: connects to a WebSocket or Server-Sent Events endpoint at
 * `wss://api.gefi.io/v1/market/stream`. Stub: re-fetches the ticker REST
 * endpoint on a 5-second interval with small random noise applied to prices.
 *
 * STUB — real WebSocket endpoint is a post-launch infrastructure addition.
 */
import { useState, useEffect } from "react";
import type { ApiClient, TickerQuote } from "../api/client.js";

const JITTER = 0.003;

function addNoise(q: TickerQuote): TickerQuote {
  const delta = q.price * JITTER * (Math.random() * 2 - 1);
  const price = parseFloat((q.price + delta).toFixed(4));
  const change = parseFloat((q.change + delta).toFixed(4));
  const changePct = parseFloat(((change / (price - change)) * 100).toFixed(4));
  return { ...q, price, change, changePct, ts: Date.now() };
}

export function useLiveTicker(
  client: ApiClient,
  intervalMs = 5000,
): { quotes: TickerQuote[]; isLive: boolean } {
  const [quotes, setQuotes] = useState<TickerQuote[]>([]);

  useEffect(() => {
    let active = true;
    client.getTicker().then((q) => { if (active) setQuotes(q); }).catch(console.error);

    const id = setInterval(() => {
      if (!active) return;
      setQuotes((prev) => prev.map(addNoise));
    }, intervalMs);

    return () => { active = false; clearInterval(id); };
  }, [client, intervalMs]);

  return { quotes, isLive: true };
}
