<script lang="ts" setup>
import Delete from '~/assets/icons/delete.vue';
import Edit from '~/assets/icons/edit.vue';
import type { ITodo, ITodoItem } from '~/store/todo';

import { useTodoStore } from '~/store/todo'

const {
  addTodo,
  updateTodo,
  getTodo,
  deleteTodo
} = useTodoStore()

const route = useRoute()
const router = useRouter()

const id = computed<string>(() => {
  const { id } = route.params
  if ( typeof id === 'string') {
    return id
  } else {
    return ''
  }
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
} = useTodoHistory({ id: '', name: '', list: [] })

const isShowModalDelete = ref<boolean>(false)
const isShowModalCancelChanges = ref<boolean>(false)
const loadedDraftData = ref<IDraftData | null>(null)

const debouncedNameExecute = () => {
  changeName(name.value)
}
const debouncedName = debounce(debouncedNameExecute, 1000);


const name = ref<string>('')
const text = ref<string>('')

const items = ref<ITodoItem[]>([])

const handleAdd = () => {
  if (!text.value.length) {
    return
  }

  addNewItem({
    index: items.value.length,
    content: text.value,
    isCompleted: false
  })
  text.value = ''
}

const handleChangeItemText = (index: number, oldText: string, newText: string) => {
  changeItemText(index, oldText, newText)
}


const handleSave = () => {
  if (todo.value.id) {
    updateTodo(todo.value)
    clearHistory()
  } else {
    const uuid = crypto.randomUUID()
  
    addTodo({
      id: uuid,
      name: name.value,
      list: items.value
    })

    clearHistory()
    removeDraft()

    router.push({ params: { id: uuid } })
  }
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
    setTodo(loadedDraftData.value?.todo)
    loadedDraftData.value = null
  }
}

const handleClearDraft = () => {
  removeDraft()
  loadedDraftData.value = null
}



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

  loadedDraftData.value = loadDraft()
})

watch(todo, () => {
  name.value = todo.value.name
  items.value = new Array(...todo.value.list)

  debouncedSave(todo.value)
}, { deep: true })

</script>

<template>
  <div class="page-edit">

    <div class="page-edit__block page-edit__name">
      <h3>
        Name:
      </h3>
      <UiInput placeholder="Enter name" v-model="name" @update:model-value="debouncedName" />
    </div>


    <div class="page-edit__block page-edit__list-wrap">
      <h3>
        List of todo:
      </h3>

      <div v-if="items.length" class="page-edit__list">
        <div v-for="(item, index) in items" :key="index" class="page-edit__row">
          <UiCheckbox v-model="item.isCompleted" editable :label="item.content"
            @update:model-value="changeItemFlag(item.index)"
            @changeLabel="(newLabel) => handleChangeItemText(item.index, item.content, newLabel)" />

          <UiButton variant="danger" class="page-edit__control-btn" @click="removeItem(index, item)">
            <Delete />
          </UiButton>
        </div>
      </div>


      <div class="page-edit__list-controls">
        <UiInput placeholder="Enter todo item" v-model="text" />

        <UiButton @click="handleAdd">
          Add todo item
        </UiButton>
      </div>

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

  <ModalsModalConfirm v-if="loadedDraftData != null" title="Draft" message="Approve draft changes?" confirm-text="Approve"
    cancel-text="Cancel" @confirm="handleLoadDraft" @cancel="handleClearDraft" />
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
}
</style>