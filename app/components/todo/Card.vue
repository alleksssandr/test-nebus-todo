<script setup lang="ts">
import Delete from '~/assets/icons/delete.vue';
import type { ITodoItem } from '~/store/todo';

const MAX_VISIBLE_ITEMS = 3;

interface IPropsTodoCard {
    id: string
    name: string;
    list: ITodoItem[];
}

const props = defineProps<IPropsTodoCard>();

const visibleItems = computed(() => 
    props.list.slice(0, MAX_VISIBLE_ITEMS)
);

</script>

<template>
    <div class="todo-card">
        <div class="todo-card__content">
            <h3 class="todo-card__title">{{ name }}</h3>
    
            <ul class="todo-card__list">
                <li v-for="(todoItem, index) in visibleItems" :key="`item-${index}`" class="todo-card__list-item">
                    <input type="checkbox" :checked="todoItem.isCompleted" disabled>
    
                    <span>
                        {{ todoItem.content }}
                    </span>
                </li>
            </ul>
        </div>

        <div class="todo-card__actions">
            <UiButton>
                Открыть
            </UiButton>

            <UiButton variant="danger">
                <Delete/>
            </UiButton>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.todo-card {
    min-width: 250px;
    max-width: 500px;
    height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 20px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;

    &__title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        line-height: 1.4;
        color: #1f2937;
        word-break: break-word;
    }

    &__list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
    }

    &__list-item {
        padding: 8px;
        gap: 10px;
        display: flex;
        align-items: center;
        border-radius: 6px;
        word-break: break-word;
    }

    &__actions {
        display: grid;
        grid-gap: 12px;
        grid-template-columns: 1fr 40px;
    }
}
</style>