// global.d.ts
interface Window {
  ethereum?: any; // MetaMask injects `ethereum` object, and we specify it as `any` here.
}
