<script lang="ts" setup>
import CommonInput from './CommonInput.vue'
import Lucide from '@/base-components/Lucide'

// [TypeScript] => Defining Props
interface Props {
    name: string
    source?: string
    label?: string
}

const props = defineProps<Props>()
const router = useRouter()
const route = useRoute()

const sourceOpen = () => {
    let routeData = router.resolve({
        path: '/pdf-viewer',
        query: {
            file: props.source
        }
    })

    window.open(routeData.href, '_blank', 'menubar=no')
}
</script>

<template>
    <div class="input-form">
        <!-- Label -->
        <template v-if="label">
            <span class="flex flex-col w-full sm:flex-row">
                {{ label }}
            </span>
        </template>
        <!-- Component -->
        <div id="name" class="grid grid-cols-1 gap-2 items-start">
            <div v-if="source" class="relative intro-x flex justify-center w-full h-full rounded select-none">
                <div class="absolute z-0 bg-[#f1f0ef] rounded w-full h-full" />
                <div class="grid place-content-center w-full h-full py-4 relative rounded-lg z-10">
                    <Button type="button" @click="sourceOpen" variant="outline-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 256 256">
                            <path fill="currentColor"
                                d="M48 136a8 8 0 0 0 8-8V40h88v48a8 8 0 0 0 8 8h48v32a8 8 0 0 0 16 0V88a7.7 7.7 0 0 0-2.4-5.7l-55.9-56A8.1 8.1 0 0 0 152 24H56a16 16 0 0 0-16 16v88a8 8 0 0 0 8 8Zm112-84.7L188.7 80H160ZM64 160H48a8 8 0 0 0-8 8v48a8 8 0 0 0 16 0v-8h8a24 24 0 0 0 0-48Zm0 32h-8v-16h8a8 8 0 0 1 0 16Zm132-16v12h16a8 8 0 0 1 0 16h-16v12a8 8 0 0 1-16 0v-48a8 8 0 0 1 8-8h28a8 8 0 0 1 0 16Zm-68-16h-14a8 8 0 0 0-8 8v48a8 8 0 0 0 8 8h14a32 32 0 0 0 0-64Zm0 48h-6v-32h6a16 16 0 0 1 0 32Z" />
                        </svg>
                    </Button>
                </div>
            </div>
            <div class="flex flex-row gap-2 justify-center items-center">
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>