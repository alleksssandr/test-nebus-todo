import type { ITodo, ITodoItem } from "~/types/todo";
import type { Command } from './command'

export class ChangeNameCommand implements Command {
    todo: ITodo;

    oldName: string;
    newName: string;

    constructor(todo: ITodo, newName: string, oldName: string) {
        this.todo = todo

        this.oldName = oldName
        this.newName = newName
    }

    execute(): void {
        this.todo.name = this.newName
    }

    undo(): void {
        this.todo.name = this.oldName
    }
}

export class AddTodoItemCommand implements Command {
    todo: ITodo;
    todoItem: ITodoItem;

    constructor(todo: ITodo, todoItem: ITodoItem) {
        this.todo = todo
        this.todoItem = todoItem
    }

    execute(): void {
        this.todo.list.push(this.todoItem)
    }

    undo(): void {
        const index = this.todo.list.findIndex(item => item.index === this.todoItem.index)
        if (index !== -1) {
            this.todo.list.splice(index, 1)
        }
    }
}

export class ChangeTodoItemFlagCommand implements Command {
    todo: ITodo;
    index: number

    constructor(todo: ITodo, index: number) {
        this.todo = todo
        this.index = index
    }

    revertFlag(): void {
        const item = this.todo.list.find(item => item.index === this.index)
        if (item) {
            item.checked = !item.checked
        }
    }

    execute(): void {
        this.revertFlag()
    }

    undo(): void {
        this.revertFlag()
    }
}

export class ChangeTodoItemTextCommand implements Command {
    todo: ITodo;

    index: number
    oldText: string;
    newText: string;

    constructor(todo: ITodo, index: number, oldText: string, newText: string) {
        this.todo = todo

        this.index = index
        this.oldText = oldText
        this.newText = newText
    }

    execute(): void {
        const item = this.todo.list.find(item => item.index === this.index)
        if (item) {
            item.text = this.newText
        }
    }

    undo(): void {
        const item = this.todo.list.find(item => item.index === this.index)
        if (item) {
            item.text = this.oldText
        }
    }
}


export class RemoveTodoItemCommand implements Command {
    todo: ITodo;

    index: number
    todoItem: ITodoItem;

    constructor(todo: ITodo, index: number, todoItem: ITodoItem) {
        this.todo = todo

        this.index = index
        this.todoItem = todoItem
    }

    execute(): void {
        this.todo.list.splice(this.index, 1);
    }

    undo(): void {
        this.todo.list.splice(this.index, 0, this.todoItem);
    }
}