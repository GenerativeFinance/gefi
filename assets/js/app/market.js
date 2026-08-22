/* Market + paper-fill engine (task 308) — ONE implementation of the
 * seeded price walk and the fill rules, shared by the trading page and
 * the mock server (loaded there through the same vm shim). A quote at
 * tick N is the same number on both sides, so a fill printed by the
 * server and a fill printed offline agree.
 *
 * Pure: seeded per symbol, no DOM, no storage, no Math.random. */
(function (window) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});

  /* Session opening prices. The walk below is deterministic from these. */
  var BASE = { AAPL: 232.4, MSFT: 512.8, NVDA: 187.3, TSLA: 341.6, BTC: 118400 };

  /* Opening book the paper engine starts from. */
  var START_POSITIONS = [{ symbol: "AAPL", qty: 50, avg: 226.1 }];

  function symbols() {
    return Object.keys(BASE);
  }

  /* Price after `ticks` steps of the seeded walk. Recomputed from the
   * seed rather than accumulated, so any caller lands on the same number
   * for the same tick without having to have watched every step. */
  function priceAt(symbol, ticks) {
    var base = BASE[symbol];
    if (base === undefined) return null;
    var rand = GeFi.seed.rng(GeFi.seed.hash("lt|" + symbol));
    var last = base;
    for (var i = 0; i < ticks; i++) {
      last = Math.max(1, last * (1 + (rand() - 0.5) * 0.004));
    }
    return last;
  }

  /* The last `n` prices ending at `ticks` — what the session chart draws. */
  function seriesAt(symbol, ticks, n) {
    var base = BASE[symbol];
    if (base === undefined) return [];
    var rand = GeFi.seed.rng(GeFi.seed.hash("lt|" + symbol));
    var last = base;
    var out = [base];
    for (var i = 0; i < ticks; i++) {
      last = Math.max(1, last * (1 + (rand() - 0.5) * 0.004));
      out.push(last);
    }
    var keep = n || 40;
    return out.length > keep ? out.slice(out.length - keep) : out;
  }

  /* Paper-fill rules:
   *   market — fills immediately at the current price;
   *   limit  — fills only when the market has crossed the limit
   *            (buy: price <= limit; sell: price >= limit);
   *   stop   — mirror image of limit (buy: price >= stop). */
  function fillPrice(order, price) {
    var type = (order.type || "market").toLowerCase();
    var side = (order.side || "buy").toLowerCase();
    if (type === "market") return +price.toFixed(2);
    var trigger = order.limit != null ? order.limit : order.price;
    if (trigger == null) return +price.toFixed(2);
    if (type === "limit") {
      if (side === "buy" ? price <= trigger : price >= trigger) return +price.toFixed(2);
      return null;
    }
    if (type === "stop") {
      if (side === "buy" ? price >= trigger : price <= trigger) return +price.toFixed(2);
      return null;
    }
    return +price.toFixed(2);
  }

  /* Positions derived from the opening book plus filled orders. */
  function positions(orders, ticks) {
    var map = {};
    START_POSITIONS.forEach(function (p) {
      map[p.symbol] = { symbol: p.symbol, qty: p.qty, cost: p.qty * p.avg };
    });
    (orders || []).forEach(function (o) {
      if (o.status !== "filled" || o.fill == null) return;
      var p = map[o.symbol] || (map[o.symbol] = { symbol: o.symbol, qty: 0, cost: 0 });
      if (String(o.side).toLowerCase() === "buy") {
        p.qty += o.qty;
        p.cost += o.qty * o.fill;
      } else {
        var avg = p.qty > 0 ? p.cost / p.qty : o.fill;
        p.qty -= o.qty;
        p.cost -= o.qty * avg;
      }
    });
    return Object.keys(map)
      .map(function (s) {
        var p = map[s];
        var avg = p.qty > 0 ? p.cost / p.qty : 0;
        var last = priceAt(s, ticks || 0);
        return {
          symbol: s,
          qty: p.qty,
          avg: +avg.toFixed(2),
          last: last == null ? null : +last.toFixed(2),
          pnl: last == null ? 0 : +((last - avg) * p.qty).toFixed(2),
        };
      })
      .filter(function (p) {
        return p.qty !== 0;
      });
  }

  GeFi.market = {
    BASE: BASE,
    START_POSITIONS: START_POSITIONS,
    symbols: symbols,
    priceAt: priceAt,
    seriesAt: seriesAt,
    fillPrice: fillPrice,
    positions: positions,
  };
})(typeof window !== "undefined" ? window : globalThis);
