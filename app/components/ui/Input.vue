<script setup lang="ts">
interface IInputProps {
    modelValue?: string | number;
    placeholder?: string;
}

const props = withDefaults(defineProps<IInputProps>(), {
    modelValue: '',
    placeholder: '',
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
        <input
            :value="localValue"
            type="text"
            :placeholder="placeholder"
            class="input"
            @input="handleInput"
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