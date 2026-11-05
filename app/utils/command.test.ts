import { describe, it, expect, vi } from 'vitest'
import { CommandHistory, type Command } from '~/utils/command'

const createMockCommand = (name: string) => {
  return {
    name,
    execute: vi.fn(),
    undo: vi.fn(),
  } as unknown as Command
}

describe('CommandHistory', () => {
  it('First test', () => {
    const history = new CommandHistory(50)
    const cmd = createMockCommand('Add')

    history.execute(cmd)

    expect(cmd.execute).toHaveBeenCalledTimes(1)
    expect(history.canUndo()).toBe(true)
    expect(history.canRedo()).toBe(false)
  })

  it('undo и redo', () => {
    const history = new CommandHistory(50)
    const cmd1 = createMockCommand('Add')
    const cmd2 = createMockCommand('Update')

    history.execute(cmd1)
    history.execute(cmd2)

    history.undo()
    expect(cmd2.undo).toHaveBeenCalledTimes(1)
    expect(history.canUndo()).toBe(true)
    expect(history.canRedo()).toBe(true)

    history.redo()
    expect(cmd2.execute).toHaveBeenCalledTimes(2)
    expect(history.canRedo()).toBe(false)
  })

  it('clear redo stack', () => {
    const history = new CommandHistory(50)
    const cmd1 = createMockCommand('Add')
    const cmd2 = createMockCommand('Update')
    const cmd3 = createMockCommand('Delete')

    history.execute(cmd1)
    history.execute(cmd2)
    
    history.undo()
    expect(history.canRedo()).toBe(true)

    history.execute(cmd3)

    expect(history.canRedo()).toBe(false)
  })

  it('limit 50', () => {
    const history = new CommandHistory(50)

    for (let i = 0; i < 60; i++) {
      history.execute(createMockCommand(`Cmd ${i}`))
    }

    let undoCount = 0
    while (history.canUndo()) {
      history.undo()
      undoCount++
    }
    
    expect(undoCount).toBe(50)
  })
})