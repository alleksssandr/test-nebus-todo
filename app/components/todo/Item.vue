<script setup lang="ts">
import Accept from '~/assets/icons/accept.vue';
import Minus from '~/assets/icons/minus.vue';

interface ITodoItemProps {
    modelValue?: boolean;
    label?: string;
    editable?: boolean;
    disabled?: boolean;
    error?: string;
}

const props = withDefaults(defineProps<ITodoItemProps>(), {
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
    if (text === props.label) {
        return
    }
    emit('changeLabel', String(text));
};

const debouncedFn = debounce(handleChangeLabel, 500)

const handleBlurLabel = (text: string | number) => {
  debouncedFn.cancel()
  handleChangeLabel(String(text))
}


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
        class="todo-item"
        :class="{
            'todo-item_disabled': disabled,
            'todo-item_checked': modelValue,
        }"
    >
        <input
            type="checkbox"
            :checked="modelValue"
            :disabled="disabled"
            class="todo-item__input"
            @change="handleChange"
        />

        <div class="todo-item__box">
            <Accept v-if="modelValue"/>
            <Minus v-else/>
        </div>

        <UiInput
            v-if="editable"
            :model-value="label"
            :error
            @blur="handleBlurLabel"
            @update:model-value="debouncedFn"
            @keyup.enter="handleEnter"
        />
        <span v-else-if="label || $slots.default" class="todo-item__label">
            <slot>{{ label }}</slot>
        </span>
    </label>
</template>

<style lang="scss" scoped>
.todo-item {
    display: inline-flex;
    align-items: center;
    gap: var(--space-md);
    cursor: pointer;
    user-select: none;
    transition: opacity 0.15s ease;

    &:hover:not(&_disabled) {
        .todo-item__box {
            border-color: var(--color-primary);
        }
    }

    &_disabled {
        cursor: initial;
        .todo-item_checked {
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
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;

        .todo-item_checked & {
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

        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box: initial;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
    }
}
</style>