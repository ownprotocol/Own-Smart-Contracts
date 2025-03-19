export interface PresaleRoundDetails {
  duration: number;
  price: number;
  allocation: number;
  sales: number;
  claimTokensTimestamp: number;
}

export interface CurrentPresaleRoundDetails {
  roundsInProgress: boolean;
  roundDetails: PresaleRoundDetails;
  roundId: number;
  endTime: number;
}
