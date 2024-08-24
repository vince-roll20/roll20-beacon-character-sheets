<script setup>
  import { useAppStore } from '@/stores/index.js'
  import { useMetaStore } from '@/stores/metaStore.js'
  import { useSheetStore } from '@/stores/sheetStore.js'
  import abilitiesSection from './components/abilitiesSection.vue';

  // These stores should drive how to access the data in your sheet, and how to trigger actionable events.
  const appStore = useAppStore()
  // The meta store has generic character info for every sheet.
  const meta = useMetaStore()
  // The sheet store is where you want to be to customize what data / fields are on your sheet.
  const sheet = useSheetStore()
</script>

<template>
  <div class="wrapper">
    <div class="top-header">
      <span></span>
      <span class="logo" title="Ad&D 1e Logo"></span>
      <span></span>
    </div>
    <div class="header">
      <div class="class-grid">
        <label for="character_name" class="span-all">
            <span class="label">Name</span>
            <input id="character_name" v-model="meta.name" title="character_name" />
        </label>
        <label for="race" class="span-all">
            <span class="label">Race</span>
            <input id="race" v-model="sheet.race" title="race" />
        </label>
        <label for="alignment" class="span-all">
            <span class="label">Alignment</span>
            <input id="alignment" v-model="sheet.alignment" title="alignment" />
        </label>
        <span class="span-all grid-2">
          <label class="label center">Class</label>
          <label class="label center">Lvl</label>
          <input id="class1" v-model="sheet.class1" placeholder="class" title="class1" />
          <input id="class1_level" v-model="sheet.class1_level" class="input-small" placeholder="-" title="class1_level" />
          <input id="class2" v-model="sheet.class2" placeholder="class" title="class2" />
          <input id="class2_level" v-model="sheet.class2_level" class="input-small" placeholder="-" title="class2_level" />
          <input id="class3" v-model="sheet.class3" placeholder="class" title="class3" />
          <input id="class3_level" v-model="sheet.class3_level" class="input-small" placeholder="-" title="class3_level" />
        </span>
      </div>
      <div class="hp-grid">
        <label for="hp">
            <span class="label">HP</span>
            <input id="hp" v-model="sheet.hp" title="hp" />
        </label>
        <label for="hp_max">
            <span class="label">/</span>
            <input id="hp_max" v-model="sheet.hp_max" title="hp_max" />
        </label>
        <label for="ac">
            <span class="label">AC</span>
            <input id="ac" v-model="sheet.ac" title="ac" />
        </label>
      </div>
      <span class="avatar">
        <img :src="meta.avatar" alt="Character Avatar" />
      </span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="sheet">
      <abilitiesSection />
      <div class="card">
        <div class="subheader">
          <span class="subtitle">Special Abilities - {{ sheet.abilitiesCount }}</span>
          <button class="button" @click="sheet.addAbility" title="Add Ability">+</button>
        </div>
        <div class="special-abilities">
          <div class="special-ability-item" v-for="ability in sheet.abilities" :key="ability._id">
            <input v-model="ability.name" placeholder="Name" />
            <input v-model="ability.description" placeholder="Description" />
            <button class="button" @click="sheet.postAbilityToChat(ability)" title="Send to chat">Post</button>
            <button class="button" @click="sheet.removeAbility(ability._id)" title="Remove Ability">-</button>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <button class="button" @click="appStore.loadExampleData">Reset</button>
    </div>
  </div>
</template>

<style lang="scss">
  #app {
    font-family: 'Montserrat', 'Verdana', sans-serif;
    margin: auto;
    display: flex;
    justify-content: center;
    min-width: 680px;
  }

  .wrapper {
    border-image: url("/src/assets/border1.jpg") round round 75 8 60 22;
    border-style: solid;
    border-width: 60px 5px 60px 5px;
    display: grid;
    justify-content: space-around;
    margin: 0 7px 0 7px;
    max-width: 910px;
    min-width: 660px;
    position: relative;
  }
  .top-header {
    display: grid;
    justify-content: center;
    align-items: center;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 0.5rem;
    margin-top: -7em;
  }
    /*
  Avatar positioning and default styles
  */
  .avatar {
    display: flex;
    padding: .5rem;
    justify-self: center;
    img {
      display: block;
      margin: auto;
      position: relative;
      height: 23vw;
      min-height: 162px;
    }
  }
  /*
  Sheet Logo positioning and default styles
  */
  .logo {
    justify-self: center;
    background-image: url("/src/assets/logo.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    height: 100px;
    width: 300px;
    position: relative;
    bottom: -4em;
  }

  /*
  The quickstart header. Replace this with a logo, your sheet title, or remove this.
  */
  .header {
    display: grid;
    justify-content: center;
    align-items: center;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem;
    padding: .5rem;
  }

  .footer {
    align-items: center;
    display: flex;
    justify-content: right;
    padding: 1rem;
  }

  .title {
    font-size: 2.5rem;
    line-height: 3rem;
  }

  /*
  This is a boilerplate layout that uses grid to help you get started on your sheet.
  Customize this layout by modifying the template columns and rows you will need for each section.
  */
  .sheet {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding: 1rem;
  }
  .card {
    background: #757575;
    border-radius: 2rem;
    display: grid;
    padding: 0.5rem 0.5rem 1rem 0.5rem;

    &:hover {
      background: rgb(191 191 191);
    }
  }

  /*
  Header for each card in your grid layout
  */
  .subheader {
    align-items: flex-start;
    display: flex;
    justify-content: space-between;
    margin-inline: .35rem;
  }
  .subtitle {
    display: flex;
    font-size: 1.25rem;
    justify-content: center;
    line-height: 1.25rem;
    margin: auto;
    padding: 0.125rem;
    position: relative;
  }

  /*
  Styling for buttons
  */
  .button {
    background: #b719be;
    border: none;
    border-radius: 0.25rem;
    color: #ffffff;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 500;
    height: fit-content;
    margin-block: auto;
    padding: 0.25rem;
    width: auto;

    &:hover {
      background: rgb(200, 68, 206);
    }
  }

  /*
  Styling for form labels
  */
  .label {
    font-size: 0.75rem;
    margin-inline: 2px;
    text-transform: uppercase;
  }
  label:has(span) {
    display: flex;
    align-items: center;
  }
  /*
  Styling for form inputs, currently this quickstart is only using default inputs that handle text.
  */
  input {
    background-color: #e8e8e8;
    border-radius: 0.25rem;
    border: none;
    padding: 0.25rem;
    width: -webkit-fill-available;
    min-width: 2.5em;
    &:focus {
      outline-offset: 1px;
      outline-color: #666;
      outline-style: groove;
    }
  }

  input[readonly] {
    background-color: #c8c8c8;
    cursor: default;
  }

  .input-small {
    text-align: center;
    width: 2.5em;
  }

  .hp-grid {
    align-self: center;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  #hp,
  #hp_max,
  #ac {
    text-align: center;
    width: 3em;
  }

  label:has(#hp) {
    justify-self: end;
  }

  /*
  Styling for the scrollable abilities list.
  */
  .special-abilities {
    height: 15rem;
    padding: 0.25rem;
  }
  /*
  Styling for each ability row, that uses a grid.
  */
  .special-ability-item {
    align-items: center;
    column-gap: 0.25rem;
    display: grid;
    grid-template-columns: 9em auto 2em 1em;
    padding-bottom: 0.25rem;
  }
  .span-all {
    grid-column: 1/-1;
    display: flex;
  }
  .class-grid {
    display: grid;
    grid-template-columns: 1fr 3em;
    grid-gap: 2px;
  }
  .center {
    text-align: center;
    margin: auto;
  }
  .grid-2 {
    gap: 4px;
    display: grid;
    grid-template-columns: 2fr 1fr;
    justify-items: center;
  }
</style>
