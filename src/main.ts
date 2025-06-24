// // // src/main.ts
// // import { createApp } from 'vue'
// // import { createPinia } from 'pinia'
// // import router from './router'
// // import App from './App.vue'
// // import './assets/main.css'

// // // Import Web3-Onboard
// // import { init } from '@web3-onboard/vue'
// // import injectedModule from '@web3-onboard/injected-wallets'
// // import walletConnectModule from '@web3-onboard/walletconnect'

// // // Your WalletConnect Project ID from https://cloud.walletconnect.com
// // const wcV2InitOptions = {
// //   projectId: 'YOUR_PROJECT_ID', // <-- 🚨 GET YOUR OWN PROJECT ID
// //   requiredChains: [1], // We'll default to Ethereum Mainnet
// //   optionalChains: [137, 10, 42161], // Polygon, Optimism, Arbitrum
// //   dappUrl: 'https://your-portfolio-url.com' // Your app's metadata
// // }

// // const injected = injectedModule()
// // const walletConnect = walletConnectModule(wcV2InitOptions)

// // const web3Onboard = init({
// //   wallets: [injected, walletConnect],
// //   chains: [
// //     { id: '0x1', token: 'ETH', label: 'Ethereum Mainnet', rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_ID' },
// //     { id: '0x89', token: 'MATIC', label: 'Polygon', rpcUrl: 'https://polygon-rpc.com' },
// //     { id: '0xa', token: 'ETH', label: 'Optimism', rpcUrl: 'https://mainnet.optimism.io' },
// //   ],
// //   appMetadata: {
// //     name: 'CtxOS',
// //     icon: '<svg>Your_SVG_Icon</svg>',
// //     description: 'The portfolio of ctx, a developer.',
// //     recommendedInjectedWallets: [
// //       { name: 'MetaMask', url: 'https://metamask.io' },
// //       { name: 'Rainbow', url: 'https://rainbow.me' },
// //     ]
// //   },
// //   theme: 'dark' // Matches our OS theme
// // })

// // const app = createApp(App)

// // app.use(createPinia())
// // app.use(router)
// // app.use(web3Onboard) // Use the Web3-Onboard plugin

// // app.mount('#app')
// import { createApp } from 'vue'
// import { createPinia } from 'pinia'
// import router from './router'
// import App from './App.vue'
// import './assets/main.css'

// // Import the MotionPlugin for v-motion animations
// import { MotionPlugin } from '@vueuse/motion'

// const app = createApp(App)

// app.use(createPinia())
// app.use(router)

// // Register the MotionPlugin with your Vue app
// app.use(MotionPlugin)

// app.mount('#app')

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/main.css'
import { MotionPlugin } from '@vueuse/motion'

// 1. Import the highlight.js Vue plugin
import hljsVuePlugin from '@highlightjs/vue-plugin'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(MotionPlugin)

// 2. Register the plugin with your Vue app
app.use(hljsVuePlugin)

app.mount('#app')