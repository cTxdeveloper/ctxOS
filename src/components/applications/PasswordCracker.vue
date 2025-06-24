<template>
  <div class="p-4 flex flex-col h-full font-primary text-sm">
    <div class="flex-shrink-0 mb-6">
      <h2 class="text-xl text-text-primary mb-1">Password Strength Demo</h2>
      <p class="text-text-secondary">See how different hashing algorithms protect a password and simulate a dictionary attack.</p>
    </div>

    <!-- Input Section -->
    <div class="mb-6">
      <label for="password-input" class="font-bold text-text-primary mb-2 block">1. Enter a simple password</label>
      <div class="flex gap-2">
        <input
          id="password-input"
          v-model="password"
          type="text"
          placeholder="e.g., dog123"
          class="w-full bg-panel border border-border p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent1"
        />
        <button @click="generateHashes" class="bg-accent1 text-background font-bold py-2 px-4 rounded hover:brightness-110 transition-all flex-shrink-0">
          Hash It
        </button>
      </div>
    </div>

    <!-- Hashes Display Section -->
    <div class="mb-6" v-if="hashes.md5">
      <h3 class="font-bold text-text-primary mb-2">2. Generated Hashes</h3>
      <div class="space-y-2 text-xs">
        <div class="p-2 bg-warning/10 rounded">
          <p class="font-bold text-warning">MD5 (Insecure)</p>
          <p class="text-text-secondary break-all">{{ hashes.md5 }}</p>
        </div>
        <div class="p-2 bg-yellow-400/10 rounded">
          <p class="font-bold text-yellow-400">SHA-1 (Weak)</p>
          <p class="text-text-secondary break-all">{{ hashes.sha1 }}</p>
        </div>
        <div class="p-2 bg-accent2/10 rounded">
          <p class="font-bold text-accent2">SHA-256 (Secure)</p>
          <p class="text-text-secondary break-all">{{ hashes.sha256 }}</p>
        </div>
      </div>
    </div>
    
    <!-- Attack Simulation Section -->
    <div class="flex-grow flex flex-col" v-if="hashes.md5">
      <h3 class="font-bold text-text-primary mb-2">3. Simulate Dictionary Attack</h3>
      <button @click="simulateAttack" :disabled="isAttacking" class="bg-warning text-background font-bold py-2 px-4 rounded hover:brightness-110 transition-all disabled:opacity-50 w-full mb-2">
        {{ isAttacking ? 'Attacking...' : 'Crack MD5 Hash' }}
      </button>
      <div class="flex-grow bg-black/50 rounded p-2 overflow-y-auto">
        <div v-if="!attackLog.length && !crackedPassword" class="text-text-secondary">Attack log will appear here...</div>
        <div v-for="(log, index) in attackLog" :key="index" class="text-text-secondary">
          <span class="text-warning">[FAIL]</span> Trying: {{ log }}
        </div>
        <div v-if="crackedPassword" class="text-accent2 font-bold mt-2">
          <p>[SUCCESS] Password found!</p>
          <p>Cracked: "{{ crackedPassword }}" in {{ attackTime }}ms</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import CryptoJS from 'crypto-js';

// --- STATE ---
const password = ref('hello');
const hashes = reactive({
  md5: '',
  sha1: '',
  sha256: ''
});

const isAttacking = ref(false);
const attackLog = ref<string[]>([]);
const crackedPassword = ref('');
const attackTime = ref(0);

// A small dictionary for the simulation
const dictionary = [
  '123456', 'password', 'qwerty', 'admin', 'pass', 'cat', 'dog', 'apple', 'test', '123', 'hello', 'world', 'secret'
];

// --- METHODS ---

const generateHashes = () => {
  if (!password.value) return;
  hashes.md5 = CryptoJS.MD5(password.value).toString();
  hashes.sha1 = CryptoJS.SHA1(password.value).toString();
  hashes.sha256 = CryptoJS.SHA256(password.value).toString();
  // Reset attack state when new hashes are generated
  resetAttack();
}

const resetAttack = () => {
  isAttacking.value = false;
  attackLog.value = [];
  crackedPassword.value = '';
  attackTime.value = 0;
}

const simulateAttack = () => {
  resetAttack();
  isAttacking.value = true;
  const startTime = performance.now();

  let i = 0;
  const interval = setInterval(() => {
    if (i >= dictionary.length) {
      // Password not in our small dictionary
      clearInterval(interval);
      isAttacking.value = false;
      crackedPassword.value = 'NOT FOUND in dictionary.';
      attackTime.value = Math.round(performance.now() - startTime);
      return;
    }

    const word = dictionary[i];
    attackLog.value.push(word);

    // Check if the MD5 hash of the dictionary word matches
    if (CryptoJS.MD5(word).toString() === hashes.md5) {
      clearInterval(interval);
      isAttacking.value = false;
      crackedPassword.value = word;
      attackTime.value = Math.round(performance.now() - startTime);
    }
    
    i++;
  }, 75); // Adjust speed of the simulation
}

// Generate initial hashes on component load
generateHashes();
</script>