import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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

In the example we have provided, there is a custom faction text field, as well as a list of
ability objects, that feature a name and description.

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
  // Map strength base to PHB table
  // array [str_attack, str_damage, str_minor, str_major, str_weight_adjustment]
  const strToValues = {
    3: [-3, -1, 15, 0, -350],
    4: [-2, -1, 15, 0, -250],
    5: [-2, -1, 15, 0, -250],
    6: [-1, 0, 15, 0, -150],
    7: [-1, 0, 15, 0, -150],
    8: [0, 0, 30, 1, 0],
    9: [0, 0, 15, 1, 0],
    10: [0, 0, 30, 2, 0],
    11: [0, 0, 30, 2, 0],
    12: [0, 0, 30, 4, 100],
    13: [0, 0, 30, 4, 100],
    14: [0, 0, 30, 7, 200],
    15: [0, 1, 50, 10, 200],
    16: [1, 1, 50, 13, 350],
    17: [1, 1, 50, 13, 500],
    18: [1, 2, 50, 16, 750]
  }
  // Get the corresponding array based on strength
  const strValues = computed(() => strToValues[strength.value])
  const str_attack = computed(() => (strValues.value ? strValues.value[0] : 0))
  const str_damage = computed(() => (strValues.value ? strValues.value[1] : 0))
  const str_minor = computed(() => (strValues.value ? strValues.value[2] : 0))
  const str_major = computed(() => (strValues.value ? strValues.value[3] : 0))
  const str_weight_adjustment = computed(() => (strValues.value ? strValues.value[3] : 0))

  const intelligenceMod = ref(0)
  const wisdomMod = ref(0)
  const dexterityMod = ref(0)
  const constitutionMod = ref(0)
  const charismaMod = ref(0)

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
      str_attack: str_attack.value,
      str_damage: str_damage.value,
      str_minor: str_minor.value,
      str_major: str_major.value,
      str_weight_adjustment: str_weight_adjustment.value,
      intelligenceMod: intelligenceMod.value,
      wisdomMod: wisdomMod.value,
      dexterityMod: dexterityMod.value,
      constitutionMod: constitutionMod.value,
      charismaMod: charismaMod.value,
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

    str_attack.value = hydrateStore.str_attack ?? str_attack.value
    str_damage.value = hydrateStore.str_damage ?? str_damage.value
    str_minor.value = hydrateStore.str_minor ?? str_minor.value
    str_major.value = hydrateStore.str_major ?? str_major.value
    str_weight_adjustment.value = hydrateStore.str_weight_adjustment ?? str_weight_adjustment.value

    intelligenceMod.value = hydrateStore.intelligenceMod ?? intelligenceMod.value
    wisdomMod.value = hydrateStore.wisdomMod ?? wisdomMod.value
    dexterityMod.value = hydrateStore.dexterityMod ?? dexterityMod.value
    constitutionMod.value = hydrateStore.constitutionMod ?? constitutionMod.value
    charismaMod.value = hydrateStore.charismaMod ?? charismaMod.value

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
    str_attack,
    str_damage,
    str_minor,
    str_major,
    str_weight_adjustment,
    intelligenceMod,
    wisdomMod,
    dexterityMod,
    constitutionMod,
    charismaMod,
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
