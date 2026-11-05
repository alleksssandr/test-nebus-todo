import type { ITodo, ITodoItem } from '~/types/todo'


export function useTodoHistory(_todo: ITodo, callbackChanged: (todo: ITodo) => void) {

    const todo = ref<ITodo>(_todo)

    const history = new CommandHistory(50)

    const canUndo = ref<boolean>(false)
    const canRedo = ref<boolean>(false)

    function setTodo(_todo: ITodo) {
        todo.value = {
            id: _todo.id,
            name: _todo.name,
            list: _todo.list.map(i => (({ index: i.index, text: i.text, checked: i.checked }))),
            date: _todo.date
        }
    }

    function changeName(name: string) {
        const command = new ChangeNameCommand(todo.value, name, todo.value.name)
        history.execute(command)
        changedTodo()
    }

    function addNewItem(item: ITodoItem) {
        const command = new AddTodoItemCommand(todo.value, item)
        history.execute(command)
        changedTodo()
    }

    function changeItemFlag(index: number) {
        const command = new ChangeTodoItemFlagCommand(todo.value, index)
        history.execute(command)
        changedTodo()
    }
    function changeItemText(index: number, oldText: string, newText: string) {
        const command = new ChangeTodoItemTextCommand(todo.value, index, oldText, newText)
        history.execute(command)
        changedTodo()
    }

    function removeItem(index: number, item: ITodoItem) {
        const command = new RemoveTodoItemCommand(todo.value, index, item)
        history.execute(command)
        changedTodo()
    }

    function undo() {
        history.undo()
        changedTodo()
    }

    function redo() {
        history.redo()
        changedTodo()
    }

    function changedTodo() {
        todo.value.date = new Date().getTime()
        callbackChanged?.(todo.value)
        checkStack()
    }

    function checkStack() {
        canUndo.value = history.canUndo()
        canRedo.value = history.canRedo()
    }

    function clearHistory() {
        history.clear()
        checkStack()
    }

    return {
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
    }
}