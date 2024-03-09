// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : 'https://zizzamia.xyz';
export const BUY_MY_COFFEE_CONTRACT_ADDR = '0xcD3D5E4E498BAb2e0832257569c3Fd4AE439dD6f';



export const CLICK_THE_BUTTON_CONTRACT_ADDR = '0x303e6ea2b939ce1be24ab16d66020696097910af'
