<template>
   <div class="layout">
    <AppTheHeader/>
    <NuxtPage class="page-content" />
  </div>
</template>

<style lang="scss">
.layout {
  display: grid;
  grid-template-rows: var(--header-height) 1fr;
}
</style>w
