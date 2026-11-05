<script setup lang="ts">
interface IButtonProps {
    variant?: 'primary' | 'danger' | 'outline';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

const props = withDefaults(defineProps<IButtonProps>(), {
    variant: 'outline',
    type: 'button',
    disabled: false,
});

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
}>();

const classes = computed(() => [
    'btn',
    `btn_variant-${props.variant}`,
    {
        'btn_disabled': props.disabled,
    },
]);

const buttonAttrs = computed(() => ({
    type: props.type,
    disabled: props.disabled,
    class: classes.value,
}));

const handleClick = (event: MouseEvent) => {
    if (props.disabled) {
        event.preventDefault();
        return;
    }

    emit('click', event);
};
</script>

<template>
    <button v-bind="buttonAttrs" @click="handleClick">
        <slot />
    </button>
</template>

<style lang="scss" scoped>
.btn {
    width: 100%;
    height: 40px;
    gap: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
    border: 1px solid transparent;
    border-radius: 8px;
    transition: all 0.15s ease;
    white-space: nowrap;
    user-select: none;
    line-height: 1;
    cursor: pointer;

    &_variant-danger {
        border-color: var(--color-danger);
        color: var(--color-danger);

        &:hover:not(:disabled) {
            background: #ffefef;
        }

        &:active:not(:disabled) {
            background: #fedbdb;
        }
    }

    &_variant-outline {
        background: white;
        color: #3b82f6;
        border-color: #3b82f6;

        &:hover:not(:disabled) {
            background: #eff6ff;
        }

        &:active:not(:disabled) {
            background: #dbeafe;
        }
    }

    &_disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    }
}
</style>