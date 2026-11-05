<script lang="ts" setup>
import Delete from '~/assets/icons/delete.vue';
import Edit from '~/assets/icons/edit.vue';
import type { ITodo, ITodoItem } from '~/types/todo';

import { useTodoStore } from '~/store/todo'

type TItemError = { [key: number]: boolean }

const todoStore = useTodoStore()
const {
  addTodo,
  updateTodo,
  getTodo,
  deleteTodo
} = todoStore;
const { todos } = storeToRefs(todoStore)

const route = useRoute()
const router = useRouter()

const id = computed<string>(() => {
  const { id } = route.params
  if (typeof id === 'string') {
    return id
  } else {
    return ''
  }
})

const savedTodo = computed<ITodo | null>((): ITodo | null => {
  if (!id.value) return null

  return todos.value.find(i => i.id === id.value) || null
})


const { loadDraft, debouncedSave, removeDraft } = useDraft(id.value)

const {
  todo,
  setTodo,
  changeName,
  addNewItem,
  changeItemFlag,
  changeItemText,
  removeItem,
  undo,
  redo,
  canUndo,
  canRedo,
  clearHistory
} = useTodoHistory({ id: '', name: '', list: [], date: new Date().getTime() }, debouncedSave)

useUndoRedoKeypress(undo, redo)

const isShowModalDelete = ref<boolean>(false)
const isShowModalCancelChanges = ref<boolean>(false)
const loadedDraftData = ref<ITodo | null>(null)

const errorName = ref<boolean>(false)
const errorsItems = ref<TItemError>({})

const debouncedNameExecute = () => {
  changeName(name.value)
}
const debouncedName = debounce(debouncedNameExecute, 500);


const name = ref<string>('')
const text = ref<string>('')

const items = ref<ITodoItem[]>([])

const handleAdd = () => {
  addNewItem({
    index: items.value.length,
    text: text.value,
    checked: false
  })
}

const handleChangeItemText = (index: number, oldText: string, newText: string) => {
  changeItemText(index, oldText, newText)
}


const isValid = computed<boolean>(() => {
  const hasNameError = errorName.value
  const hasItemsError = Object.values(errorsItems.value).some(error => error === true)

  return !hasNameError && !hasItemsError
})

const validation = (): void => {
  errorName.value = !name.value.trim().length

  items.value.forEach(i => {
    errorsItems.value[i.index] = !i.text.trim().length
  });
}

const handleSave = () => {
  if (!isValid.value) {
    return
  }

  if (todo.value.id) {
    updateTodo(todo.value)
    removeDraft()
  } else {
    removeDraft()
    const uuid = crypto.randomUUID()

    addTodo({
      id: uuid,
      name: name.value,
      list: items.value,
      date: new Date().getTime()
    })
    router.push({ params: { id: uuid } })
  }

  clearHistory()
  
}

const handleDelete = () => {
  isShowModalDelete.value = true
}

const onDelete = () => {
  deleteTodo(todo.value.id)
  isShowModalDelete.value = false
  router.push('/')
}

const handleCancelChanges = () => {
  isShowModalCancelChanges.value = true
}

const onCancelChanges = () => {
  isShowModalCancelChanges.value = false

  if (id.value) {
    const item = getTodo(id.value)
    if (item) {
      setTodo(item)
    } else {
      name.value = ''
      items.value = []
    }
  } else {
    name.value = ''
    items.value = []
  }

  clearHistory()
  handleClearDraft()
}

const handleLoadDraft = () => {
  if (loadedDraftData.value) {
    setTodo(loadedDraftData.value)
    loadedDraftData.value = null
  }
}

const handleClearDraft = () => {
  removeDraft()
  loadedDraftData.value = null
}

const handleStorageChange = (e: StorageEvent) => {
  if (e.key === 'app:todos') {
    const exists = todoStore.getTodo(route.params.id as string);
    if (!exists) {
      console.warn(`[storage]: not exists this todo (${route.params.id})`);
      router.push('/');
    }
  }
};

onMounted(() => {
  if (id.value) {
    const item = getTodo(id.value)
    if (item) {
      todo.value = item
      setTodo(item)

      name.value = item.name
      items.value = item.list
    } else {
      throw createError({
        statusCode: 404,
        statusMessage: 'Todo not found',
      });
    }
  }


  window.addEventListener('storage', handleStorageChange);

  loadedDraftData.value = loadDraft()
})

onUnmounted(() =>
  window.removeEventListener('storage', handleStorageChange)
);

watch(todo, () => {
  name.value = todo.value.name
  items.value = new Array(...todo.value.list)
  validation()
}, { deep: true })

</script>

<template>
  <div class="page-edit">

    <div class="page-edit__block page-edit__name">
      <h3>
        Name:
      </h3>
      <UiInput placeholder="Enter name" v-model="name" @update:model-value="debouncedName"
        :error="errorName ? 'The name field is required' : ''" />
    </div>


    <div class="page-edit__block page-edit__list-wrap">
      <h3>
        List of todo:
      </h3>

      <div v-if="items.length" class="page-edit__list">
        <div v-for="(item, index) in items" :key="index" class="page-edit__row">
          <TodoItem v-model="item.checked" editable :label="item.text"
            :error="errorsItems[item.index] ? 'The text field is required' : ''"
            @update:model-value="changeItemFlag(item.index)"
            @changeLabel="(newLabel) => handleChangeItemText(item.index, item.text, newLabel)" />

          <UiButton variant="danger" class="page-edit__control-btn" @click="removeItem(index, item)">
            <Delete />
          </UiButton>
        </div>
      </div>


      <UiButton @click="handleAdd">
        Add todo item
      </UiButton>

    </div>


    <div class="page-edit__block page-edit__actions">
      <UiButton @click="handleSave">
        Save
      </UiButton>

      <UiButton :disabled="!canUndo || !canUndo" @click="handleCancelChanges">
        Cancel changes
      </UiButton>

      <UiButton variant="danger" :disabled="!todo.id" @click="handleDelete">
        Delete
      </UiButton>

      <UiButton :disabled="!canUndo" @click="undo">
        Undo
      </UiButton>

      <UiButton :disabled="!canRedo" @click="redo">
        Redo
      </UiButton>
    </div>
  </div>

  <ModalsModalConfirm v-if="isShowModalDelete" title="Confirm" :message="`Delete ${todo.name}`" confirm-text="Delete"
    cancel-text="Cancel" @confirm="onDelete" @cancel="isShowModalDelete = false" />

  <ModalsModalConfirm v-if="isShowModalCancelChanges" title="Confirm" message="Cancel all changes?" confirm-text="Ok"
    cancel-text="Cancel" @confirm="onCancelChanges" @cancel="isShowModalCancelChanges = false" />

  <ModalsModalConfirm v-if="loadedDraftData != null" title="Draft" message="Approve draft changes?"
    confirm-text="Approve" cancel-text="Cancel" @confirm="handleLoadDraft" @cancel="handleClearDraft" />
</template>

<style lang="scss" scoped>
.page-edit {
  margin: var(--space-main-y) var(--space-main-x);
  display: grid;
  grid-gap: 12px;
  grid-auto-rows: 135px;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "name list" "actions list";

  &__block {
    height: fit-content;
    padding: 20px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
    border-radius: 12px;
  }

  &__name {
    grid-area: name;

    gap: 12px;
    display: flex;
    flex-direction: column;
  }

  &__list-wrap {
    grid-area: list;

    gap: 12px;
    display: flex;
    flex-direction: column;
  }

  &__actions {
    grid-area: actions;
    gap: 12px;
    display: flex;
  }

  &__list {
    gap: 12px;
    display: flex;
    flex-direction: column;
  }

  &__list-controls {
    display: grid;
    grid-gap: 12px;
    grid-template-columns: 3fr 1fr;
  }

  &__row {
    width: 100%;
    display: grid;
    grid-gap: 12px;
    grid-template-columns: 1fr auto;
  }

  &__control-btn {
    width: 40px;
  }

  @media (max-width: 1024px) {
    &__actions {
      flex-wrap: wrap;
    }
  }
  @media (max-width: 768px) {
    grid-auto-rows: initial;
    grid-template-columns: 1fr;
    grid-template-areas: "name" "list" "actions";

    &__actions {
      gap: 8px;
      flex-wrap: nowrap;
    }

    &__block {
      padding: 10px;
    }
  }

  @media (max-width: 768px) {
    &__actions {
      flex-wrap: wrap;
    }
  }
}
</style>