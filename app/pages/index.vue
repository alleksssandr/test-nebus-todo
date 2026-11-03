<script lang="ts" setup>
import { useTodoStore } from '@/store/todo';
import Add from '~/assets/icons/add.vue';
import Delete from '~/assets/icons/delete.vue';

const todoStore = useTodoStore()

const { todos } = storeToRefs(todoStore)
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
      :name="todo.title"
    />
  </div>
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
