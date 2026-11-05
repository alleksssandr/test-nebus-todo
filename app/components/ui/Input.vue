<script setup lang="ts">
interface IInputProps {
    modelValue?: string | number;
    placeholder?: string;
    error?: string;
}

const props = withDefaults(defineProps<IInputProps>(), {
    modelValue: '',
    placeholder: '',
    error: '',
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
}>();

const localValue = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
    localValue.value = newVal;
});

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    localValue.value = value;
    emit('update:modelValue', value);
};

</script>

<template>
    <div class="input-wrapper">
        <input :value="localValue" type="text" :placeholder="error ? error : placeholder" class="input"
            :class="[{ 'input_error': error }]" @input="handleInput" />
    </div>
</template>

<style lang="scss" scoped>
.input-wrapper {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
}

.input {
    height: 40px;
    padding: 0 12px;
    font-size: 14px;
    font-family: inherit;
    color: #1f2937;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    outline: none;
    transition: all 0.15s ease;

    &::placeholder {
        color: #9ca3af;
    }

    &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &_error {
        border-color: #ef4444;

        &::placeholder {
            color: #ef4444;
        }

        &:focus {
            border-color: #ef4444;
        }
    }
}
</style>