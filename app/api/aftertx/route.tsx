import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { getContract, formatEther , } from 'viem'

import { HOT_POTATO_ADDR, NEXT_PUBLIC_URL } from '../../config';
import abi from '../../_contracts/HotPotatoAbi';
import  client  from '../../client';
async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const contract = getContract({
    address: HOT_POTATO_ADDR,
    abi: abi,
    client,
  });

  const currentPrice= await contract.read.CURRENT_PRICE();
  const displayCurrentPrice = parseFloat(formatEther(currentPrice as bigint)).toFixed(3);
  //console.log(currentPrice)
  const nextPrice= await contract.read.nextPrice();
  const displayNextPrice = parseFloat(formatEther(nextPrice as bigint)).toFixed(4);

  const flipCount= await contract.read.FLIP_COUNT();

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          action: 'post',
          label: `Current Price: ${displayCurrentPrice} E`,
          target: "#",
        },
        {
          action: 'post',
          label: `Next Price: ${displayNextPrice} E`,
          target: "#",
        },
        {
          action: 'tx',
          label: `🔥  Again! 🔥`,
          target: `${NEXT_PUBLIC_URL}/api/potato`,
        }
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/potato-sold.png`,
        aspectRatio: '1:1',
      },
      /*
      input: {
        text: 'Hot potato flipped!',
      },*/
      postUrl: `${NEXT_PUBLIC_URL}/api/aftertx`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';