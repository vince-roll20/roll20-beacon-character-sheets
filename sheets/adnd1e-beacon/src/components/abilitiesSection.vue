<script setup>
  import { useSheetStore } from '@/stores/sheetStore.js'
  // The sheet store is where you want to be to customize what data / fields are on your sheet.
  const sheet = useSheetStore()
  // str array [str_attack, str_damage, str_weight_adj, str_minor, str_minor_locked, str_major]
  const strToValues = {
    3: [-3, -1, -350, 15, 0, 0],
    4: [-2, -1, -250, 15, 0, 0],
    5: [-2, -1, -250, 15, 0, 0],
    6: [-1, 0, -150, 15, 0, 0],
    7: [-1, 0, -150, 15, 0, 0],
    8: [0, 0, 0, 30, 0, 1],
    9: [0, 0, 0, 30, 0, 1],
    10: [0, 0, 0, 30, 0, 2],
    11: [0, 0, 0, 30, 0, 2],
    12: [0, 0, 100, 30, 0, 4],
    13: [0, 0, 100, 30, 0, 4],
    14: [0, 0, 200, 30, 0, 7],
    15: [0, 0, 200, 30, 0, 7],
    16: [0, 1, 350, 50, 0, 10],
    17: [1, 1, 500, 50, 0, 13],
    18: [1, 2, 750, 50, 0, 16],
    19: [3, 7, 4500, 90, 50, 50],
    20: [3, 8, 5000, 90, 50, 60],
    21: [4, 9, 6000, 90, 70, 70],
    22: [4, 10, 7500, 90, 70, 80],
    23: [5, 11, 9000, 90, 85, 90],
    24: [6, 12, 12000, 95, 87, 100],
    25: [7, 14, 15000, 95, 90, 100],
  }
  const strToValuesExceptional = {
    '01-50': [1, 3, 1000, 50, 0, 20],
    '51-75': [2, 3, 1250, 70, 0, 25],
    '76-90': [2, 4, 1500, 70, 0, 30],
    '91-99': [2, 5, 2000, 70, 15, 35],
    '00': [3, 6, 3000, 85, 30, 40]
  }
  // int array [bonuslanguages, knowspell, minspells, maxspells]
  const intToValues = {
    8: [1, 0, 0, 0],
    9: [1, 35, 4, 6],
    10: [2, 45, 5, 7],
    11: [2, 45, 5, 7],
    12: [3, 45, 5, 7],
    13: [3, 55, 6, 9],
    14: [4, 55, 6, 9],
    15: [4, 65, 7, 11],
    16: [5, 65, 7, 11],
    17: [6, 75, 8, 14],
    18: [7, 85, 9, 18],
    19: [8, 95, 10, 99],
    20: [9, 96, 11, 99],
    21: [10, 97, 12, 99],
    22: [11, 98, 13, 99],
    23: [12, 99, 14, 99],
    24: [13, 100, 15, 99],
    25: [14, 100, 16, 99]
  }
  // wis array [mentalsavebonus, spellbonus, spellfailure]
  const wisToValues = {
    3: ['-3', 'None', 20],
    4: ['-2', 'None', 20],
    5: ['-1', 'None', 20],
    6: ['-1', 'None', 20],
    7: ['-1', 'None', 20],
    8: ['0', 'None', 20],
    9: ['0', 'None', 20],
    10: ['0', 'None', 15],
    11: ['0', 'None', 10],
    12: ['0', 'None', 5],
    13: ['0', '1/0/0/0/0/0/0', 0],
    14: ['0', '2/0/0/0/0/0/0', 0],
    15: ['1', '2/1/0/0/0/0/0', 0],
    16: ['2', '2/2/0/0/0/0/0', 0],
    17: ['3', '2/2/1/0/0/0/0', 0],
    18: ['4', '2/2/1/1/0/0/0', 0],
    19: ['4', '3/2/1/2/0/0/0', 0],
    20: ['4', '3/3/1/3/0/0/0', 0],
    21: ['4', '3/3/2/3/1/0/0', 0],
    22: ['4', '3/3/2/4/2/0/0', 0],
    23: ['4', '3/3/2/4/4/0/0', 0],
    24: ['4', '3/3/2/4/4/2/1', 0],
    25: ['4', '3/3/2/4/4/3/1', 0]
  }
  // dex array [surprisebonus rangedbonus armorbonus]
  const dexToValues = {
    3: [3, -3, 4],
    4: [2, -2, 3],
    5: [1, -1, 2],
    6: [0, 0, 1],
    7: [0, 0, 0],
    8: [0, 0, 0],
    9: [0, 0, 0],
    10: [0, 0, 0],
    11: [0, 0, 0],
    12: [0, 0, 0],
    13: [0, 0, 0],
    14: [0, 0, 0],
    15: [0, 0, -1],
    16: [-1, 1, -2],
    17: [-2, 2, -3],
    18: [-3, 3, -4],
    19: [-3, 3, -4],
    20: [-3, 3, -4],
    21: [-4, 4, -5],
    22: [-4, 4, -5],
    23: [-4, 4, -5],
    24: [-5, 5, -6],
    25: [-5, 5, -6]
  }
  // con array [hitpointbonus systemshock resurrectionsurvival]
  const conToValues = {
    3: ['-2', 35, 40],
    4: ['-1', 40, 45],
    5: ['-1', 45, 50],
    6: ['0', 50, 55],
    7: ['0', 55, 60],
    8: ['0', 60, 65],
    9: ['0', 65, 70],
    10: ['0', 70, 75],
    11: ['0', 75, 80],
    12: ['0', 80, 85],
    13: ['0', 85, 90],
    14: ['0', 88, 92],
    15: ['1', 91, 94],
    16: ['2', 95, 96],
    // *cap @ +2 unless fighter type
    // 17 +3*
    // 18 +4*
    17: ['3', 97, 98],
    18: ['4', 99, 100],
    19: ['5', 99, 100],
    20: ['5', 99, 100],
    21: ['6', 99, 100],
    22: ['6', 99, 100],
    23: ['6', 99, 100],
    24: ['7', 99, 100],
    25: ['7', 99, 100]
  }
  // cha array [maximumhenchmen loyaltybonus reactionbonus comeliness_cha_adj]
  const chaToValues = {
    3: [1, -30, -25, -5],
    4: [1, -25, -20, -3],
    5: [2, -20, -15, -3],
    6: [2, -15, -10, -1],
    7: [3, -10, -5, -1],
    8: [3, -5, 0, -1],
    9: [4, 0, 0, 0],
    10: [4, 0, 0, 0],
    11: [4, 0, 0, 0],
    12: [5, 0, 0, 0],
    13: [5, 0, 5, 1],
    14: [6, 5, 10, 1],
    15: [7, 15, 15, 1],
    16: [8, 20, 25, 2],
    17: [10, 30, 30, 2],
    18: [15, 40, 35, 3],
    19: [20, 50, 40, 5],
    20: [25, 60, 45, 5],
    21: [30, 70, 50, 5],
    22: [35, 80, 55, 5],
    23: [40, 90, 60, 5],
    24: [45, 100, 65, 5],
    25: [50, 100, 70, 5]
  }
</script>

<template>
  <div class="card">
    <div class="subheader">
      <span class="subtitle">Abilities</span>
    </div>
    <div class="ability-row">
      <label>
        <span>STR</span>
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="strength" v-model.number.lazy="sheet.strength" class="input-small" title="strength"/>
      </label>
      <label>
        <span class="label">EXC</span>
        <input id="str_exceptional" v-model.number.lazy="sheet.str_exceptional" class="input-small" title="str_exceptional"/>
      </label>
      <label>
        <span class="label">ATK</span>
        <input id="str_attack" v-model.number="sheet.str_attack" class="input-small" title="str_attack" readonly/>
      </label>
      <label>
        <span class="label">DMG</span>
        <input id="str_damage" v-model.number="sheet.str_damage" class="input-small" title="str_damage" readonly/>
      </label>
      <label>
        <span class="label">WT</span>
        <input id="str_weight_adj" v-model.number="sheet.str_weight_adj" class="input-small" title="str_weight_adj" readonly/>
      </label>
      <label>
        <span class="label">MIN</span>
        <input id="str_minor" v-model.number="sheet.str_minor" class="input-small" title="str_minor" readonly/>
      </label>
      <label>
        <span class="label">LOCK</span>
        <input id="str_minor_locked" v-model.number="sheet.str_minor_locked" class="input-small" title="str_minor_locked" readonly/>
      </label>
      <label>
        <span class="label">MAJ</span>
        <input id="str_major" v-model.number="sheet.str_major" class="input-small" title="str_major" readonly/>
      </label>
    </div>
    <div class="ability-row">
      <label>
        <span>INT</span>
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="intelligence" v-model.number.lazy="sheet.intelligence" class="input-small" />
      </label>
      <label>
        <span class="label">EXC</span>
        <input id="int_exceptional" v-model.number.lazy="sheet.int_exceptional" class="input-small" title="int_exceptional"/>
      </label>
      <label>
        <span class="label">LANG</span>
        <input id="int_lang" v-model.number="sheet.int_lang" class="input-small" title="int_lang" readonly/>
      </label>
      <label>
        <span class="label">KNOW</span>
        <input id="int_know_spells" v-model.number="sheet.int_know_spells" class="input-small" title="int_know_spells" readonly/>
      </label>
      <label>
        <span class="label">MIN</span>
        <input id="int_min_spells" v-model.number="sheet.int_min_spells" class="input-small" title="int_min_spells" readonly/>
      </label>
      <label>
        <span class="label">MAX</span>
        <input id="int_max_spells" v-model.number="sheet.int_max_spells" class="input-small" title="int_max_spells" readonly/>
      </label>
    </div>
    <div class="ability-row">
      <label>
        <span>WIS</span>
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="wisdom" v-model.number.lazy="sheet.wisdom" class="input-small" />
      </label>
      <label>
        <span class="label">EXC</span>
        <input id="wis_exceptional" v-model.number.lazy="sheet.wis_exceptional" class="input-small" title="wis_exceptional"/>
      </label>
      <label>
        <span class="label">SAVE</span>
        <input id="wis_mental" v-model.number="sheet.wis_mental" class="input-small" title="wis_mental" />
      </label>
      <label class="span-two">
        <span class="label">BONUS</span>
        <input id="wis_spell_bonus" v-model="sheet.wis_spell_bonus" class="input-small" title="wis_spell_bonus" />
      </label>
      <label>
        <span class="label">FAIL</span>
        <input id="wis_spell_failure" v-model="sheet.wis_spell_failure" class="input-small" title="wis_spell_failure" />
      </label>
    </div>
    <div class="ability-row">
      <label>
        <span>DEX</span>
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="dexterity" v-model.number.lazy="sheet.dexterity" class="input-small" />
      </label>
      <label>
        <span class="label">EXC</span>
        <input id="dex_exceptional" v-model.number.lazy="sheet.dex_exceptional" class="input-small" title="dex_exceptional"/>
      </label>
      <label>
        <span class="label">REAC</span>
        <input id="dex_reaction" v-model.number="sheet.dex_reaction" class="input-small" title="dex_reaction" />
      </label>
      <label>
        <span class="label">RANGE</span>
        <input id="dex_ranged" v-model.number="sheet.dex_ranged" class="input-small" title="dex_ranged" />
      </label>
      <label>
        <span class="label">ARMOR</span>
        <input id="dex_armor" v-model.number="sheet.dex_armor" class="input-small" title="dex_armor" />
      </label>
      <label>
        <span class="label">SURP</span>
        <input id="dex_surprise" v-model.number="sheet.dex_surprise" class="input-small" title="dex_surprise" />
      </label>
    </div>
    <div class="ability-row">
      <label>
        <span>CON</span>
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="constitution" v-model.number.lazy="sheet.constitution" class="input-small" />
      </label>
      <label>
        <span class="label">EXC</span>
        <input id="con_exceptional" v-model.number.lazy="sheet.con_exceptional" class="input-small" title="con_exceptional"/>
      </label>
      <label>
        <span class="label">HP</span>
        <input id="con_hp" v-model.number="sheet.con_hp" class="input-small" title="con_hp" />
      </label>
      <label>
        <span class="label">SHOCK</span>
        <input id="con_shock" v-model.number="sheet.con_shock" class="input-small" title="con_shock" />
      </label>
      <label>
        <span class="label">RES</span>
        <input id="con_res" v-model.number="sheet.con_res" class="input-small" title="con_res" />
      </label>
    </div>
    <div class="ability-row">
      <label>
        <span>CHA</span>
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="charisma" v-model.number.lazy="sheet.charisma" class="input-small" />
      </label>
      <label>
        <span class="label">EXC</span>
        <input id="cha_exceptional" v-model.number.lazy="sheet.cha_exceptional" class="input-small" title="cha_exceptional"/>
      </label>
      <label>
        <span class="label">MAX</span>
        <input id="cha_max_henchmen" v-model.number="sheet.cha_max_henchmen" class="input-small" title="cha_max_henchmen" />
      </label>
      <label>
        <span class="label">LOYAL</span>
        <input id="cha_loyalty" v-model.number="sheet.cha_loyalty" class="input-small" title="cha_loyalty" />
      </label>
      <label>
        <span class="label">REAC</span>
        <input id="cha_reaction" v-model.number="sheet.cha_reaction" class="input-small" title="cha_reaction" />
      </label>
      <label>
        <span class="label">MORALE</span>
        <input id="cha_morale" v-model.number="sheet.cha_morale" class="input-small" title="cha_morale" />
      </label>
    </div>
    <div class="ability-row">
      <label>
        <span>COM</span>
      </label>
      <label>
        <span class="label">&nbsp;</span>
        <input id="comeliness" v-model.number.lazy="sheet.comeliness" class="input-small" />
      </label>
      <label>
        <span class="label">EXC</span>
        <input id="com_exceptional" v-model.number.lazy="sheet.com_exceptional" class="input-small" title="com_exceptional"/>
      </label>
      <label>
        <span class="label">BASE</span>
        <input id="com_base" v-model.number="sheet.com_base" class="input-small" title="com_base" />
      </label>
      <label>
        <span class="label">CHA</span>
        <input id="com_cha_adj" v-model.number="sheet.com_cha_adj" class="input-small" title="com_cha_adj" />
      </label>
      <label>
        <span class="label">RACE</span>
        <select id="com_racial_adj" v-model.number="sheet.com_racial_adj" title="com_racial_adj | Bonus/Penalty adjustment as perceived by other races.">
          <option value="-3">Half-Orcs</option>
          <option value="-1">Dwarves, Gnomes</option>
          <option value="0" selected>Halflings, Humans</option>
          <option value="1">Half-Elves, Sylvan Elves</option>
          <option value="2">Gray Elves, High Elves</option>
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

  span {
        margin-inline: auto;
      }
      input {
        margin-inline: auto;
        width: 2em;
      }
    }
  }
  .ability-row > label:first-child {
    margin-top: 1rem;
    font-size: 1.2rem;
  }
</style>