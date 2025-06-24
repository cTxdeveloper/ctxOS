<template>
  <div class="p-4 flex flex-col h-full font-primary">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 flex-shrink-0">
      <h2 class="text-xl text-text-primary">Web3 Dashboard</h2>
      <button 
        v-if="!isConnected" 
        @click="connect" 
        class="bg-accent1 text-background font-bold py-2 px-4 rounded hover:brightness-110 transition-all"
      >
        Connect Wallet
      </button>
      <button 
        v-else 
        @click="disconnect" 
        class="bg-warning text-background font-bold py-2 px-4 rounded hover:brightness-110 transition-all"
      >
        Disconnect
      </button>
    </div>

    <!-- Disconnected State -->
    <div v-if="!isConnected" class="flex-grow flex items-center justify-center text-center text-text-secondary">
      <div>
        <p class="text-lg">Wallet Not Connected</p>
        <p class="text-sm">Please connect your wallet to interact with Web3 features.</p>
      </div>
    </div>

    <!-- Connected State -->
    <div v-else class="flex-grow overflow-y-auto space-y-8">
      <!-- Wallet Info Section with better styling -->
      <div>
        <h3 class="text-lg text-text-primary mb-3">Connected Wallet</h3>
        <!-- THE FIX: Applying the glass-pane class internally for layering -->
        <div class="glass-pane -mx-2 p-4 rounded-lg bg-background/50 border border-transparent">
          <div class="flex flex-col space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="font-bold">Address:</span>
              <span class="text-text-secondary truncate ml-4">{{ address }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">ENS:</span>
              <span class="text-accent2 font-semibold">{{ ensName || 'Not Found' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold">Chain ID:</span>
              <span class="text-text-secondary">{{ chainId || 'Unknown' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Guestbook Section -->
      <div>
        <h3 class="text-lg text-text-primary mb-2">Sign Guestbook</h3>
        <p class="text-sm text-text-secondary mb-3">Sign a message to prove wallet ownership. This is a gas-less action and does not cost anything.</p>
        <div class="flex flex-col sm:flex-row gap-2">
            <input 
              v-model="guestbookMessage" 
              type="text" 
              placeholder="Your message..." 
              class="w-full bg-panel border border-border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent1"
            />
            <button 
              @click="handleSign" 
              class="bg-accent2 text-background font-bold py-2 px-4 rounded hover:brightness-110 transition-all flex-shrink-0"
            >
                Sign Message
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWeb3 } from '../../composables/useWeb3' 
import { toast } from 'vue-sonner'

const { connect, disconnect, signMessage, isConnected, address, ensName, chainId } = useWeb3()
const guestbookMessage = ref("Hello from CtxOS! This portfolio is awesome.")
const handleSign = () => {
  if (!guestbookMessage.value.trim()) {
    toast.error("Message cannot be empty.")
    return
  }
  signMessage(guestbookMessage.value)
}
</script>