import { defineStore } from 'pinia'
import { markRaw, type Eip1193Provider } from 'vue'
import { init } from '@web3-onboard/vue'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import { ethers } from 'ethers'
import { toast } from 'vue-sonner'

// This initialization is done ONCE and exported.
export const web3Onboard = init({
  wallets: [
    injectedModule(),
    walletConnectModule({ 
      projectId: 'df36c817dc124db8d6b9beccf8a35c2f',
      dappUrl: window.location.origin 
    })
  ],
  chains: [
    { id: '0x1', token: 'ETH', label: 'Ethereum Mainnet', rpcUrl: `https://mainnet.infura.io/v3/e8504a2dd99e4354964f32159fd754df` },
    { id: '0x89', token: 'MATIC', label: 'Polygon', rpcUrl: 'https://polygon-rpc.com' }
  ],
  appMetadata: {
    name: 'CtxOS',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 17L10 11L4 5" stroke="#73daca" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 19H20" stroke="#c0caf5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    description: 'The portfolio of ctx, a developer.'
  },
  
  // THE FIX: The `nsr` property is removed from both desktop and mobile
  // as it is no longer a valid configuration option.
  accountCenter: {
    desktop: {
      enabled: true
      // nsr: { enabled: false } <-- REMOVED
    },
    mobile: {
      enabled: true
      // nsr: { enabled: false } <-- REMOVED
    }
  },
  theme: 'dark'
})

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    provider: null as ethers.BrowserProvider | null,
    signer: null as ethers.Signer | null,
    isConnected: false,
    address: null as string | null,
    ensName: null as string | null,
    chainId: null as number | null,
  }),

  actions: {
    async setWallet(wallet: any) {
      try {
        this.isConnected = true;
        const ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any');
        this.provider = markRaw(ethersProvider);
        const signer = await ethersProvider.getSigner();
        this.signer = markRaw(signer);
        this.address = signer.address;
        this.chainId = parseInt(wallet.chains[0].id, 16);
        
        // This manual ENS fetching remains correct.
        if ([1].includes(this.chainId)) { // Only check on Ethereum Mainnet
          try {
            this.ensName = await ethersProvider.lookupAddress(this.address);
          } catch (error) {
            console.warn("ENS lookup failed:", error);
            this.ensName = null;
          }
        } else {
          this.ensName = null;
        }
        
        toast.success("Wallet Connected", { description: this.ensName || this.address.slice(0, 10) + '...' });
      } catch (error) {
        console.error("Error setting wallet state:", error);
        this.resetState();
      }
    },
    
    resetState() {
      this.provider = null;
      this.signer = null;
      this.isConnected = false;
      this.address = null;
      this.ensName = null;
      this.chainId = null;
    },

    async signMessage(message: string) {
      if (!this.signer) {
        toast.error("Wallet not connected.");
        return null;
      }
      try {
        const signature = await this.signer.signMessage(message);
        toast.success("Message Signed!", { description: `Signature: ${signature.slice(0, 12)}...` });
        return signature;
      } catch (error) {
        toast.error("Message signing failed or was rejected.");
        return null;
      }
    }
  }
})