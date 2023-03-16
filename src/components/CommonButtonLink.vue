<script setup lang="ts">
import { RouterLinkProps } from 'vue-router';

const router = useRouter()

const props = defineProps<{
    [key:string]: any
}>()
</script>

<template>
    <Button as="router-link" v-bind="$attrs">
        <slot></slot>
    </Button>
</template>