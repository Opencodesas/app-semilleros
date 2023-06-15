<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { twMerge } from 'tailwind-merge';

const props = withDefaults(defineProps<{
    modelValue: string,
    disabled?: boolean
}>(), {
    modelValue: '',
    disabled: false
})

const emit = defineEmits(['update:modelValue'])

const computedClass = computed(() =>
    twMerge([
        "disabled:bg-slate-100 disabled:cursor-not-allowed",
        "transition duration-200 ease-in-out w-full min-w-full text-sm border border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 p-2 outline-none h-full max-h-40 overflow-y-auto",
        "prose prose-sm",
    ])
)

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit,
    ],
    editorProps: {
        attributes: {
            class: computedClass.value
        }
    },
    onUpdate: () => {
        emit('update:modelValue', editor.value?.getHTML())
    }
})

const value = computed(() => props.modelValue)

watch(value, () => {
    const isSame = editor.value?.getHTML() === value.value
    
    if (isSame) return
    editor.value?.commands.setContent(value.value, false)
})

onBeforeUnmount(() => {
    editor.value?.destroy()
})
</script>

<template>
    <EditorContent :editor="editor" :disabled="disabled" />
</template>