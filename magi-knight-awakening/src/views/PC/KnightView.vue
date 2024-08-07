<script setup>

import SplitMods from '@/components/SplitMods.vue';
import NotchContainer from '@/components/NotchContainer.vue';
import ImageBackedLabel from '@/components/ImageBackedLabel.vue';
import LabelStacked from '@/components/LabelStacked.vue';
import RepeatingSection from '@/components/RepeatingSection.vue';
import RepeatingItem from '@/components/RepeatingItem.vue';
import Collapsible from '@/components/Collapsible.vue';
import SpellSection from '@/components/SpellSection.vue';

import { useSheetStore } from '@/stores/sheetStore';

const sheet = useSheetStore();
const knightAttributes = [
  {
    name: 'knight_armor',
    image: 'shield',
    crown: true,
    text: 'armor',
    readonly: false
  },
  {
    name: 'knight_move',
    image: 'complex-hex',
    crown: false,
    text: 'move',
    readonly: false
  },
  {
    name: 'knight_attack',
    image: 'target',
    crown: false,
    text: 'attack',
    readonly: false
  },
  {
    name: 'knight_damage',
    image: 'thorns',
    crown: false,
    text: 'damage',
    readonly: false
  }
];
const elements = [
  {
    name: 'earth',
    description: 'solid'
  },
  {
    name: 'fire',
    description: 'destructive'
  },
  {
    name: 'air',
    description: 'incorporeal'
  },
  {
    name: 'water',
    description: 'shifting'
  },
  {
    name: 'void',
    description: 'energy'
  }
]
</script>

<template>
<div class="knight-view">
  <div class="flex-box half-gap flex-wrap grid-span-all justify-space-between">
    <LabelStacked>
      <template v-slot:number>
        <select class="underline" v-model="sheet.elemental_affinity">
          <option selected value="">select element</option>
          <option v-for="element in elements" :value="element.name">{{ `${element.name} (${element.description})` }}</option>
        </select>
      </template>
      <template v-slot:label>
        <span>Elemental Affinity</span>
      </template>
    </LabelStacked>
    <LabelStacked>
      <template v-slot:number>
        <input type="text" class="underline" v-model="sheet.magic_style">
      </template>
      <template v-slot:label>
        <span>Magic Style</span>
      </template>
    </LabelStacked>
    <LabelStacked>
      <template v-slot:number>
        <select class="underline" v-model="sheet.mam">
          <option selected value="">select ability</option>
          <option v-for="(o,ability) in sheet.abilityScores" :value="ability">{{ ability }}</option>
        </select>
      </template>
      <template v-slot:label>
        <span>Magic Ability Modifier</span>
      </template>
    </LabelStacked>
  </div>
  <SplitMods :attributes="knightAttributes" class="knight-split">
    <template v-slot:content>
      <ImageBackedLabel v-for="attr in ['Spell Attack','Spell DC']" :key="`${attr}-image-label`" image="bottle">
        <template v-slot:value>
          <span>{{ sheet[attr.replace(/\s+/g,'_').toLowerCase()] }}</span>
        </template>
        <template v-slot:text>
          <span>{{ attr }}</span>
        </template>
      </ImageBackedLabel>
    </template>
  </SplitMods>
  <NotchContainer class="armor-weave-container basic-item" width="thick" notchType="curve">
    <h4>Soul Armor Weave</h4>
    <Collapsible class="basic-item" :default="sheet.armor_weave.collapsed" @collapse="sheet.armor_weave.collapsed = !sheet.armor_weave.collapsed">
      <template v-slot:expanded>
        <div class="flex-box half-gap grow-label">
          <label :for="`armor-weave-name`">Name</label>
          <input class="underline" type="text" v-model="sheet.armor_weave.name" :id="`armor-weave-name`">
        </div>
        <div class="grid">
          <label :for="`armor-weave-description`">Description</label>
          <textarea class="underline" :id="`armor-weave-description`" v-model="sheet.armor_weave.description"></textarea>
        </div>
      </template>
      <template v-slot:collapsed>
        <span>{{ sheet.armor_weave.name || 'New Weave' }}</span>
      </template>
    </Collapsible>
    <!-- static content data here -->
  </NotchContainer>
  <NotchContainer class="soul-weapon-container basic-item" width="thick" notchType="curve">
    <h4>Soul Weapon</h4>
    <Collapsible class="basic-item" :default="sheet.soul_weapon.collapsed" @collapse="sheet.soul_weapon.collapsed = !sheet.soul_weapon.collapsed">
      <template v-slot:expanded>
        <div class="flex-box half-gap grow-label">
          <label :for="`soul-weapon-name`">Name</label>
          <input type="text" v-model="sheet.soul_weapon.name" :id="`soul-weapon-name`">
        </div>
        <div class="flex-box half-gap grow-label">
          <label :for="`soul-weapon-range`">Range</label>
          <input type="text" v-model="sheet.soul_weapon.range" :id="`soul-weapon-range`">
        </div>
        <div class="flex-box half-gap grow-label">
          <label :for="`soul-weapon-damage`">Damage</label>
          <input type="text" v-model="sheet.soul_weapon.damage" :id="`soul-weapon-damage`">
        </div>
        <div class="grid">
          <label :for="`soul-weapon-qualities`">Qualities</label>
          <textarea :id="`soul-weapon-qualities`" v-model="sheet.soul_weapon.qualities"></textarea>
        </div>
      </template>
      <template v-slot:collapsed>
        <button @click="sheet.rollWeapon">{{ sheet.soul_weapon.name || 'New Weapon' }}</button>
        <span class="description-span">{{ sheet.soul_weapon.qualities }}</span>
      </template>
    </Collapsible>
    <!-- Static content here -->
  </NotchContainer>
  <NotchContainer class="combat-form-container basic-item" width="thick" notchType="curve">
    <h4>Combat Forms</h4>
    <RepeatingSection name="forms">
      <RepeatingItem name="forms" v-for="item in sheet.sections.forms.rows">
        <Collapsible class="form-item basic-item" :default="item.collapsed" @collapse="item.collapsed = !item.collapsed">
          <template v-slot:expanded>
            <div class="flex-box half-gap grow-label">
              <label :for="`form-${item._id}-name`">Name</label>
              <input type="text" v-model="item.name" :id="`form-${item._id}-name`">
            </div>
            <div class="grid">
              <label :for="`form-${item._id}-description`">Description</label>
              <textarea :id="`form-${item._id}-description`" v-model="item.description"></textarea>
            </div>
          </template>
          <template v-slot:collapsed>
            <span>{{ item.name || 'New Form' }}</span>
          </template>
        </Collapsible>
      </RepeatingItem>
    </RepeatingSection>
    <!-- repeating section here -->
  </NotchContainer>
  <NotchContainer class="arm-rune-container basic-item" width="thick" notchType="curve">
    <h4>Soul Armament Runes</h4>
    <RepeatingSection name="runes">
      <RepeatingItem name="runes" v-for="item in sheet.sections.runes.rows">
        <Collapsible class="form-item basic-item" :default="item.collapsed" @collapse="item.collapsed = !item.collapsed">
          <template v-slot:expanded>
            <div class="flex-box half-gap grow-label">
              <label :for="`form-${item._id}-name`">Name</label>
              <input class="underline" type="text" v-model="item.name" :id="`form-${item._id}-name`">
            </div>
            <div class="grid">
              <label :for="`form-${item._id}-description`">Description</label>
              <textarea class="underline" :id="`form-${item._id}-description`" v-model="item.description"></textarea>
            </div>
          </template>
          <template v-slot:collapsed>
            <span>{{ item.name || 'New Form' }}</span>
          </template>
        </Collapsible>
      </RepeatingItem>
    </RepeatingSection>
    <!-- repeating section here -->
  </NotchContainer>
  
  <NotchContainer class="relic-container basic-item" width="thick" notchType="curve">
    <h4>Relic</h4>
    <Collapsible class="basic-item" :default="sheet.relic.collapsed" @collapse="sheet.relic.collapsed = !sheet.relic.collapsed">
      <template v-slot:expanded>
        <div class="flex-box half-gap grow-label">
          <label :for="`relic-name`">Name</label>
          <input class="underline" type="text" v-model="sheet.relic.name" :id="`relic-name`">
        </div>
        <div class="grid">
          <label :for="`relic-description`">Description</label>
          <textarea class="underline" :id="`relic-description`" v-model="sheet.relic.description"></textarea>
        </div>
      </template>
      <template v-slot:collapsed>
        <span>{{ sheet.relic.name || 'New Weave' }}</span>
      </template>
    </Collapsible>
  </NotchContainer>
  <div class="spell-path-container grid-span-all">
    <h3>Spells</h3>
    <div class="spell-path-layout">
      <div class="spell-tier-headers">
        <h4>I</h4>
        <h4>II</h4>
        <h4>III</h4>
        <h4>IV</h4>
        <h4>V</h4>
        <h4>VI</h4>
      </div>
      <SpellSection/>
    </div>
  </div>
</div>
</template>

<style lang="scss">
.knight-view {
  display: grid;
  gap: var(--half-gap);
  grid-auto-flow: dense;
  > .split-display{
    grid-column: 1 / -1;
  }

  @container (650px < width) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @container (500px < width <=650px) {
    grid-template-columns: 1fr 1fr;
  }

  .skill-container {
    grid-column: 1;
  }
  .spell-path-container{
    display: grid;
    gap: var(--half-gap);
  }
  .spell-path-layout{
    display: grid;
    gap: var(--tiny-gap);
    grid-template-rows: repeat(7, auto);
    grid-template-columns: auto 1fr;
    grid-template-areas:
      ".      rep"
      "header rep"
      "header rep"
      "header rep"
      "header rep"
      "header rep"
      "header rep"
      "add    edit";
    grid-auto-flow: column;
  }
  .spell-tier-headers{
    grid-area: header;
    display: grid;
    grid-template-rows: subgrid;
  }
}
</style>