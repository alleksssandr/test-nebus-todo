<script lang="ts" setup>
import { useTodoStore } from '~/store/todo';

const router = useRouter()

const todoStore = useTodoStore()

const { todos } = storeToRefs(todoStore)

const handleOpen = (id: string) => {
  router.push({ name: 'todo-id', params: { id: id } })
}

const deleteTodoId = ref<string>('')
const deleteTodoName = ref<string>('')

const handleConfirmDelete = (id: string, name: string) => {
  deleteTodoId.value = id
  deleteTodoName.value = name
}

const handleDelete = () => {
  if (deleteTodoId.value) {
    todoStore.deleteTodo(deleteTodoId.value)
    deleteTodoId.value = ''
  }
}

</script>

<template>
  <div class="page-main">
    <div v-if="!todos.length" class="page-main__empty">
      Todo list is empty
    </div>

    <TodoCard v-else v-for="todo in todos" :key="`todo-${todo.id}`" :id="todo.id" :list="todo.list" :name="todo.name"
      @open="handleOpen" @delete="handleConfirmDelete" />
  </div>

  <ModalsModalConfirm v-if="deleteTodoId" title="Confirm" :message="`Delete todo ${deleteTodoName}`"
    confirm-text="Delete" cancel-text="Cancel" @confirm="handleDelete" @cancel="deleteTodoId = ''" />
</template>

<style lang="scss" scoped>
.page-main {
  margin: var(--space-main-y) var(--space-main-x);
  padding-bottom: var(--space-main-y);
  gap: var(--space-md);
  display: grid;
  grid-template-columns: repeat(4, minmax(200px, 1fr));

  &__empty {
    width: 100%;
    text-align: center;
    font-size: 22px;
  }

  @media (max-width: 1440px) {
    grid-template-columns: repeat(3, minmax(200px, 1fr));
  }
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
