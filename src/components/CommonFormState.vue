<script setup lang="ts">
import { FormTextarea } from '@/base-components/Form'

defineProps<{
    rejection_message?: string
    status?: string
    consecutive?: string
}>()
</script>

<template>
    <div class="text-left grid grid-cols-1 justify-start divide-y divide-gray-300 md:divide-y-0 md:flex md:divide-x md:divide-gray-300">
        <template v-if="consecutive">
            <div class="flex flex-col pr-2">
                <h2 class="uppercase font-bold">
                    Consecutivo
                </h2>
                <p>
                    {{ consecutive }}
                </p>
            </div>
        </template>
        <template v-if="status">
            <div class="flex flex-col px-2">
                <h2 class="uppercase font-bold">
                    Estado
                </h2>
                <p>
                    {{ status }}
                </p>
            </div>
        </template>
        <template v-if="rejection_message">
            <div class="flex flex-col pl-2">
                <h2 class="uppercase font-bold">
                    Mensaje de Rechazo
                </h2>
                <FormTextarea disabled :value="rejection_message">
                </FormTextarea>
            </div>
        </template>
    </div>
</template>