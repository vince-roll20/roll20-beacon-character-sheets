import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import { arrayToObject, objectToArray } from '@/utility/objectify';
import { v4 as uuidv4 } from 'uuid';
import sendToChat from '@/utility/sendToChat';
import rollToChat from '@/utility/rollToChat';
import { useSettingsStore } from '@/sheet/stores/settings/settingsStore';
import { useMetaStore } from '@/sheet/stores/meta/metaStore';
import { useAbilityScoreStore } from '../abilityScores/abilityScoresStore';
import { useCharacterStore } from '../character/characterStore';

// See "inventoryStore.ts" for an explanation of how to use list/repeating sections
interface Spell {
  _id: string;
  name: string;
  arcanaType: string;
  requirements:string;
  shortDescription: string;
  description: string;
  ability:string;
  spellType:string;
  spellTypeBonus:number;
  mpCost:number;
  castingTime:string;
  targetNumber:number;
  spellTest:string;
  extendable:boolean;
  damageHit:string;
  damageMiss:string;
}

export type SpellsHydrate = {
  spells: {
    spells: Record<string, Spell>;
  };
};

export const useSpellStore = defineStore('spells', () => {
  const spells: Ref<Array<Spell>> = ref([]);
  const spellsCount: ComputedRef<number> = computed(() => spells.value.length);
  let selectedSpell = {}
  const addSpell = (spell?:any) => {
    // debugger
    spells.value.push({
      _id: uuidv4(),
      name: spell ? spell?.name : '',
      arcanaType: spell ? spell?.arcanaType : '',
      requirements:spell ? spell?.requirements : '',
      shortDescription: spell ? spell?.shortDescription : '',
      description: spell ? spell?.description : '',
      ability:spell ? spell?.ability : '',
      spellType:spell ? spell?.spellType : '',
      spellTypeBonus:spell ? spell?.spellTypeBonus : 0,
      mpCost:spell ? spell?.mpCost : 0,
      castingTime:spell ? spell?.castingTime : '',
      targetNumber:spell ? spell?.targetNumber : 0,
      spellTest:spell ? spell?.spellTest : '',
      extendable:spell ? spell?.extendable : false,
      damageHit:spell ? spell?.damageHit : '',
      damageMiss:spell ? spell?.damageMiss : '',
    });
  }
  const removeSpell = (_id: string) => {
    const indexToRemove = spells.value.findIndex((spells) => spells._id === _id);
    if (indexToRemove >= 0) spells.value.splice(indexToRemove, 1);
  };

  const printSpell = async (_id: string, bonus?:number) => {
    const spell = spells.value.find((item) => item._id === _id);
    if (!spell) return;
    const components:any[] = [
      { label: `Base Roll`, sides: 6, count:3, alwaysShowInBreakdown: true },
    ];
    const aim = useSettingsStore().aim
    if(useSettingsStore().aim){

      components.push(
        { label: 'Aim', value: useSettingsStore().aimValue  }
      )  
    }
    spendMP(spell.mpCost);
    const ability = useAbilityScoreStore();
    await rollToChat({
      title: spell.name,
      subtitle: spell.spellType,
      characterName: useMetaStore().name,
      allowHeroDie: false,
      textContent:spell.spellTest ? spell.spellTest + '<br /> vs. Spellpower ('+ (10 + Number(ability.WillpowerBase))+')' : '',
      targetNumber:spell.targetNumber,
      components
    });
  };
  const printSpellDamage = async(spell: any)=> {
    // const attack = attacks.value.find((item) => item._id === _id);
    // if (!attack) return;
// debugger
    const diceRegex = /^(\d+)d(\d+)([+-]\d+)?$/;
    const hit = spell.damageHit.match(diceRegex);
    const numberOfDice = parseInt(hit![1]);
    const sidesOfDice = parseInt(hit![2])
    const modifier = hit![3] ? parseInt(hit![3]) : 0;
    const miss = spell.damageMiss.match(diceRegex);
    const missNumberOfDice = parseInt(miss![1]);
    const missSidesOfDice = parseInt(miss![2])
    const missModifier = miss![3] ? parseInt(miss![3]) : 0;
    console.log([ { label: `Miss Roll`, sides: missNumberOfDice, count:missSidesOfDice, alwaysShowInBreakdown: true },
      { label: 'Modifier', value: missModifier },])
    const components = [
      { label: `Base Roll`, sides: sidesOfDice, count:numberOfDice, alwaysShowInBreakdown: true },
      { label: 'Modifier', value: modifier },
    ];
    const secondaryComponents = [
      { label: `Miss Roll`, sides: missNumberOfDice, count:missSidesOfDice, alwaysShowInBreakdown: true },
      { label: 'Modifier', value: missModifier },
    ]
    await rollToChat({
      characterName: useMetaStore().name,
      title: spell.name,
      allowHeroDie: false,
      rollType:'spellDamage',
      components,
      secondaryComponents
    });
  }
  const setCurrentSpell = (_id: string) => {
    const spell = spells.value.find((item) => item._id === _id);
    if (!spell) return;
    selectedSpell = spell;
  };

  const spendMP = (mp:number) => {
    const char = useCharacterStore()
    // char.magic = char.magic - mp;
    char.magic -= mp;
  }

  /*
   * Firebase is not able to store Arrays, so the items array must be stored as an object indexed by the _id
   * */
  const dehydrate = () => {
    return {
      spells: {
        spells: arrayToObject(spells.value),
      },
    };
  };

  /*
   * Since the items array is coming is an object, we convert it back into an array before saving here.
   * */
  const hydrate = (hydrateStore: SpellsHydrate) => {
    spells.value = objectToArray(hydrateStore.spells?.spells) || spells.value;
  };
  return {
    spells,
    spellsCount,
    selectedSpell,

    addSpell,
    removeSpell,
    printSpell,
    printSpellDamage,
    setCurrentSpell,

    dehydrate,
    hydrate,
  };
});
