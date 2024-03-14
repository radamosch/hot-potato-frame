import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { getContract, formatEther , } from 'viem'

import { HOT_POTATO_ADDR, NEXT_PUBLIC_URL } from '../../config';
import abi from '../../_contracts/HotPotatoAbi';
import  client  from '../../client';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  await sleep(10000); // sleep for 10 seconds to allow tran

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
  var imageIndex = parseInt(parseInt(flipCount as string)/5+""); // step every 5
  if (imageIndex>9)imageIndex=9; // 9 is the last image

  const timestamp = Math.floor(Date.now() / 1000);

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        /*
        {
          action: 'post',
          label: `Price: ${displayCurrentPrice}  Ξ`,
          target: "#",
        },
        {
          action: 'post',
          label: `Next : ${displayNextPrice} Ξ`,
          target: "#",
        },*/
        {
          action: 'tx',
          label: `BUY AGAIN!`,
          target: `${NEXT_PUBLIC_URL}/api/potato`,
        }
      ],
      image: {
        src: `https://image.hot-potato.lol/get-potato?${timestamp}`,
        aspectRatio: '1.91:1',
      },
      refreshPeriod: 4,
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