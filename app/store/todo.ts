import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { loadFromStorage, saveToStorage } from '~/utils/storage'

const STORAGE_KEY = 'todos'

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
  getTodo: (id: string) => ITodo | null
}

export const useTodoStore = defineStore('todos', (): ITodoStore => {

  const todos = ref<ITodo[]>([])
  const total = computed(() => todos.value.length)


  function addTodo(todo: ITodo): void {
    todos.value.push(todo)
    saveToStorage(STORAGE_KEY, todos.value)
  }


  function deleteTodo(id: string) {
    const index = todos.value.findIndex(todo => todo.id === id)
    if (index !== -1) {
      todos.value.splice(index, 1)
    }
  }

  function getTodo(id: string) {
    return todos.value.find(todo => todo.id === id) || null
  }

  onMounted(() => {
    todos.value = loadFromStorage<ITodo[]>(STORAGE_KEY, [])
  }) 

  return {
    todos,
    total,
    addTodo,
    deleteTodo,
    getTodo
  }
})