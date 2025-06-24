<template>
  <div>
    <h2 class="font-primary text-lg text-text-primary mb-4">Web3 Guestbook (Sepolia Testnet)</h2>
    
    <button class="bg-accent1 text-background font-bold py-2 px-4 rounded hover:brightness-110">
      Connect Wallet
    </button>
    
    <div class="mt-4">
      <p class="text-text-secondary">Status: Not Connected</p>
    </div>

    <div class="mt-6">
        <h3 class="font-primary text-text-primary">Sign the Book:</h3>
        <input type="text" placeholder="Your message..." class="w-full bg-panel border border-border p-2 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-accent1"/>
        <button class="bg-accent2 text-background font-bold py-2 px-4 rounded hover:brightness-110 mt-2">
            Sign & Submit
        </button>
    </div>
    
    <div class="mt-6">
        <h3 class="font-primary text-text-primary">Entries:</h3>
        <div class="mt-2 p-2 border border-border rounded h-40 overflow-y-auto">
            <p class="text-text-secondary text-sm">Guestbook entries will appear here...</p>
        </div>
    </div>
  </div>
</template>