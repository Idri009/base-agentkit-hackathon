import { useEffect, useState } from "react";

export interface PriceUpdate {
  strategyId: string;
  priceFeedId: string;
  price: string;
  tokenSymbol: string;
  quoteCurrency: string;
  timestamp: number;
}

export function useLivePrices(): Record<string, PriceUpdate> {
  const [prices, setPrices] = useState<Record<string, PriceUpdate>>({});

  useEffect(() => {
    const source = new EventSource("/api/prices-stream");

    source.onmessage = (event) => {
      const data: PriceUpdate = JSON.parse(event.data);
      setPrices((prev) => ({ ...prev, [data.strategyId]: data }));
    };

    source.onerror = (err) => {
      console.error("SSE error:", err);
      source.close();
    };

    return () => source.close();
  }, []);

  return prices;
}

