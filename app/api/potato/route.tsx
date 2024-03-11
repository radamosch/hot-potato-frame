// import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
// import { NextRequest, NextResponse } from 'next/server';
// import { encodeFunctionData, formatEther, parseEther, parseGwei, getContract} from 'viem';
// import { base } from 'viem/chains';
// import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';

// import abi from '../../_contracts/HotPotatoAbi';
// import { HOT_POTATO_ADDR } from '../../config';
// import client from "../../client"

// async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
//     const body: FrameRequest = await req.json();
//     const { isValid } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

//     if (!isValid) {
//       return new NextResponse('Message not valid', { status: 500 });
//     }

//     const contract = getContract({
//       address: HOT_POTATO_ADDR,
//       abi: abi,
//       client,
//     });

//     const currentPrice= await contract.read.CURRENT_PRICE();

//     console.log(currentPrice);

//     const data = encodeFunctionData({
//         abi: abi,
//         functionName: 'purchase',
//       });

//       const txData: FrameTransactionResponse = {
//         chainId: `eip155:${base.id}`,
//         method: 'eth_sendTransaction',
//         params: {
//           abi: [],
//           data,
//           to: HOT_POTATO_ADDR,
//           value: (currentPrice as bigint).toString()
//          // value: parseGwei('10000').toString(), // 0.00001 ETH
//         },
//       };

//       return NextResponse.json(txData);

//   }

//   export async function POST(req: NextRequest): Promise<Response> {
//     return getResponse(req);
//   }




//   export const dynamic = 'force-dynamic';

import { base } from 'viem/chains';
import { encodeFunctionData, formatEther, parseEther, parseGwei, getContract } from 'viem';
import { TransactionTargetResponse } from "frames.js";
import { NextRequest, NextResponse } from "next/server";
import { HOT_POTATO_ADDR } from '../../config';
import client from "../../client"
import abi from '../../_contracts/HotPotatoAbi';

export async function POST(
  req: NextRequest
): Promise<NextResponse<TransactionTargetResponse>> {

  const contract = getContract({
    address: HOT_POTATO_ADDR,
    abi: abi,
    client,
  });

  const currentPrice = await contract.read.CURRENT_PRICE();
  const data = encodeFunctionData({
    abi: abi,
    functionName: 'purchase',
  });
  return NextResponse.json({
    chainId: `eip155:${base.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: [],
      data,
      to: HOT_POTATO_ADDR,
      value: (currentPrice as bigint).toString()
    },
  });
}

