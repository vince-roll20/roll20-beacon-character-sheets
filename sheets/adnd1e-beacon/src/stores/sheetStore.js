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
  const faction = ref('')
  const abilities = ref([])
  const abilitiesCount = computed(() => abilities.value?.length)

  // Handles retrieving these values from the store
  const dehydrate = () => {
    return {
      hp: hp.value,
      hp_max: hp_max.value,
      ac: ac.value,
      class1: class1.value,
      faction: faction.value,
      abilities: arrayToObject(abilities.value)
    }
  }
  // Handles updating these values in the store.
  const hydrate = (hydrateStore) => {
    hp.value = hydrateStore.hp ?? hp.value
    hp_max.value = hydrateStore.hp_max ?? hp_max.value
    ac.value = hydrateStore.ac ?? ac.value
    class1.value = hydrateStore.class1 ?? class1.value
    faction.value = hydrateStore.faction ?? faction.value
    abilities.value = objectToArray(hydrateStore.abilities) || abilities.value
  }

  return {
    hp,
    hp_max,
    ac,
    class1,
    faction,
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
