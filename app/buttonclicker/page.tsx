import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from '../config';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      action: 'tx',
      label: 'Click the Button',
      target: `${NEXT_PUBLIC_URL}/api/buttonclicker`,
    },
    {
      action: 'link',
      label: 'Leaderboard',
      target: `${NEXT_PUBLIC_URL}/buttonclicker`,
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/park-4.png`,
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
    images: [`${NEXT_PUBLIC_URL}/button.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>Not sure what to put here...</h1>
      <p>TODO</p>
    </>
  );
}