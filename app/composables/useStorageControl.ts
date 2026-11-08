import { onMounted, onUnmounted } from 'vue'
import { useTodoStore } from '~/store/todo'

export function useStorageControl() {

  const { getTodo, updateTodos } = useTodoStore()

  const route = useRoute()
  const router = useRouter()

  const todoStorageChanged = ref<ITodo | null>(null)

  const handleStorageChange = (e: StorageEvent) => {
    const uuid = route.params.id as string

    const isTodosChanged = e.key === `${STORAGE_PREFIX}todos`

    if (!isTodosChanged) {
      return
    }

    const updatedTodos = loadFromStorage<ITodo[]>('todos', [])
    updateTodos(updatedTodos)

    const currentUpdatedTodo = updatedTodos.find(t => t.id === uuid)

    if (!currentUpdatedTodo) {
      router.push('/');
    } else {
      todoStorageChanged.value = currentUpdatedTodo
    }
  };

  onMounted(() => {
    window.addEventListener('storage', handleStorageChange);
  })

  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange)
  })

  return {
    todoStorageChanged
  }
}