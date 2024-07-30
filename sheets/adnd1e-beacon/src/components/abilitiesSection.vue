<script setup>
  import { useSheetStore } from '@/stores/sheetStore.js'
  // The sheet store is where you want to be to customize what data / fields are on your sheet.
  const sheet = useSheetStore()
</script>

<template>
  <div class="card">
    <div class="subtitle">Abilities</div>
    <div class="ability-row">
      <span></span>
      <span></span>
      <span>Mod</span>
    </div>
    <div class="ability-row">
      <label>
        <span>STR</span>
      </label>
        <input id="strength" v-model="sheet.strength" class="input-small" />
        <input id="strengthMod" v-model="sheet.strengthMod" class="input-small" />
    </div>
    <div class="ability-row">
      <label>
        <span>INT</span>
      </label>
        <input id="intelligence" v-model="sheet.intelligence" class="input-small" />
        <input id="intelligenceMod" v-model="sheet.intelligenceMod" class="input-small" />
    </div>
    <div class="ability-row">
      <label>
        <span>WIS</span>
      </label>
        <input id="wisdom" v-model="sheet.wisdom" class="input-small" />
        <input id="wisdomMod" v-model="sheet.wisdomMod" class="input-small" />
    </div>
    <div class="ability-row">
      <label>
        <span>DEX</span>
      </label>
        <input id="dexterity" v-model="sheet.dexterity" class="input-small" />
        <input id="dexterityMod" v-model="sheet.dexterityMod" class="input-small" />
    </div>
    <div class="ability-row">
      <label>
        <span>CON</span>
      </label>
        <input id="constitution" v-model="sheet.constitution" class="input-small" />
        <input id="constitutionMod" v-model="sheet.constitutionMod" class="input-small" />
    </div>
    <div class="ability-row">
      <label>
        <span>CHA</span>
      </label>
        <input id="charisma" v-model="sheet.charisma" class="input-small" />
        <input id="charismaMod" v-model="sheet.charismaMod" class="input-small" />
    </div>

    <label for="faction">
    <span class="label">Faction</span>
    </label>
    <input id="faction" v-model="sheet.faction" />
  </div>
</template>

<style scope lang="scss">
.ability-row {
  align-items: center;
  display: grid;
  gap: 5px;
  grid-template-columns: 3em 3em 3em;
  text-align: center;

label {
    align-items: center;
    display: flex;
    justify-content: space-between;

span {
      margin-inline: auto;
    }
    input {
      margin-inline: auto;
      width: 2em;
    }
  }
}
</style>