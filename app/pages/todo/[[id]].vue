<script lang="ts" setup>
import Add from '~/assets/icons/add.vue';
import type { ITodoItem } from '~/store/todo';

import { useTodoStore } from '~/store/todo'

const { addTodo } = useTodoStore()

const name = ref<string>('')

const text = ref<string>('')

const items = ref<ITodoItem[]>([])

const handleAdd = () => {
  if (!text.value.length) {
    return
  }

  items.value.push({
    index: items.value.length,
    content: text.value,
    isCompleted: false
  })

  text.value = ''
}

const handleSave = () => {
  addTodo({
    id: crypto.randomUUID(),
    title: name.value,
    list: items.value
  })
}

const isEditNamne = ref<boolean>(true)

</script>

<template>
      <div class="page-edit">

        <div class="page-edit__block page-edit__name">
          <h3>
            Name:
          </h3>
          <UiInput
            placeholder="Enter name"
            v-model="name"
          />
        </div>


        <div class="page-edit__block page-edit__list-wrap">
          <h3>
            List of todo:
          </h3>

          <div v-if="items.length" class="page-edit__list">
            <div
              v-for="(item, index) in items"
              :key="index"
            >
              <UiCheckbox v-model="item.isCompleted" :label="item.content"/>
            </div>
          </div>
  
  
          <div class="page-edit__list-controls">
            <UiInput
              placeholder="Enter todo"
              v-model="text"
            />

            <UiButton @click="handleAdd">
              Add todo item
            </UiButton>
          </div>

        </div>


        <div class="page-edit__block page-edit__actions">
          <!--
            сохранить изменения;
            отменить редактирование (необходимо подтверждение);
            удалить (необходимо подтверждение);
            отменить внесённое изменение (работает как Ctrl+Z);
            повторить отменённое изменение (работает как Shift+Ctrl+Z).
          -->
          <UiButton @click="handleSave">
            Save
          </UiButton>

          <UiButton>
            Cancel changes
          </UiButton>

          <UiButton>
            Delete
          </UiButton>

          <UiButton>
            Undo
          </UiButton>

          <UiButton>
            Redo
          </UiButton>
        </div>
      </div>
</template>

<style lang="scss" scoped>

.page-edit {
  margin: var(--space-main-y) var(--space-main-x);
  display: grid;
  grid-gap: 18px;
  grid-template-areas: "name list" "actions list";

  &__block {
    height: fit-content;
    padding: 20px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
    border-radius: 12px;
  }

  &__name {
    grid-area: name;
  }
  &__list-wrap {
    grid-area: list;

    gap: 12px;
    display: flex;
    flex-direction: column;
  }
  &__actions {
    grid-area: actions;
  }

  &__list {
    gap: 12px;
    display: flex;
    flex-direction: column;
  }

  &__list-controls {
    display: grid;
    grid-gap: 12px;
    grid-template-columns: 3fr 1fr;
  }
}
</style>