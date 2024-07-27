<script setup>
  import { useSheetStore } from '@/stores/sheetStore.js'
  // The sheet store is where you want to be to customize what data / fields are on your sheet.
  const sheet = useSheetStore()
</script>

<template>
  <div class="card">
    <div class="subtitle">Abilities</div>
    <label for="faction">
    <span class="label">Faction</span>
    </label>
    <input id="faction" v-model="sheet.faction" />
  </div>
</template>