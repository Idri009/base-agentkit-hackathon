// type to describe our trading strategy
export interface Strategy {
  id: string;
  symbol: string;
  contract: string;
  chainId: string;
  frequency: string;
  risk: string;
  active: boolean;
  createdAt: number;
}
