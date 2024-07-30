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
      <label for="character_name">
          <span class="label">Character Name</span>
          <input id="character_name" v-model="meta.name" />
      </label>
      <div class="hp-box">
        <label for="hp">
            <span class="label">HP</span>
            <input id="hp" v-model="sheet.hp" />
        </label>
        <label for="hp_max">
            <span class="label">/</span>
            <input id="hp_max" v-model="sheet.hp_max" />
        </label>
        <label for="ac">
            <span class="label">AC</span>
            <input id="ac" v-model="sheet.ac" />
        </label>
      </div>
      <span class="avatar">
        <img :src="meta.avatar" alt="Character Avatar" />
      </span>
      <label for="class1">
          <span class="label">Class</span>
          <input id="class1" v-model="sheet.class1" />
      </label>
      <span></span>
      <div></div>
    </div>
    <div class="sheet">
      <abilitiesSection />
      <div class="card">
        <div class="subheader">
          <div class="subtitle">Special Abilities - {{ sheet.abilitiesCount }}</div>
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
  .wrapper {
    border-image: url("/src/assets/border1.jpg") round round 75 8 60 22;
    border-style: solid;
    border-width: 60px 5px 60px 5px;
    margin: 0;
    width: 860px;
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
    border-radius: 2rem;
    padding: 1rem;
    background: #757575;
    justify-self: center;
    &:hover {
      background: rgba(180, 218, 222, 0.86);
    }
    img {
      border-radius: 10px;
      display: block;
      height: 8rem;
      margin: auto;
      position: relative;
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
    grid-template-columns: 1fr 2fr 1fr;
    gap: 0.5rem;
    padding: 1rem;
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
    display: grid;
    gap: 0.5rem;
    border-radius: 2rem;
    padding: .5rem;
    background: #757575;
    &:hover {
      background: rgba(180, 218, 222, 0.86);
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
    font-size: 1.75rem;
    line-height: 2rem;
    padding-top: .5rem;
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
    font-weight: 600;
    margin-inline: 2px;
    text-transform: uppercase;
  }
  /*
  Styling for form inputs, currently this quickstart is only using default inputs that handle text.
  */
  input {
    font-size: 1rem;
    background-color: #e8e8e8;
    border-radius: 0.25rem;
    border: none;
    height: 1.5rem;
    padding: 0.25rem;
    &:focus {
      outline-offset: 1px;
      outline-color: #666;
      outline-style: groove;
    }
  }

  .input-small {
    min-width: 2.5em;
    text-align: center;
    width: auto;
  }

  .hp-box {
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
</style>
