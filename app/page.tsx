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

  console.log(HOT_POTATO_ADDR)

  const currentPrice = await contract.read.CURRENT_PRICE();
  console.log(currentPrice)
  //console.log(currentPrice)
  const nextPrice = await contract.read.nextPrice();
  const flipCount = await contract.read.FLIP_COUNT();
  console.log(flipCount);
  console.log(flipCount as bigint);

  var imageIndex = parseInt(parseInt(flipCount as string)/5+""); // step every 5
  if (imageIndex>9)imageIndex=9; // 9 is the last image


  const blockNumber = await client.getBlockNumber();

  console.log(imageIndex);

  return (
    <>
      <meta name="og:image" content={`${NEXT_PUBLIC_URL}/potato.webp`} />
      <meta name="fc:frame" content="vNext" />
      <meta name="fc:frame:image" content={`https://image.hot-potato.lol/get-potato`} />
      <meta name="fc:frame:refresh_period" content="4"/>
      <meta name="fc:frame:post_url" content={`${NEXT_PUBLIC_URL}/api/aftertx`} />
      <meta name="fc:frame:image:aspect_ratio" content="1:1" />
      {/*
      <meta name="fc:frame:button:1" content={`Price: ${parseFloat(formatEther(currentPrice as bigint)).toFixed(3)} Ξ`} />
      <meta name="fc:frame:button:1:action" content="post" />
      <meta name="fc:frame:button:1:target" content="#" />
      <meta name="fc:frame:button:2" content={`Next: ${parseFloat(formatEther(nextPrice as bigint)).toFixed(4)} Ξ`} />
      <meta name="fc:frame:button:2:action" content="post" />
      <meta name="fc:frame:button:2:target" content="#" />
    */}
      <meta name="fc:frame:button:1" content="BUY NOW!" />
      <meta name="fc:frame:button:1:action" content="tx" />
      <meta name="fc:frame:button:1:target" content={`${NEXT_PUBLIC_URL}/api/potato`} />
    </>
  );
}