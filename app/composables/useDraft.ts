import type { ITodo, ITodoItem } from '~/types/todo'



export function useDraft(id: string) {
    const debouncedSave = debounce(saveDraft, 2000);

    const storageKey = `${STORAGE_KEY_DRAFT}-${id}`


    function saveDraft(todo: ITodo) {
        saveToStorage(storageKey, { ...todo, date: new Date().getTime() })
    }

    function loadDraft(): ITodo | null {
        return loadFromStorage<ITodo | null>(storageKey, null)
    }

    function removeDraft(): void {
        removeFromStorage(storageKey)
    }

    return {
        debouncedSave,
        loadDraft,
        removeDraft
    }
}