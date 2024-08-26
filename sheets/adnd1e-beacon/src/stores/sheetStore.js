import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { arrayToObject, objectToArray } from '@/utility/objectify'
import { dispatchRef, initValues } from '@/relay/relay.js'
import { createRollTemplate } from '@/rollTemplates/index.js'

/*
This function will leverage the beacon SDK to render a roll template to the chat log.
You can customize your roll templates, from what data you want to display, to how they look.
This project features a single roll template in handlebars.
 */
const sendAbilityToChat = ({ ability }) => {
  const rollTemplate = createRollTemplate({ ability })
  return dispatchRef.value.post({
    characterId: initValues.character.id,
    content: rollTemplate,
    options: { whisper: undefined }
  })
}

// Adds a new row
const addAbility = (abilities) => {
  const ability = {
    _id: uuidv4(),
    name: `Ability ${abilities.value?.length + 1}`,
    description: ''
  }
  abilities.value.push(ability)
}

// Removes a row
const removeAbility = (abilities, abilityId) => {
  const indexToRemove = abilities.value.findIndex((ability) => ability._id === abilityId)
  if (indexToRemove >= 0) abilities.value.splice(indexToRemove, 1)
}

/*
Calls the sendAbilityToChat function to post the ability to the chat log.
NOTE: The roll template in handlebars checks to see if the passed in data to the chat
is an ability object, and if so, will render the ability's name and description with custom CSS.
 */
const postAbilityToChat = (ability) => {
  sendAbilityToChat({ ability })
}

/*
This is a custom data store, that will house everything you need for data specific to your sheet.
Here you can define all attributes, as well as sheet functions.
This is a great starting place to customize what data you need for your sheet.
 */
const sheetStore = () => {
  const hp = ref(0)
  const hp_max = ref(0)
  const ac = ref(10)
  const ac_shieldless = ref(10)
  const ac_rear = ref(10)
  const ar = ref(10)
  const class1 = ref('-')
  const class2 = ref('-')
  const class3 = ref('-')
  const class1_level = ref(0)
  const class2_level = ref(0)
  const class3_level = ref(0)
  const alignment = ref('-')
  const race = ref('-')

  const strength = ref(8)
  const intelligence = ref(8)
  const wisdom = ref(8)
  const dexterity = ref(8)
  const constitution = ref(8)
  const charisma = ref(8)

  const str_exceptional = ref(0)
  const int_exceptional = ref(0)
  const wis_exceptional = ref(0)
  const dex_exceptional = ref(0)
  const con_exceptional = ref(0)
  const cha_exceptional = ref(0)
  const com_exceptional = ref(0)

  // Map Abilities to PHB table
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
    25: [7, 14, 15000, 95, 90, 100]
  }
  const strToValuesExceptional = {
    50: [1, 3, 1000, 50, 0, 20],
    75: [2, 3, 1250, 70, 0, 25],
    90: [2, 4, 1500, 70, 0, 30],
    99: [2, 5, 2000, 70, 15, 35],
    100: [3, 6, 3000, 85, 30, 40]
  }
  // int array [int_lang, int_know_spells, int_min_spells, int_max_spells]
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
  // wis array [wis_mental, wis_spell_bonus, wis_spell_failure]
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
  // dex array [dex_reaction, dex_ranged, dex_armor, dex_surprise]
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
  // con array [con_hp, con_shock, con_res]
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
  // cha array [cha_max_henchmen, cha_loyalty, cha_reaction, cha_comeliness_adj]
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

  let strValues = ref(strToValues[strength.value])
  let intValues = ref(intToValues[intelligence.value])
  let wisValues = ref(wisToValues[wisdom.value])
  let dexValues = ref(dexToValues[dexterity.value])
  let conValues = ref(conToValues[constitution.value])
  let chaValues = ref(chaToValues[charisma.value])

  // Watch for changes in the ability values
  watch(
    [strength, str_exceptional, intelligence, wisdom, dexterity, constitution, charisma],
    ([
      newStrength,
      newExceptional,
      newIntelligence,
      newWisdom,
      newDexterity,
      newConstitution,
      newCharisma
    ]) => {
      if (newStrength === 18 && newExceptional > 0) {
        exceptionalStr(newExceptional) // Call to update exceptional strValues
      } else {
        strValues.value = strToValues[newStrength] // Update directly
      }
      intValues.value = intToValues[newIntelligence]
      wisValues.value = wisToValues[newWisdom]
      dexValues.value = dexToValues[newDexterity]
      conValues.value = conToValues[newConstitution]
      chaValues.value = chaToValues[newCharisma]
    }
  )

  // Function to handle exceptional strength
  function exceptionalStr(exceptionalValue) {
    if (exceptionalValue <= 50) {
      strValues.value = strToValuesExceptional[50]
    } else if (exceptionalValue <= 75) {
      strValues.value = strToValuesExceptional[75]
    } else if (exceptionalValue <= 90) {
      strValues.value = strToValuesExceptional[90]
    } else if (exceptionalValue <= 99) {
      strValues.value = strToValuesExceptional[99]
    } else {
      strValues.value = strToValuesExceptional[100]
    }
  }

  const str_attack = computed(() => (strValues.value ? strValues.value[0] : 0))
  const str_damage = computed(() => (strValues.value ? strValues.value[1] : 0))
  const str_weight_adj = computed(() => (strValues.value ? strValues.value[2] : 0))
  const str_minor = computed(() => (strValues.value ? strValues.value[3] : 0))
  const str_minor_locked = computed(() => (strValues.value ? strValues.value[4] : 0))
  const str_major = computed(() => (strValues.value ? strValues.value[5] : 0))

  const int_lang = computed(() => (intValues.value ? intValues.value[0] : 0))
  const int_know_spells = computed(() => (intValues.value ? intValues.value[1] : 0))
  const int_min_spells = computed(() => (intValues.value ? intValues.value[2] : 0))
  const int_max_spells = computed(() => (intValues.value ? intValues.value[3] : 0))

  const wis_mental = computed(() => (wisValues.value ? wisValues.value[0] : 0))
  const wis_spell_bonus = computed(() => (wisValues.value ? wisValues.value[1] : 0))
  const wis_spell_failure = computed(() => (wisValues.value ? wisValues.value[2] : 0))

  const dex_reaction = computed(() => (dexValues.value ? dexValues.value[0] : 0))
  const dex_ranged = computed(() => (dexValues.value ? dexValues.value[1] : 0))
  const dex_armor = computed(() => (dexValues.value ? dexValues.value[2] : 0))
  const dex_surprise = computed(() => (dexValues.value ? dexValues.value[3] : 0))

  const con_hp = computed(() => (conValues.value ? conValues.value[0] : 0))
  const con_shock = computed(() => (conValues.value ? conValues.value[1] : 0))
  const con_res = computed(() => (conValues.value ? conValues.value[2] : 0))

  const cha_max_henchmen = computed(() => (chaValues.value ? chaValues.value[0] : 0))
  const cha_loyalty = computed(() => (chaValues.value ? chaValues.value[1] : 0))
  const cha_reaction = computed(() => (chaValues.value ? chaValues.value[2] : 0))
  const cha_morale = ref(50)
  const cha_comeliness_adj = computed(() => (chaValues.value ? chaValues.value[3] : 0))

  const com_base = ref(8)
  const com_racial_adj = ref(0)
  const comeliness = computed(
    () => com_base.value + cha_comeliness_adj.value + com_racial_adj.value
  )

  const abilities = ref([])
  const abilitiesCount = computed(() => abilities.value?.length)

  // Handles retrieving these values from the store
  const dehydrate = () => {
    return {
      hp: hp.value,
      hp_max: hp_max.value,
      ac: ac.value,
      ac_shieldless: ac_shieldless.value,
      ac_rear: ac_rear.value,
      ar: ar.value,
      class1: class1.value,
      class2: class2.value,
      class3: class3.value,
      class1_level: class1_level.value,
      class2_level: class2_level.value,
      class3_level: class3_level.value,
      race: race.value,
      alignment: alignment.value,
      strength: strength.value,
      intelligence: intelligence.value,
      wisdom: wisdom.value,
      dexterity: dexterity.value,
      constitution: constitution.value,
      charisma: charisma.value,

      str_exceptional: str_exceptional.value,
      int_exceptional: int_exceptional.value,
      wis_exceptional: wis_exceptional.value,
      dex_exceptional: dex_exceptional.value,
      con_exceptional: con_exceptional.value,
      cha_exceptional: cha_exceptional.value,
      com_exceptional: com_exceptional.value,

      str_attack: str_attack.value,
      str_damage: str_damage.value,
      str_weight_adj: str_weight_adj.value,
      str_minor: str_minor.value,
      str_minor_locked: str_minor_locked.value,
      str_major: str_major.value,

      int_lang: int_lang.value,
      int_know_spells: int_know_spells.value,
      int_min_spells: int_min_spells.value,
      int_max_spells: int_max_spells.value,

      wis_mental: wis_mental.value,
      wis_spell_bonus: wis_spell_bonus.value,
      wis_spell_failure: wis_spell_failure.value,

      dex_reaction: dex_reaction.value,
      dex_ranged: dex_ranged.value,
      dex_armor: dex_armor.value,
      dex_surprise: dex_surprise.value,

      con_hp: con_hp.value,
      con_shock: con_shock.value,
      con_res: con_res.value,

      cha_max_henchmen: cha_max_henchmen.value,
      cha_loyal: cha_loyalty.value,
      cha_reaction: cha_reaction.value,
      cha_comeliness_adj: cha_comeliness_adj.value,
      cha_morale: cha_morale.value,

      com_base: com_base.value,
      com_racial_adj: com_racial_adj.value,

      abilities: arrayToObject(abilities.value)
    }
  }

  // Handles updating these values in the store.
  const hydrate = (hydrateStore) => {
    hp.value = hydrateStore.hp ?? hp.value
    hp_max.value = hydrateStore.hp_max ?? hp_max.value
    ac.value = hydrateStore.ac ?? ac.value
    ac_shieldless.value = hydrateStore.ac_shieldless ?? ac_shieldless.value
    ac_rear.value = hydrateStore.ac_rear ?? ac_rear.value
    ar.value = hydrateStore.ar ?? ar.value
    class1.value = hydrateStore.class1 ?? class1.value
    class2.value = hydrateStore.class2 ?? class2.value
    class3.value = hydrateStore.class3 ?? class3.value
    class1_level.value = hydrateStore.class1_level ?? class1_level.value
    class2_level.value = hydrateStore.class2_level ?? class2_level.value
    class3_level.value = hydrateStore.class3_level ?? class3_level.value
    race.value = hydrateStore.race ?? race.value
    alignment.value = hydrateStore.alignment ?? alignment.value
    strength.value = hydrateStore.strength ?? strength.value
    intelligence.value = hydrateStore.intelligence ?? intelligence.value
    wisdom.value = hydrateStore.wisdom ?? wisdom.value
    dexterity.value = hydrateStore.dexterity ?? dexterity.value
    constitution.value = hydrateStore.constitution ?? constitution.value
    charisma.value = hydrateStore.charisma ?? charisma.value
    comeliness.value = hydrateStore.comeliness ?? comeliness.value

    str_exceptional.value = hydrateStore.str_exceptional ?? str_exceptional.value
    int_exceptional.value = hydrateStore.int_exceptional ?? int_exceptional.value
    wis_exceptional.value = hydrateStore.wis_exceptional ?? wis_exceptional.value
    dex_exceptional.value = hydrateStore.dex_exceptional ?? dex_exceptional.value
    con_exceptional.value = hydrateStore.con_exceptional ?? con_exceptional.value
    cha_exceptional.value = hydrateStore.cha_exceptional ?? cha_exceptional.value
    con_exceptional.value = hydrateStore.con_exceptional ?? con_exceptional.value

    str_attack.value = hydrateStore.str_attack ?? str_attack.value
    str_damage.value = hydrateStore.str_damage ?? str_damage.value
    str_weight_adj.value = hydrateStore.str_weight_adj ?? str_weight_adj.value
    str_minor.value = hydrateStore.str_minor ?? str_minor.value
    str_minor_locked.value = hydrateStore.str_minor_locked ?? str_minor_locked.value
    str_major.value = hydrateStore.str_major ?? str_major.value

    int_lang.value = hydrateStore.int_lang ?? int_lang.value
    int_know_spells.value = hydrateStore.int_know_spells ?? int_know_spells.value
    int_min_spells.value = hydrateStore.int_min_spells ?? int_min_spells.value
    int_max_spells.value = hydrateStore.int_max_spells ?? int_max_spells.value

    wis_mental.value = hydrateStore.wis_mental ?? wis_mental.value
    wis_spell_bonus.value = hydrateStore.wis_spell_bonus ?? wis_spell_bonus.value
    wis_spell_failure.value = hydrateStore.wis_spell_failure ?? wis_spell_failure.value

    dex_reaction.value = hydrateStore.dex_reaction ?? dex_reaction.value
    dex_ranged.value = hydrateStore.dex_ranged ?? dex_ranged.value
    dex_armor.value = hydrateStore.dex_armor ?? dex_armor.value
    dex_surprise.value = hydrateStore.dex_surprised ?? dex_surprise.value

    con_hp.value = hydrateStore.con_hp ?? con_hp.value
    con_shock.value = hydrateStore.con_shock ?? con_shock.value
    con_res.value = hydrateStore.con_res ?? con_res.value

    cha_max_henchmen.value = hydrateStore.cha_max_henchmen ?? cha_max_henchmen.value
    cha_loyalty.value = hydrateStore.cha_loyalty ?? cha_loyalty.value
    cha_reaction.value = hydrateStore.cha_reaction ?? cha_reaction.value
    cha_comeliness_adj.value = hydrateStore.cha_comeliness_adj ?? cha_comeliness_adj.value
    cha_morale.value = hydrateStore.cha_morale ?? cha_morale.value

    com_base.value = hydrateStore.com_base ?? com_base.value
    com_racial_adj.value = hydrateStore.com_racial_adj ?? com_racial_adj.value

    abilities.value = objectToArray(hydrateStore.abilities) || abilities.value
  }

  return {
    hp,
    hp_max,
    ac,
    ac_shieldless,
    ac_rear,
    ar,
    class1,
    class2,
    class3,
    class1_level,
    class2_level,
    class3_level,
    race,
    alignment,
    strength,
    intelligence,
    wisdom,
    dexterity,
    constitution,
    charisma,
    comeliness,

    str_exceptional,
    int_exceptional,
    wis_exceptional,
    dex_exceptional,
    con_exceptional,
    cha_exceptional,
    com_exceptional,

    str_attack,
    str_damage,
    str_weight_adj,
    str_minor,
    str_minor_locked,
    str_major,

    int_lang,
    int_know_spells,
    int_min_spells,
    int_max_spells,

    wis_mental,
    wis_spell_bonus,
    wis_spell_failure,

    dex_reaction,
    dex_ranged,
    dex_armor,
    dex_surprise,

    con_hp,
    con_shock,
    con_res,

    cha_max_henchmen,
    cha_loyalty,
    cha_reaction,
    cha_comeliness_adj,
    cha_morale,

    com_base,
    com_racial_adj,

    abilities,
    abilitiesCount,
    addAbility: () => addAbility(abilities),
    removeAbility: (abilityId) => removeAbility(abilities, abilityId),
    postAbilityToChat,
    dehydrate,
    hydrate
  }
}

export const useSheetStore = defineStore('sheet', sheetStore)