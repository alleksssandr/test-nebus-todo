import { onMounted, onUnmounted } from 'vue'

export function useUndoRedoKeypress(onUndo: () => void, onRedo: () => void) {

  const handleKeydown = (e: KeyboardEvent) => {
    const isMod = e.ctrlKey || e.metaKey

    if (!isMod) return

    const target = e.target as HTMLElement

    const isTextInput = 
      target.tagName === 'INPUT' || 
      target.isContentEditable

    if (isTextInput) {
      return 
    }

    if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
      e.preventDefault()
      onUndo()
      return
    }

    if ((e.key.toLowerCase() === 'z' && e.shiftKey)) {
      e.preventDefault()
      onRedo()
      return
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}