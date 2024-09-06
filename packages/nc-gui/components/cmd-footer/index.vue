<script setup lang="ts">
import type { CommandPaletteType } from '~/lib/types'

defineProps<{
  activeCmd: CommandPaletteType
  setActiveCmdView: (cmd: CommandPaletteType) => void
}>()

const renderCmdOrCtrlKey = () => {
  return isMac() ? '⌘' : 'Ctrl'
}
</script>

<template>
  <div class="cmdk-footer absolute inset-x-0 bottom-0 !bg-white">
    <div class="flex justify-center w-full py-2">
    </div>
  </div>
</template>
