<script setup lang="ts">
interface IModalConfirmProps {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

const props = withDefaults(defineProps<IModalConfirmProps>(), {
    title: '',
    confirmText: '',
    cancelText: '',
});

const emit = defineEmits<{
    (e: 'confirm'): void;
    (e: 'cancel'): void;
}>();

const handleConfirm = () => {
    emit('confirm');
};

const handleCancel = () => {
    emit('cancel');
};

</script>

<template>
    <ModalsModalContainer
        :title="title"
        @close="handleCancel"
    >
        <div class="confirm-modal">
            <p class="confirm-modal__message">{{ message }}</p>
        </div>

        <template #footer>
            <UiButton @click="handleCancel">
                {{ cancelText }}
            </UiButton>

            <UiButton @click="handleConfirm">
                {{ confirmText }}
            </UiButton>
        </template>
    </ModalsModalContainer>
</template>

<style lang="scss" scoped>
.confirm-modal {
    text-align: center;

    &__icon {
        width: 64px;
        height: 64px;
        margin: 0 auto 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f9fafb;
        border-radius: 50%;

        svg {
            width: 32px;
            height: 32px;
        }
    }

    &__message {
        font-size: 15px;
        color: #4b5563;
        line-height: 1.6;
        margin: 0;
    }
}
</style>