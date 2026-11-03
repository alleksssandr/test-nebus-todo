import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface TodoItem {
  index: number
  isCompleted: boolean
  content: string
}

export interface Todo {
  id: string
  title: string
  list: TodoItem[]
}

export const useTodoStore = defineStore('todos', () => {

  const todos = ref<Todo[]>([])
  const total = computed(() => todos.value.length)

  function addTodo(todo: Todo): void {
    todos.value.push(todo)
  }


  function deleteTodo(id: string) {
    const index = todos.value.filter(todo => todo.id !== id)
    todos.value = todos.value.filter(todo => todo.id !== id)
  }

  return {
    todos,
    total,
    addTodo,
    deleteTodo
  }
})