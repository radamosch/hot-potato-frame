import { getFrameMetadata } from '@coinbase/onchainkit';
import { createPublicClient, http , getContract } from 'viem'
import { base } from 'viem/chains';

import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';


import ClickTheButtonABI from './_contracts/ClickTheButtonAbi';
import { CONTRACT_ADDR } from './config';


const frameMetadata = getFrameMetadata({
  buttons: [
    {
      action: 'tx',
      label: 'Click the Button',
      target: `${NEXT_PUBLIC_URL}/api/potato`,
    },
    {
      action: 'link',
      label: 'WTF?',
      target: `${NEXT_PUBLIC_URL}/`,
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/hot-potato.png`,
    aspectRatio: '1:1',
  },
  input: {
    text: "Don't click the button!",
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/aftertx`,
});

export const metadata: Metadata = {
  title: 'Click my Button',
  description: "Don't click the button!",
  openGraph: {
    title: 'Click my Button',
    description: "Don't click the button!",
    images: [`${NEXT_PUBLIC_URL}/hot-potato.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default async function Page() {

  const client = createPublicClient({
    chain: base,
    transport: http(),
  });

  const contract = getContract({
    address: CONTRACT_ADDR,
    abi: ClickTheButtonABI,
    client,
  });

  const allClicks= await contract.read.getAllClicks();

  const blockNumber = await client.getBlockNumber();

  return (
    <>
      <h1>Let's make it hot!</h1>
      <p>Base block number (reading contract): {blockNumber.toString()}</p>
      <p>This hot potato is a unique NFT.</p>
      <p>Every time it flips, it's price increases by 10%</p>
      <img src={NEXT_PUBLIC_URL+"/hot-potato.png"}/>
    </>
  );
}