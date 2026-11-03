<script setup lang="ts">
interface IInputProps {
    modelValue?: string | number;
    placeholder?: string;
    debounce?: number;
}

const props = withDefaults(defineProps<IInputProps>(), {
    modelValue: '',
    placeholder: '',
    debounce: 300,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
    (e: 'input', value: string | number): void;
    (e: 'change', value: string | number): void;
    (e: 'clear'): void;
}>();

const localValue = ref(props.modelValue);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(() => props.modelValue, (newVal) => {
    localValue.value = newVal;
});

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    
    localValue.value = value;
    
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    
    debounceTimer = setTimeout(() => {
        emit('update:modelValue', value);
        emit('input', value);
        debounceTimer = null;
    }, props.debounce);
};

const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('change', target.value);
};

const handleClear = () => {
    localValue.value = '';
    emit('update:modelValue', '');
    emit('clear');
};

onUnmounted(() => {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
});
</script>

<template>
    <div class="input-wrapper">
        <input
            :value="localValue"
            type="text"
            :placeholder="placeholder"
            class="input"
            @input="handleInput"
            @change="handleChange"
        />
    </div>
</template>

<style lang="scss" scoped>
.input-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 100%;
}

.input {
    width: 100%;
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
}
</style>