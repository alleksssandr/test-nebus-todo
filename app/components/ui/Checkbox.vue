<script setup lang="ts">
interface ICheckboxProps {
    modelValue?: boolean;
    label?: string;
    disabled?: boolean;
}

const props = withDefaults(defineProps<ICheckboxProps>(), {
    modelValue: false,
    label: '',
    disabled: false,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'change', value: boolean): void;
}>();

const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.checked);
    emit('change', target.checked);
};
</script>

<template>
    <label
        class="checkbox"
        :class="{
            'checkbox_disabled': disabled,
            'checkbox_checked': modelValue,
        }"
    >
        <input
            type="checkbox"
            :checked="modelValue"
            :disabled="disabled"
            class="checkbox__input"
            @change="handleChange"
        />

        <div class="checkbox__box">
            <svg
                v-if="modelValue"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                class="checkbox__icon"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                />
            </svg>
            <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                class="checkbox__icon"
            >
                <path
                    stroke-linecap="round"
                    stroke-width="3"
                    d="M5 12h14"
                />
            </svg>
        </div>

        <span v-if="label || $slots.default" class="checkbox__label">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<style lang="scss" scoped>
.checkbox {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
    transition: opacity 0.15s ease;

    &:hover:not(&_disabled) {
        .checkbox__box {
            border-color: #3b82f6;
        }
    }

    &_disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &__input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
        pointer-events: none;
    }

    &__box {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        background: white;
        border: 2px solid #d1d5db;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;

        .checkbox_checked & {
            background: #3b82f6;
            border-color: #3b82f6;
        }
    }

    &__icon {
        width: 14px;
        height: 14px;
        color: white;
    }

    &__label {
        font-size: 14px;
        color: #374151;
        line-height: 1.5;
    }
}
</style>