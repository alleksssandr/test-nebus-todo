<script setup lang="ts">
import Accept from '~/assets/icons/accept.vue';
import Minus from '~/assets/icons/minus.vue';

interface ICheckboxProps {
    modelValue?: boolean;
    label?: string;
    editable?: boolean;
    disabled?: boolean;
}

const props = withDefaults(defineProps<ICheckboxProps>(), {
    modelValue: false,
    label: '',
    editable: false,
    disabled: false,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'changeLabel', value: string): void;
}>();

const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', !target.checked);
};

const handleChangeLabel = (text: string | number) => {
    emit('changeLabel', String(text));
};

const debouncedText = (text: string | number) => {
  handleChangeLabel(text)
}
const debouncedFn = debounce(debouncedText, 1000);

const handleEnter = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const newText = String(target.value)
    if (props.label !== newText) {
        emit('changeLabel', newText);
    }
}

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
            <Accept v-if="modelValue"/>
            <Minus v-else/>
        </div>

        <UiInput
            v-if="editable"
            :model-value="label"
            @update:model-value="debouncedFn"
            @keyup.enter="handleEnter"
        />
        <span v-else-if="label || $slots.default" class="checkbox__label">
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
        cursor: initial;
        .checkbox_checked {
            opacity: 0.5;
        }
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
        line-height: 1.5;
        color: #374151;
        word-break: break-all;
    }
}
</style>