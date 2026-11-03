<script setup lang="ts">
import Add from '~/assets/icons/add.vue';
import Logo from '~/assets/icons/logo.vue';

const router = useRouter()

const handleCreate = () => {
    router.push('/todo')
}

</script>

<template>
    <div class="header">
        <NuxtLink class="header__left" to="/">
            <Logo />

            <span>
                Test TODO
            </span>
        </NuxtLink>

        <div class="header__right">
            <UiButton
                @click="handleCreate"
            >
                <Add />

                <span>
                    Create
                </span>
            </UiButton>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.header {
    padding: 0 var(--space-main-x);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;

    &__left {
        gap: 4px;
        display: flex;
        align-items: center;
        font-size: 22px;
    }
}
</style>