// This hook only exists to assist local testing with hardhat

import { useEffect, useState } from "react";
import { useActiveChainWithDefault } from "./useChainWithDefault";
import { HARDHAT_CHAIN_ID } from "@/constants/network";
import { client } from "@/lib/client";
import { eth_getBlockByNumber, getRpcClient } from "thirdweb";
import { QueryHook } from "@/types/query";

// Not loving we need to do this, but we are unable to end-to-end test frontend flows without this
export const useTestingSafeTimestamp = (): QueryHook<number> => {
  const [safeDate, setSafeDate] = useState<number | null>(null);
  const chain = useActiveChainWithDefault();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      if (chain.id === HARDHAT_CHAIN_ID) {
        const rpcClient = getRpcClient({ client, chain });
        const block = await eth_getBlockByNumber(rpcClient, {});

        setSafeDate(Number(block.timestamp));
      } else {
        setSafeDate(Math.floor(Date.now() / 1000));
      }
    })();
  }, [chain]);

  if (!safeDate) {
    return { isLoading: true };
  }

  return { isLoading: false, data: safeDate };
};
