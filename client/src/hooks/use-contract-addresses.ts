import { getContractAddresses } from "@/config/contracts";
import { useActiveChainWithDefault } from "./useChainWithDefault";

export const useContractAddresses = () => {
  const chain = useActiveChainWithDefault();

  return getContractAddresses(chain.id);
};
