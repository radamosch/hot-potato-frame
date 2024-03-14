// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : 'https://hot-potato-frame.vercel.app';

export const CONTRACT_ADDR = '0x303e6ea2b939ce1be24ab16d66020696097910af'


//0.001
export const HOT_POTATO_ADDR = "0x1E2Ac76F382e793D6e493A5fAd1eCa724C4036cD"

//0.01
//export const HOT_POTATO_ADDR = "0x2F3EC9914919478950F5E1eD524BD8e06AE919cE"