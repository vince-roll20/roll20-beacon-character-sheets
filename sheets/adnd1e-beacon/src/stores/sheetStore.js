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

/*
Adds a new row
 */
const addAbility = (abilities) => {
  const ability = {
    _id: uuidv4(),
    name: `Ability ${abilities.value?.length + 1}`,
    description: ''
  }
  abilities.value.push(ability)
}

/*
Removes a row
 */
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
  const class1 = ref('')

  const strength = ref(8)
  const intelligence = ref(8)
  const wisdom = ref(8)
  const dexterity = ref(8)
  const constitution = ref(8)
  const charisma = ref(8)
  const comeliness = ref(8)

  const str_exceptional = ref(0)
  const int_exceptional = ref(0)
  const wis_exceptional = ref(0)
  const dex_exceptional = ref(0)
  const con_exceptional = ref(0)
  const cha_exceptional = ref(0)
  const com_exceptional = ref(0)

  // Map strength to PHB table
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

  let strValues = ref(strToValues[strength.value])

  // Watch for changes to the strength and str_exceptional values
  watch([strength, str_exceptional], ([newStrength, newExceptional]) => {
    if (newStrength === 18 && newExceptional > 0) {
      exceptionalStr(newExceptional) // Call to update exceptional strValues
    } else {
      strValues.value = strToValues[newStrength] // Update directly
    }
  })

  // Function to handle exceptional strength
  function exceptionalStr(exceptionalValue) {
    console.log(`exceptionalValue: ${exceptionalValue}`)
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

  const int_lang = ref(0)
  const int_know_spells = ref(0)
  const int_min_spells = ref(0)
  const int_max_spells = ref(0)

  const wis_mental = ref(0)
  const wis_spell_bonus = ref(0)
  const wis_spell_failure = ref(0)

  const dex_reaction = ref(0)
  const dex_ranged = ref(0)
  const dex_armor = ref(0)
  const dex_surprise = ref(0)

  const con_hp = ref(0)
  const con_shock = ref(0)
  const con_res = ref(0)

  const cha_max_henchmen = ref(0)
  const cha_loyalty = ref(0)
  const cha_reaction = ref(0)
  const cha_morale = ref(0)

  const comelinessMod = ref(0)

  const abilities = ref([])
  const abilitiesCount = computed(() => abilities.value?.length)

  // Handles retrieving these values from the store
  const dehydrate = () => {
    return {
      hp: hp.value,
      hp_max: hp_max.value,
      ac: ac.value,
      class1: class1.value,
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
      cha_morale: cha_morale.value,

      comelinessMod: comelinessMod.value,
      abilities: arrayToObject(abilities.value)
    }
  }

  // Handles updating these values in the store.
  const hydrate = (hydrateStore) => {
    hp.value = hydrateStore.hp ?? hp.value
    hp_max.value = hydrateStore.hp_max ?? hp_max.value
    ac.value = hydrateStore.ac ?? ac.value
    class1.value = hydrateStore.class1 ?? class1.value
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
    cha_morale.value = hydrateStore.cha_morale ?? cha_morale.value

    comelinessMod.value = hydrateStore.comelinessMod ?? comelinessMod.value

    abilities.value = objectToArray(hydrateStore.abilities) || abilities.value
  }

  return {
    hp,
    hp_max,
    ac,
    class1,
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
    cha_morale,

    comelinessMod,

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
