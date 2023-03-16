<script setup lang="ts">
const emit = defineEmits(['click'])
</script>

<template>
    <div class="flex flex-col items-center gap-3">
        <p class="text-gray-500">
            Ha ocurrido un error.
        </p>
        <Button variant="primary" @click="emit('click')">
            Reintentar
        </Button>
    </div>
</template>