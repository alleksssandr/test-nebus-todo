import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ITodoItem {
  index: number
  isCompleted: boolean
  content: string
}

export interface ITodo {
  id: string
  title: string
  list: ITodoItem[]
}

interface ITodoStore {
  todos: Ref<ITodo[]>
  total: Ref<number>
  addTodo: (todo: ITodo) => void
  deleteTodo: (id: string) => void
}

export const useTodoStore = defineStore('todos', (): ITodoStore => {

  const todos = ref<ITodo[]>([])
  const total = computed(() => todos.value.length)

  function addTodo(todo: ITodo): void {
    todos.value.push(todo)
  }


  function deleteTodo(id: string) {
    const index = todos.value.findIndex(todo => todo.id === id)
    if (index !== -1) {
      todos.value.splice(index, 1)
    }
  }

  return {
    todos,
    total,
    addTodo,
    deleteTodo
  }
})