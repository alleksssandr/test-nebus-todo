<script setup lang="ts">
import TheHeader from './components/app/TheHeader.vue';

</script>

<template>
    <div class="error-layout">
        <TheHeader />
        <div class="error-layout__content">
            <h1>
                404
            </h1>
            <h3>
                Todo is not found
            </h3>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.error-layout {
    &__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        h1 {
            font-size: 64px;
        }
    }
}
</style>