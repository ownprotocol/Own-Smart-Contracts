export interface PresaleRoundDetails {
  roundId: number;
  duration: number;
  price: number;
  allocation: number;
  sales: number;
  claimTokensTimestamp: number;
}

export interface CurrentPresaleRoundDetails {
  hasPresaleStarted: boolean;
  roundsInProgress: boolean;
  roundDetails: PresaleRoundDetails;
  endTime: number;
}

export interface PresalePurchase {
  roundId: number;
  ownAmount: number;
  usdtAmount: number;
  receiver: string;
  timestamp: Date;
  claimStatus: "able-to-claim" | "claimed" | "not-ready-to-claim";
  price: number;
}
