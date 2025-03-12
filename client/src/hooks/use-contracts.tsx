import {
  PresaleAddress,
  StakeAddress,
  USDTAddress,
  OwnTokenAddress,
} from "@/constants/contracts";
import { client } from "@/lib/client";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useChainMetadata } from "thirdweb/react";

const presaleABI = [
  {
    type: "function",
    name: "UPGRADE_INTERFACE_VERSION",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "string",
        name: "",
      },
    ],
  },

  {
    type: "function",
    name: "getAllPresaleRounds",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "tuple[]",
        name: "",
        components: [
          {
            type: "uint256",
            name: "duration",
          },
          {
            type: "uint256",
            name: "price",
          },
          {
            type: "uint256",
            name: "allocation",
          },
          {
            type: "uint256",
            name: "sales",
          },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getCurrentPresaleRoundDetails",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "bool",
        name: "success",
      },
      {
        type: "tuple",
        name: "",
        components: [
          {
            type: "uint256",
            name: "duration",
          },
          {
            type: "uint256",
            name: "price",
          },
          {
            type: "uint256",
            name: "allocation",
          },
          {
            type: "uint256",
            name: "sales",
          },
        ],
      },
      {
        type: "uint256",
        name: "roundId",
      },
    ],
  },
  {
    type: "function",
    name: "getUsersPresalePurchases",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "address",
        name: "_user",
      },
    ],
    outputs: [
      {
        type: "tuple[]",
        name: "",
        components: [
          {
            type: "uint256",
            name: "roundId",
          },
          {
            type: "uint256",
            name: "ownAmount",
          },
          {
            type: "uint256",
            name: "usdtAmount",
          },
          {
            type: "address",
            name: "receiver",
          },
          {
            type: "uint256",
            name: "timestamp",
          },
          {
            type: "bool",
            name: "claimed",
          },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "hasPresaleStarted",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "bool",
        name: "",
      },
    ],
  },

  {
    type: "function",
    name: "own",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "address",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "owner",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "address",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "presalePurchases",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "address",
        name: "",
      },
      {
        type: "uint256",
        name: "",
      },
    ],
    outputs: [
      {
        type: "uint256",
        name: "roundId",
      },
      {
        type: "uint256",
        name: "ownAmount",
      },
      {
        type: "uint256",
        name: "usdtAmount",
      },
      {
        type: "address",
        name: "receiver",
      },
      {
        type: "uint256",
        name: "timestamp",
      },
      {
        type: "bool",
        name: "claimed",
      },
    ],
  },
  {
    type: "function",
    name: "presaleRounds",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
    outputs: [
      {
        type: "uint256",
        name: "duration",
      },
      {
        type: "uint256",
        name: "price",
      },
      {
        type: "uint256",
        name: "allocation",
      },
      {
        type: "uint256",
        name: "sales",
      },
    ],
  },
  {
    type: "function",
    name: "proxiableUUID",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "bytes32",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "startPresaleTime",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "totalSales",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
  },
  {
    type: "function",
    name: "updatePresaleRoundPrice",
    constant: false,
    payable: false,
    stateMutability: "nonpayable",
    inputs: [
      {
        type: "uint256",
        name: "_roundId",
      },
      {
        type: "uint256",
        name: "_newPrice",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "upgradeToAndCall",
    constant: false,
    stateMutability: "payable",
    payable: true,
    inputs: [
      {
        type: "address",
        name: "newImplementation",
      },
      {
        type: "bytes",
        name: "data",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "usdt",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "address",
        name: "",
      },
    ],
  },
] as const;

export const useContracts = () => {
  // const { data: chainMetadata } = useChainMetadata();
  // if (chainMetadata.name === '')
  const usdtContract = getContract({
    client,
    address: USDTAddress,
    // chain: chainMetadata?.chain,
    chain: sepolia,
  });

  const presaleContract = getContract({
    client,
    address: PresaleAddress,
    chain: sepolia,
    abi: presaleABI,
  });

  const stakeContract = getContract({
    client,
    address: StakeAddress,
    chain: sepolia,
    // abi: stakeABI,
  });

  const ownTokenContract = getContract({
    client,
    address: OwnTokenAddress,
    chain: sepolia,
  });
  return { usdtContract, presaleContract, stakeContract, ownTokenContract };
};
