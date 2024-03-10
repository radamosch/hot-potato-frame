// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : 'https://hot-potato-frame.vercel.app';

export const CONTRACT_ADDR = '0x303e6ea2b939ce1be24ab16d66020696097910af'

export const HOT_POTATO_ADDR = "0x73C1183B672d175E8F288C3623C53724bf600BF1"