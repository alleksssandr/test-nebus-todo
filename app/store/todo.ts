import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { loadFromStorage, saveToStorage } from '~/utils/storage'
import type { ITodo, ITodoItem } from '~/types/todo';

interface ITodoStore {
  todos: Ref<ITodo[]>
  addTodo: (todo: ITodo) => void
  updateTodo: (todo: ITodo) => void
  deleteTodo: (id: string) => void
  getTodo: (id: string) => ITodo | null
  updateTodos: (list: ITodo[]) => void
}

export const useTodoStore = defineStore('todos', (): ITodoStore => {

  const todos = ref<ITodo[]>([])

  function addTodo(todo: ITodo): void {
    todos.value.push({ ...todo, date: new Date().getTime() })
    saveToStorage(STORAGE_KEY_MAIN, todos.value)
  }

  function updateTodo(newTodo: ITodo): void {
    const index = todos.value.findIndex(todo => todo.id === newTodo.id)
    if (index !== -1) {
      todos.value[index] = {
        id: newTodo.id,
        name: newTodo.name,
        date: newTodo.date,
        list: newTodo.list.map(i => (({ index: i.index, text: i.text, checked: i.checked })))
      }

      saveToStorage(STORAGE_KEY_MAIN, todos.value)
    }
  }

  function deleteTodo(id: string): void {
    const index = todos.value.findIndex(todo => todo.id === id)
    if (index !== -1) {
      todos.value.splice(index, 1)
    }

    saveToStorage(STORAGE_KEY_MAIN, todos.value)
  }

  function getTodo(id: string): ITodo | null {
    return todos.value.find(todo => todo.id === id) || null
  }

  function updateTodos(list: ITodo[]): void {
    todos.value = list
  }

  onMounted(() => {
    updateTodos(loadFromStorage<ITodo[]>(STORAGE_KEY_MAIN, []))
  })

  return {
    todos,
    getTodo,
    addTodo,
    updateTodo,
    deleteTodo,
    updateTodos
  }
})