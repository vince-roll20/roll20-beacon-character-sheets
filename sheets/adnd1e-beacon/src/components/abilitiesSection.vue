<script setup>
import { useSheetStore } from '@/stores/sheetStore.js'
// The sheet store is where you want to be to customize what data / fields are on your sheet.
const sheet = useSheetStore()
</script>

<template>
  <div class="card">
    <div class="subheader">
      <span class="subtitle">Abilities</span>
    </div>
    <div class="ability-row">
      <label>
        <button @click="sheet.rollAbility('STR', sheet.strength)"><span>STR</span></button>
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="strength" v-model.number.lazy="sheet.strength" class="input-small" title="strength" />
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="str_exceptional" v-model.number.lazy="sheet.str_exceptional" class="input-small" title="str_exceptional" />
      </label>
      <label>
        <span class="label">ATK</span>
        <input id="str_attack" v-model.number="sheet.str_attack" class="input-small" title="str_attack" readonly />
      </label>
      <label>
        <span class="label">DMG</span>
        <input id="str_damage" v-model.number="sheet.str_damage" class="input-small" title="str_damage" readonly />
      </label>
      <label>
        <span class="label">WT</span>
        <input id="str_weight_adj" v-model.number="sheet.str_weight_adj" class="input-small" title="str_weight_adj" readonly />
      </label>
      <label>
        <span class="label">MIN</span>
        <input id="str_minor" v-model.number="sheet.str_minor" class="input-small" title="str_minor" readonly />
      </label>
      <label>
        <span class="label">LOCK</span>
        <input id="str_minor_locked" v-model.number="sheet.str_minor_locked" class="input-small" title="str_minor_locked" readonly />
      </label>
      <label>
        <span class="label">MAJ</span>
        <input id="str_major" v-model.number="sheet.str_major" class="input-small" title="str_major" readonly />
      </label>
    </div>
    <div class="ability-row">
      <label>
        <button @click="sheet.rollAbility('INT')"><span>INT</span></button>
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="intelligence" v-model.number.lazy="sheet.intelligence" class="input-small" />
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="int_exceptional" v-model.number.lazy="sheet.int_exceptional" class="input-small" title="int_exceptional" />
      </label>
      <label>
        <span class="label">LANG</span>
        <input id="int_lang" v-model.number="sheet.int_lang" class="input-small" title="int_lang" readonly />
      </label>
      <label>
        <span class="label">KNOW</span>
        <input id="int_know_spells" v-model.number="sheet.int_know_spells" class="input-small" title="int_know_spells" readonly />
      </label>
      <label>
        <span class="label">MIN</span>
        <input id="int_min_spells" v-model.number="sheet.int_min_spells" class="input-small" title="int_min_spells" readonly />
      </label>
      <label>
        <span class="label">MAX</span>
        <input id="int_max_spells" v-model.number="sheet.int_max_spells" class="input-small" title="int_max_spells" readonly />
      </label>
    </div>
    <div class="ability-row">
      <label>
        <button @click="sheet.rollAbility('WIS')"><span>WIS</span></button>
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="wisdom" v-model.number.lazy="sheet.wisdom" class="input-small" />
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="wis_exceptional" v-model.number.lazy="sheet.wis_exceptional" class="input-small" title="wis_exceptional" />
      </label>
      <label>
        <span class="label">SAVE</span>
        <input id="wis_mental" v-model.number="sheet.wis_mental" class="input-small" title="wis_mental" readonly />
      </label>
      <label class="span-two left">
        <span class="label">BONUS</span>
        <input id="wis_spell_bonus" v-model="sheet.wis_spell_bonus" class="input-small" title="wis_spell_bonus" readonly />
      </label>
      <label>
        <span class="label">FAIL</span>
        <input id="wis_spell_failure" v-model="sheet.wis_spell_failure" class="input-small" title="wis_spell_failure" readonly />
      </label>
    </div>
    <div class="ability-row">
      <label>
        <button @click="sheet.rollAbility('DEX')"><span>DEX</span></button>
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="dexterity" v-model.number.lazy="sheet.dexterity" class="input-small" />
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="dex_exceptional" v-model.number.lazy="sheet.dex_exceptional" class="input-small" title="dex_exceptional" />
      </label>
      <label>
        <span class="label">REAC</span>
        <input id="dex_reaction" v-model.number="sheet.dex_reaction" class="input-small" title="dex_reaction" readonly />
      </label>
      <label>
        <span class="label">RANGE</span>
        <input id="dex_ranged" v-model.number="sheet.dex_ranged" class="input-small" title="dex_ranged" readonly />
      </label>
      <label>
        <span class="label">ARMOR</span>
        <input id="dex_armor" v-model.number="sheet.dex_armor" class="input-small" title="dex_armor" readonly />
      </label>
      <label>
        <span class="label">SURP</span>
        <input id="dex_surprise" v-model.number="sheet.dex_surprise" class="input-small" title="dex_surprise" />
      </label>
    </div>
    <div class="ability-row">
      <label>
        <button @click="sheet.rollAbility('CON')"><span>CON</span></button>
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="constitution" v-model.number.lazy="sheet.constitution" class="input-small" />
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="con_exceptional" v-model.number.lazy="sheet.con_exceptional" class="input-small" title="con_exceptional" />
      </label>
      <label>
        <span class="label">HP</span>
        <input id="con_hp" v-model.number="sheet.con_hp" class="input-small" title="con_hp" readonly />
      </label>
      <label>
        <span class="label">SHOCK</span>
        <input id="con_shock" v-model.number="sheet.con_shock" class="input-small" title="con_shock" readonly />
      </label>
      <label>
        <span class="label">RES</span>
        <input id="con_res" v-model.number="sheet.con_res" class="input-small" title="con_res" readonly />
      </label>
    </div>
    <div class="ability-row">
      <label>
        <button @click="sheet.rollAbility('CHA')"><span>CHA</span></button>
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="charisma" v-model.number.lazy="sheet.charisma" class="input-small" />
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="cha_exceptional" v-model.number.lazy="sheet.cha_exceptional" class="input-small" title="cha_exceptional" />
      </label>
      <label>
        <span class="label">MAX</span>
        <input id="cha_max_henchmen" v-model.number="sheet.cha_max_henchmen" class="input-small" title="cha_max_henchmen" readonly />
      </label>
      <label>
        <span class="label">LOYAL</span>
        <input id="cha_loyalty" v-model.number="sheet.cha_loyalty" class="input-small" title="cha_loyalty" readonly />
      </label>
      <label>
        <span class="label">REAC</span>
        <input id="cha_reaction" v-model.number="sheet.cha_reaction" class="input-small" title="cha_reaction" readonly />
      </label>
      <label>
        <span class="label">MORALE</span>
        <input id="cha_morale" v-model.number="sheet.cha_morale" class="input-small" title="cha_morale" />
      </label>
    </div>
    <div class="ability-row">
      <label>
        <button @click="sheet.rollAbility('COM')"><span>COM</span></button>
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="comeliness" v-model.number.lazy="sheet.comeliness" class="input-small" readonly />
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="com_exceptional" v-model.number.lazy="sheet.com_exceptional" class="input-small" title="com_exceptional" />
      </label>
      <label>
        <span class="label">BASE</span>
        <input id="com_base" v-model.number="sheet.com_base" class="input-small" title="com_base" />
      </label>
      <label>
        <span class="label">CHA</span>
        <input id="cha_comeliness_adj" v-model.number="sheet.cha_comeliness_adj" class="input-small" title="cha_comeliness_adj" readonly />
      </label>
      <label>
        <span class="label">RACE</span>
        <select id="com_racial_adj" v-model.number="sheet.com_racial_adj" class="input-select" title="com_racial_adj | Bonus/Penalty adjustment as perceived by other races.">
          <option value="-3">Half-Orcs (-3)</option>
          <option value="-1">Dwarves, Gnomes (-1)</option>
          <option value="0" selected>Halflings, Humans (0)</option>
          <option value="1">Half-Elves, Sylvan Elves (1)</option>
          <option value="2">Gray Elves, High Elves (2)</option>
        </select>
      </label>
    </div>
  </div>
</template>

<style scope lang="scss">
.ability-row {
  align-items: center;
  display: grid;
  gap: 5px;
  grid-template-columns: 3em 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  text-align: center;

  label {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    input {
      margin-inline: auto;
      width: 2em;
    }
  }
}
/* ability name column */
.ability-row > label:first-child button {
  background-color: #000;
  border-radius: 10px;
  border-bottom-right-radius: 0;
  border-top-left-radius: 0;
  color: #fff;
  font-family: 'Caladea';
  font-size: 1.125rem;
  height: 1.3em;
  margin-top: 1rem;
  padding-block: 0;
  font-weight: normal;
  border-color: transparent;
}
</style>
