import { getFrameMetadata } from '@coinbase/onchainkit';
import { getContract, formatEther , } from 'viem'
import  client  from './client';

import type { Metadata } from 'next';
import { HOT_POTATO_ADDR, NEXT_PUBLIC_URL } from './config';

import abi from './_contracts/HotPotatoAbi';

const  doAsyncWork = async ()=>{

  const contract = getContract({
    address: HOT_POTATO_ADDR,
    abi: abi,
    client,
  });

  const currentPrice= await contract.read.CURRENT_PRICE();
  //console.log(currentPrice)
  const nextPrice= await contract.read.nextPrice();
  const flipCount= await contract.read.FLIP_COUNT();
  const blockNumber = await client.getBlockNumber();
  


}

const getButtonPrice = async ()=>{ 
  
  // how to get the current price here async?
 
  return "ddd";
}

const frameMetadata = getFrameMetadata(
{
  buttons: [
    {
      action: 'post',
      label: `🔥 Tell me! 🔥`,
      target: `${NEXT_PUBLIC_URL}/api/detail`,
    }
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/potato.webp`,
    aspectRatio: '1:1',
  },
  /*
  input: {
    text: "Don't click the button!",
  },*/
  //postUrl: `${NEXT_PUBLIC_URL}/api/aftertx`,
});

export const metadata: Metadata = {
  title: 'Hot Potato!',
  description: "Hot Potato!",
  openGraph: {
    title: 'Hot Potato!',
    description: "Hot Potato!",
    images: [`${NEXT_PUBLIC_URL}/potato.webp`],
  },
  other: {
    ...frameMetadata,
  },
};

export default async function Page() {

  const contract = getContract({
    address: HOT_POTATO_ADDR,
    abi: abi,
    client,
  });

  const currentPrice= await contract.read.CURRENT_PRICE();
  //console.log(currentPrice)
  const nextPrice= await contract.read.nextPrice();
  const flipCount= await contract.read.FLIP_COUNT();

  const blockNumber = await client.getBlockNumber();

  return (
    <>
      <h1>Let's make it hot!</h1>
      <p>This hot potato is a unique NFT.</p>
      <p>Every time it flips, it's price increases by 10%</p>

      <p>Current price: {formatEther(currentPrice as bigint)} ETH</p>
      <p>Current price wei: {(currentPrice as bigint).toString()}</p>

      <p>Next price: {formatEther(nextPrice as bigint)} ETH</p>

      <p>Flip count: {(flipCount as bigint).toString()}</p>


      <img src={NEXT_PUBLIC_URL+"/potato.webp"}/>
    </>
  );
}