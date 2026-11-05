<script setup lang="ts">
import Close from '~/assets/icons/close.vue';

interface Props {
    title?: string;
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
});

const emit = defineEmits<{
    (e: 'close'): void;
}>();

const close = () => {
    emit('close');
};

const handleOverlayClick = () => {
    close();
};

const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        close();
    }
};

onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
    document.body.style.overflow = 'hidden';
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
});
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                class="modal-overlay"
                @click="handleOverlayClick"
            >
                <div
                    class="modal"
                    @click.stop
                >
                    <div v-if="title" class="modal__header">
                        <h3 v-if="title" class="modal__title">{{ title }}</h3>
                        <button
                            class="modal__close"
                            @click="close"
                        >
                            <Close />
                        </button>
                    </div>

                    <div class="modal__body">
                        <slot />
                    </div>

                    <div v-if="$slots.footer" class="modal__footer">
                        <slot name="footer" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style lang="scss" scoped>
.modal-overlay {
    padding: 20px;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.modal {
    max-width: 500px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &__header {
        padding: 20px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e5e7eb;
    }

    &__title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
    }

    &__close {
        width: 32px;
        height: 32px;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        transition: all 0.15s ease;

        svg {
            width: 20px;
            height: 20px;
        }

        &:hover {
            background: #f3f4f6;
            color: #1f2937;
        }
    }

    &__body {
        padding: 24px;
        overflow-y: auto;
        flex: 1;
    }

    &__footer {
        padding: 16px 24px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;

    .modal {
        transition: transform 0.2s ease;
    }
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;

    .modal {
        transform: scale(0.95) translateY(-10px);
    }
}
</style>