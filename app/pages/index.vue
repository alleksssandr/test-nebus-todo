<script lang="ts" setup>
import { useTodoStore } from '@/store/todo';
import Add from '~/assets/icons/add.vue';
import Delete from '~/assets/icons/delete.vue';

const router = useRouter()

const todoStore = useTodoStore()

const { todos } = storeToRefs(todoStore)

const handleOpen = (id: string) => {
  router.push({ name: 'todo-id', params: { id: id}})
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
    
    <TodoCard
      v-else
      v-for="todo in todos"
      :key="`todo-${todo.id}`"
      :id="todo.id"
      :list="todo.list"
      :name="todo.name"
      @open="handleOpen"
      @delete="handleConfirmDelete"
    />
  </div>

  <ModalsModalConfirm
    v-if="deleteTodoId"
    title="Confirm"
    :message="`Delete todo ${deleteTodoName}`"
    confirm-text="Delete"
    cancel-text="Cancel"
    @confirm="handleDelete"
    @cancel="deleteTodoId = ''"
  />
</template>

<style lang="scss" scoped>
.page-main {
  margin: var(--space-main-y) var(--space-main-x);
  gap: 18px;
  display: flex;
  flex-wrap: wrap;

  &__empty {
    width: 100%;
    text-align: center;
    font-size: 22px;
  }
}
</style>
