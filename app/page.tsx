import { getFrameMetadata } from '@coinbase/onchainkit';
import { getContract, formatEther, } from 'viem'
import client from './client';

import type { Metadata } from 'next';
import { HOT_POTATO_ADDR, NEXT_PUBLIC_URL } from './config';

import abi from './_contracts/HotPotatoAbi';


export default async function Page() {

  const contract = getContract({
    address: HOT_POTATO_ADDR,
    abi: abi,
    client,
  });

  const currentPrice = await contract.read.CURRENT_PRICE();
  //console.log(currentPrice)
  const nextPrice = await contract.read.nextPrice();
  const flipCount = await contract.read.FLIP_COUNT();

  const blockNumber = await client.getBlockNumber();

  return (
    <>
      <meta name="og:image" content={`${NEXT_PUBLIC_URL}/potato.webp`} />
      <meta name="fc:frame" content="vNext" />
      <meta name="fc:frame:image" content={`${NEXT_PUBLIC_URL}/potato.webp`} />
      <meta name="fc:frame:post_url" content={`${NEXT_PUBLIC_URL}/api/aftertx`} />
      <meta name="fc:frame:image:aspect_ratio" content="1:1" />
      <meta name="fc:frame:button:1" content={`Price: ${parseFloat(formatEther(currentPrice as bigint)).toFixed(3)} Ξ`} />
      <meta name="fc:frame:button:1:action" content="post" />
      <meta name="fc:frame:button:1:target" content="#" />
      <meta name="fc:frame:button:2" content={`Next: ${parseFloat(formatEther(nextPrice as bigint)).toFixed(4)} Ξ`} />
      <meta name="fc:frame:button:2:action" content="post" />
      <meta name="fc:frame:button:2:target" content="#" />
      <meta name="fc:frame:button:3" content="BUY NOW!" />
      <meta name="fc:frame:button:3:action" content="tx" />
      <meta name="fc:frame:button:3:target" content={`${NEXT_PUBLIC_URL}/api/potato`} />
    </>
  );
}