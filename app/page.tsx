// import { getFrameMetadata } from '@coinbase/onchainkit';
// import { getContract, formatEther, } from 'viem'
// import client from './client';

// import type { Metadata } from 'next';
// import { HOT_POTATO_ADDR, NEXT_PUBLIC_URL } from './config';

// import abi from './_contracts/HotPotatoAbi';


// const getButtonPrice = () => {

//   // how to get the current price here async?

//   return "";
// }

// const frameMetadata = getFrameMetadata(
//   {
//     buttons: [
//       {
//         action: 'tx',
//         label: `🔥  Buy:  ${getButtonPrice()} 🔥`,
//         target: `${NEXT_PUBLIC_URL}/api/potato`,
//       },
//       {
//         action: 'link',
//         label: 'INFO?',
//         target: `${NEXT_PUBLIC_URL}/`,
//       },
//     ],
//     image: {
//       src: `${NEXT_PUBLIC_URL}/potato.webp`,
//       aspectRatio: '1:1',
//     },
//     /*
//     input: {
//       text: "Don't click the button!",
//     },*/
//     postUrl: `${NEXT_PUBLIC_URL}/api/aftertx`,
//   });

// export const metadata: Metadata = {
//   title: 'Buy me now!',
//   description: "Hurry up!",
//   openGraph: {
//     title: 'Buy me now!',
//     description: "Hurry up!",
//     images: [`${NEXT_PUBLIC_URL}/potato.webp`],
//   },
//   other: {
//     ...frameMetadata,
//   },
// };

// export default async function Page() {

//   const contract = getContract({
//     address: HOT_POTATO_ADDR,
//     abi: abi,
//     client,
//   });

//   const currentPrice = await contract.read.CURRENT_PRICE();
//   //console.log(currentPrice)
//   const nextPrice = await contract.read.nextPrice();
//   const flipCount = await contract.read.FLIP_COUNT();

//   const blockNumber = await client.getBlockNumber();

//   return (
//     <>
//       <h1>Let's make it hot!</h1>
//       <p>This hot potato is a unique NFT.</p>
//       <p>Every time it flips, it's price increases by 10%</p>

//       <p>Current price: {formatEther(currentPrice as bigint)} ETH</p>
//       <p>Current price wei: {(currentPrice as bigint).toString()}</p>

//       <p>Next price: {formatEther(nextPrice as bigint)} ETH</p>

//       <p>Flip count: {(flipCount as bigint).toString()}</p>


//       <img src={NEXT_PUBLIC_URL + "/potato.webp"} />
//     </>
//   );
// }
import { getContract, formatEther, } from 'viem'
import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  FrameReducer,
  NextServerPageProps,
  getFrameMessage,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import Link from "next/link";
import client from './client';
import { HOT_POTATO_ADDR, NEXT_PUBLIC_URL } from './config';

import abi from './_contracts/HotPotatoAbi';
import { DEFAULT_DEBUGGER_HUB_URL, createDebugUrl } from "./debug";
import { currentURL } from "./utils";

type State = {
  active: string;
  total_button_presses: number;
};

const initialState = { active: "1", total_button_presses: 0 };

const reducer: FrameReducer<State> = (state, action) => {
  return {
    total_button_presses: state.total_button_presses + 1,
    active: action.postBody?.untrustedData.buttonIndex
      ? String(action.postBody?.untrustedData.buttonIndex)
      : "1",
  };
};

// This is a react server component only
export default async function Home({ searchParams }: NextServerPageProps) {

  const contract = getContract({
    address: HOT_POTATO_ADDR,
    abi: abi,
    client,
  });

  const url = currentURL("/");
  const previousFrame = getPreviousFrame<State>(searchParams);

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
  });

  if (frameMessage && !frameMessage?.isValid) {
    throw new Error("Invalid frame payload");
  }

  const [state, dispatch] = useFramesReducer<State>(
    reducer,
    initialState,
    previousFrame
  );

  const currentPrice = await contract.read.CURRENT_PRICE();
  const nextPrice = await contract.read.nextPrice();
  const flipCount = await contract.read.FLIP_COUNT();

  return (
    <div className="p-4">

      <Link href={createDebugUrl(url)} className="underline">
        Debug
      </Link>
      <FrameContainer
        postUrl="/frames"
        pathname="/"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage aspectRatio="1:1">
          <div tw="w-full h-full justify-center items-center flex flex-col">
            <span tw="font-sans text-[420px]">🥔</span>
            <div tw="flex flex-col">
              <div tw="flex flex-col">
                <b tw="text-xl uppercase font-bold">Current price</b>
                {formatEther(currentPrice as bigint)} Ξ
              </div>
              <div tw="flex flex-col my-5">
                <div tw="text-xl uppercase">Next price</div>
                {formatEther(nextPrice as bigint)} Ξ
              </div>
              <div tw="flex flex-col">
                <div tw="text-xl uppercase">Flips</div>
                {(flipCount as bigint).toString()}
              </div>
            </div>

          </div>
        </FrameImage>

        <FrameButton>
          Buy now
        </FrameButton>

      </FrameContainer>
    </div>
  );
}
