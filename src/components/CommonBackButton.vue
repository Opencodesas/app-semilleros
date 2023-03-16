<script setup lang="ts">
const router = useRouter()

const props = defineProps<{
    to: string
    title: string
}>()
</script>

<template>
    <Button as="router-link"
        :to="((pageName: string | undefined) => { try { return $router.resolve({ name: pageName }).fullPath } catch(err) { return '' } })(to)"
        variant="outline-secondary" class="flex w-24">
        <Lucide icon="ChevronLeft" class="mr-2" /> {{ title }}
    </Button>
</template>