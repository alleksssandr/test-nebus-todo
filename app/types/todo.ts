export interface ITodo {
    id: string
    name: string
    list: ITodoItem[]
    date: number
}

export interface ITodoItem {
    index: number
    checked: boolean
    text: string
}
