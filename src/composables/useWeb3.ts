import { storeToRefs } from 'pinia'
import { useWalletStore, web3Onboard } from '../store/walletStore'
import { useOnboard } from '@web3-onboard/vue'
import { watch } from 'vue'
import { toast } from 'vue-sonner'

/**
 * The definitive composable for Web3 interaction.
 * It uses the `useOnboard` hook correctly and syncs with our Pinia store.
 */
export function useWeb3() {
  const walletStore = useWalletStore()

  // These are from the Web3-Onboard library's composable, called in the correct context.
  const { connectWallet, connectedWallet, disconnectWallet } = useOnboard()

  // These are our clean, reactive state properties from our Pinia store.
  const { isConnected, address, ensName, chainId } = storeToRefs(walletStore)

  // This is the main connection function the UI will call.
  const connect = async () => {
    try {
      await connectWallet()
    } catch (error) {
      console.error("Error in connect sequence:", error)
    }
  }

  // This is the disconnect function.
  const disconnect = async () => {
    if (connectedWallet.value) {
      await disconnectWallet(connectedWallet.value)
      // The watcher below will automatically call resetState.
      toast.info("Wallet Disconnected")
    }
  }

  // Use a Vue watcher to react to changes from Web3-Onboard
  // and update our Pinia store accordingly.
  watch(connectedWallet, (newWallet) => {
    if (newWallet) {
      // THE FIX: Call the action directly on the store instance.
      // This preserves the `this` context and solves the TypeError.
      walletStore.setWallet(newWallet)
    } else {
      walletStore.resetState()
    }
  }, { 
    immediate: true 
  })

  // Return the clean API for our components to use.
  return {
    isConnected,
    address,
    ensName,
    chainId,
    connect,
    disconnect,
    // Pass through the signMessage action by calling it on the store instance.
    signMessage: (message: string) => walletStore.signMessage(message),
  }
}