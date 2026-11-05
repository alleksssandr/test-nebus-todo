import type { ITodo, ITodoItem } from '~/store/todo'

const DRAFT_PREFIX = 'draft'

export interface IDraftData {
    date: number,
    todo: ITodo
}


export function useDraft(id: string) {
    const debouncedSave = debounce(saveDraft, 5000);

    const storageKey = `${DRAFT_PREFIX}-${id}`


    function saveDraft(todo: ITodo) {
        saveToStorage(storageKey, { date: new Date(), todo })
    }

    function loadDraft(): IDraftData | null {
        return loadFromStorage<IDraftData | null>(storageKey, null)
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