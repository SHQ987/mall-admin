<template>
  <svg :style="{ width, height }" aria-hidden="true">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    color?: string
    width?: string
    height?: string
  }>(),
  {
    color: 'currentColor',
    width: '1em',
    height: '1em'
  }
)

const symbolId = computed(() => `#icon-${props.name}`)
</script>
