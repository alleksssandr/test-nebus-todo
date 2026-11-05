<script lang="ts" setup>
import Add from '~/assets/icons/add.vue';
import type { ITodoItem } from '~/store/todo';

import { useTodoStore } from '~/store/todo'

const { addTodo, getTodo } = useTodoStore()

const route = useRoute()
const router = useRouter()


const name = ref<string>('')

const text = ref<string>('')

const items = ref<ITodoItem[]>([])

const handleAdd = () => {
  if (!text.value.length) {
    return
  }

  items.value.push({
    index: items.value.length,
    content: text.value,
    isCompleted: false
  })

  text.value = ''
}

const handleSave = () => {
  const uuid = crypto.randomUUID()
  addTodo({
    id: uuid,
    title: name.value,
    list: items.value
  })

  router.push({params: {id : uuid}})
}

onMounted(() => {
  const { id } = route.params
  if (id && id.length) {
    const item = getTodo(id as string)

    if (item) {
      name.value = item.title
      items.value = item.list
    }
  }
})

</script>

<template>
      <div class="page-edit">

        <div class="page-edit__block page-edit__name">
          <h3>
            Name:
          </h3>
          <UiInput
            placeholder="Enter name"
            v-model="name"
          />
        </div>


        <div class="page-edit__block page-edit__list-wrap">
          <h3>
            List of todo:
          </h3>

          <div v-if="items.length" class="page-edit__list">
            <div
              v-for="(item, index) in items"
              :key="index"
            >
              <UiCheckbox v-model="item.isCompleted" :label="item.content"/>
            </div>
          </div>
  
  
          <div class="page-edit__list-controls">
            <UiInput
              placeholder="Enter todo"
              v-model="text"
            />

            <UiButton @click="handleAdd">
              Add todo item
            </UiButton>
          </div>

        </div>


        <div class="page-edit__block page-edit__actions">
          <UiButton @click="handleSave">
            Save
          </UiButton>

          <UiButton>
            Cancel changes
          </UiButton>

          <UiButton>
            Delete
          </UiButton>

          <UiButton>
            Undo
          </UiButton>

          <UiButton>
            Redo
          </UiButton>
        </div>
      </div>
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
}
</style>