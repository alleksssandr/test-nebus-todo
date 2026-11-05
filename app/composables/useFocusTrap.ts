import { ref, onMounted, onUnmounted, nextTick } from 'vue';

export function useFocusTrap(modalRef: Ref<HTMLElement | null>) {
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !modalRef.value) return;

    const focusableElements = modalRef.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey) { // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else { // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  onMounted(async () => {
    await nextTick();
    document.addEventListener('keydown', handleKeydown);
    
    const firstEl = modalRef.value?.querySelector('button, input') as HTMLElement;
    firstEl?.focus();
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
  });
}