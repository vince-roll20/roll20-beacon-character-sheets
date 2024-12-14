import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import { arrayToObject, objectToArray } from '@/utility/objectify';
import { v4 as uuidv4 } from 'uuid';
import sendToChat from '@/utility/sendToChat';
import rollToChat from '@/utility/rollToChat';
import { useSettingsStore } from '@/sheet/stores/settings/settingsStore';
import { useCharacterStore } from '@/sheet/stores/character/characterStore';
import { useMetaStore } from '@/sheet/stores/meta/metaStore';
// See "inventoryStore.ts" for an explanation of how to use list/repeating sections
interface Attack {
  weaponType: string;
  _id: string;
  name: string;
  description: string;
  ability:string;
  damage:string;
  weaponGroup:string;
  weaponGroupAbility:string;
  shortRange:number | null;
  longRange:number | null;
  reload:string;
  configurable?:boolean;
  cost?:string;
  minStr?:number;
}

export type AttacksHydrate = {
  attacks: {
    attacks: Record<string, Attack>;
  };
};

export const useAttackStore = defineStore('attacks', () => {
  const attacks: Ref<Array<Attack>> = ref([]);
  const attacksCount: ComputedRef<number> = computed(() => attacks.value.length);
  let selectedAttack = {}
  const addAttack = () => {
    attacks.value.push({
      _id: uuidv4(),
      name: `New Attack ${attacks.value.length + 1}`,
      description: '',
      weaponType: 'melee',
      ability:'',
      damage:'',
      weaponGroup:'',
      weaponGroupAbility:'',
      shortRange:null,
      longRange:null,
      reload:'',
      configurable:true,
    });
  }
  const mageAttack = () => {
    attacks.value.push({
      _id: uuidv4(),
      name: 'Arcane Blast',
      description: `If you are holding your arcane device, you can make a special Ranged Attack that damages foes with a blast of magical energy. This resolves like
                    a normal Ranged Attack (no stunts are possible), but the attack roll is an Accuracy (Arcane Blast) test. Arcane Blast has a range of 16 yards and 
                    inflicts 1d6 + Willpower damage. Making this attack requires no Magic Points.`,
      weaponType: 'spell ranged',
      ability:'Willpower',
      damage:'1d6',
      weaponGroup:'',
      weaponGroupAbility:'Willpower',
      shortRange:null,
      longRange:16,
      reload:'',
      configurable:false
    });
  }
  const handleShowUnarmed = () => {
    const unarmedId = attacks.value.findIndex(atk => atk.name === 'Fist (Unarmed)');
    if(unarmedId >= 0){
      removeAttack(attacks.value[unarmedId]._id)
    } else {
      attacks.value.splice(0,0,{
        _id: uuidv4(),
        name: 'Fist (Unarmed)',
        description: 'An unarmored attack made with no weapons. The favored weapon in barrooms everywhere.',
        weaponType: 'Melee',
        ability:'Accuracy',
        damage:'1d3',
        weaponGroup:'Brawling',
        weaponGroupAbility:'Accuracy',
        shortRange:null,
        longRange:null,
        reload:'',
        configurable:true,
      })
    }
  }
  const equipAttack = (attack:any) =>{
    attacks.value.push({
      _id: attack._id,
      name: attack.name,
      description: attack.description,
      weaponType: attack.weaponType,
      ability:attack.ability,
      damage:attack.damage,
      weaponGroup:attack.weaponGroup,
      weaponGroupAbility:attack.weaponGroupAbility,
      shortRange:attack.shortRange,
      longRange:attack.longRange,
      reload:attack.reload,
    });
  };
  const removeAttack = (_id: string) => {
    const indexToRemove = attacks.value.findIndex((attacks) => attacks._id === _id);
    if (indexToRemove >= 0) attacks.value.splice(indexToRemove, 1);
  };

  const printAttack = async (weapon: any, bonus?:number,focus?:any) => {
    if (!weapon) return;
    const components = [
      { label: `Base Roll`, sides: 6, count:3, alwaysShowInBreakdown: true },
      { label: weapon.weaponGroupAbility, value: Number(bonus) },
      { label: 'Focus', value: focus ? focus : 0 },
    ];
    const aim = useSettingsStore().aim
    if(useSettingsStore().aim){

      components.push(
        { label: 'Aim', value: useSettingsStore().aimValue  }
      )  
    }
    
    await rollToChat({
      characterName: useMetaStore().name,
      title: weapon.name,
      allowHeroDie: false,
      rollType:'attack',
      components
    });
  };
  const printAttackDetails = async (weapon: any, bonus?:number,focus?:any) => {
    if (!weapon) return;
    await sendToChat({
      title: weapon.name,
      subtitle: weapon.weaponType,
      traits: ['Weapon Type: ' + weapon.weaponType, 'Weapon Group: ' + weapon.weaponGroup],
      description: weapon.description,
    });
  }
  const printAttackDamage = async(attack: any)=> {
    // const attack = attacks.value.find((item) => item._id === _id);
    // if (!attack) return;

    const diceRegex = /^(\d+)d(\d+)([+-]\d+)?$/;
    const match = attack.damage.match(diceRegex);
    const numberOfDice = parseInt(match![1]);
    const sidesOfDice = parseInt(match![2])
    const modifier = match![3] ? parseInt(match![3]) : 0;
    const components = [
      { label: `Base Roll`, sides: sidesOfDice, count:numberOfDice, alwaysShowInBreakdown: true },
      { label: 'Modifier', value: modifier },
    ];
    await rollToChat({
      characterName: useMetaStore().name,
      title: attack.name,
      allowHeroDie: false,
      rollType:'damage',
      components
    });
  }
  const setCurrentAttack = (_id: string) => {
    const attack = attacks.value.find((item) => item._id === _id);
    if (!attack) return;
    selectedAttack = attack;
  };
  /*
   * Firebase is not able to store Arrays, so the items array must be stored as an object indexed by the _id
   * */
  const dehydrate = () => {
    return {
      attacks: {
        attacks: arrayToObject(attacks.value),
      },
    };
  };

  /*
   * Since the items array is coming is an object, we convert it back into an array before saving here.
   * */
  const hydrate = (hydrateStore: AttacksHydrate) => {
    attacks.value = objectToArray(hydrateStore.attacks?.attacks) || attacks.value;
  };
  return {
    attacks,
    attacksCount,
    selectedAttack,

    addAttack,
    equipAttack,
    mageAttack,
    removeAttack,
    printAttack,
    printAttackDamage,
    printAttackDetails,
    setCurrentAttack,
    handleShowUnarmed,

    dehydrate,
    hydrate,
  };
});
