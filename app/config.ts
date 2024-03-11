// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : 'https://hot-potato-frame.vercel.app';

export const CONTRACT_ADDR = '0x303e6ea2b939ce1be24ab16d66020696097910af'

export const HOT_POTATO_ADDR = "0xb21FC6838708CF3CD539fE17012f9A8aF1C509dC"