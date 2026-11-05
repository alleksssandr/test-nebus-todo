import type { ITodo, ITodoItem } from '~/store/todo'


export function useTodoHistory(_todo: ITodo) {

    const todo = ref<ITodo>(_todo)

    const history = new CommandHistory(50)

    const canUndo = ref<boolean>(false)
    const canRedo = ref<boolean>(false)

    function setTodo(_todo: ITodo) {
        todo.value = {
            id: _todo.id,
            name: _todo.name,
            list: _todo.list.map(i => (({ index: i.index, content: i.content, isCompleted: i.isCompleted })))
        }
    }

    function changeName(name: string) {
        const command = new ChangeNameCommand(todo.value, name, todo.value.name)
        history.execute(command)
        checkStack()
    }

    function addNewItem(item: ITodoItem) {
        const command = new AddTodoItemCommand(todo.value, item)
        history.execute(command)
        checkStack()
    }

    function changeItemFlag(index: number) {
        const command = new ChangeTodoItemFlagCommand(todo.value, index)
        history.execute(command)
        checkStack()
    }
    function changeItemText(index: number, oldText: string, newText: string) {
        const command = new ChangeTodoItemTextCommand(todo.value, index, oldText, newText)
        history.execute(command)
        checkStack()
    }

    function removeItem(index: number, item: ITodoItem) {
        const command = new RemoveTodoItemCommand(todo.value, index, item)
        history.execute(command)
        checkStack()
    }

    function undo() {
        history.undo()
        checkStack()
    }

    function redo() {
        history.redo()
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