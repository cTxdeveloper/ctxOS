import { storeToRefs } from 'pinia'
import { useWalletStore } from '../store/walletStore'

/**
 * The final, robust composable for interacting with the wallet via Web3-Onboard.
 */
export function useWeb3() {
  const walletStore = useWalletStore()

  // Use storeToRefs to get reactive state properties
  const { isConnected, address, ensName, chainId } = storeToRefs(walletStore)

  // Get the actions directly from the store
  const { connectWallet, disconnectWallet, signMessage } = walletStore

  // Expose the state and actions to the components
  return {
    isConnected,
    address,
    ensName,
    chainId,
    connect: connectWallet,
    disconnect: disconnectWallet,
    signMessage,
  }
}