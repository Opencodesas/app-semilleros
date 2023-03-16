<script setup lang="ts">
import { ref } from 'vue'
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
    RadioGroup,
    RadioGroupOption,
    RadioGroupLabel,
} from '@headlessui/vue'
import CommonEditor from './CommonEditor.vue';
import { required } from '@/utils/validators'
import { useVuelidate } from '@vuelidate/core'
import Button from '@/base-components/Button';
import CommonInput from './CommonInput.vue';

const isOpen = ref(false)

function closeModal() {
    isOpen.value = false
}
function openModal() {
    isOpen.value = true
}

const props = defineProps<{
    contractor: string
}>()

const form = reactive({
    status: '',
    note: '',
    identifier_number: ''
})

const formRules = computed(() => ({
    status: { required },
    note: form.status == '4' ? { required } : {},
    identifier_number: form.status != '4' ? { required } : {}
}))

const v$ = useVuelidate(formRules, form)

const { create } = useApiV1()
const router = useRouter()

const onSubmit = async () => {
    const valid = await v$.value.$validate()

    if (valid) {
        setLoading(true)

        const fd = formdataParser(form)
        fd.append('contractor_id', props.contractor as string)

        await create('contracts-management', fd)
        .then((response) => {
            if (response.status >= 200 && response.status <= 300) {
                alerts.custom('', 'El contrato fue gestionado con éxito!', 'info')

                setTimeout(() => {
                    closeModal()
                    router.go(-1)
                })
            }
        })
        .finally(() => {
            setLoading(false)
        })
    }
    else {
        alerts.validation()
    }
}
</script>

<template>
    <div class="fixed inset-0 flex items-center justify-end">
        <Button type="button" variant="primary" @click="openModal">
            Gestionar
        </Button>
    </div>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" class="relative z-[100]">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black bg-opacity-25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="w-full max-w-md transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <form @submit.prevent="onSubmit">
                                <div class="mt-2 space-y-4">
                                    <RadioGroup v-model="form.status">
                                        <div :class="[
                                            v$['status'].$error ? 'border-danger' : 'border-slate-300',
                                            'grid grid-cols-2 gap-1 p-1 mx-auto border border-dashed rounded-md w-full'
                                        ]">
                                            <RadioGroupOption as="template" :value="4" v-slot="{ active, checked }">
                                                <div
                                                    :class="[checked ? 'bg-danger border-transparent text-white' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50', 'border rounded-md p-2 flex items-center justify-center text-xs font-medium uppercase sm:flex-1 cursor-pointer outline-none']">
                                                    <RadioGroupLabel as="span">
                                                        Rechazado
                                                    </RadioGroupLabel>
                                                </div>
                                            </RadioGroupOption>
                                            <RadioGroupOption as="template" :value="1" v-slot="{ active, checked }">
                                                <div
                                                    :class="[checked ? 'bg-success border-transparent text-white' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50', 'border rounded-md p-2 flex items-center justify-center text-xs font-medium uppercase sm:flex-1 cursor-pointer outline-none']">
                                                    <RadioGroupLabel as="span">
                                                        Aprobado
                                                    </RadioGroupLabel>
                                                </div>
                                            </RadioGroupOption>
                                        </div>
                                        <template v-if="v$['status'].$error">
                                            <div v-for="(error, index) in v$['status'].$errors" :key="index"
                                                class="mt-1 text-xs text-danger">
                                                {{ error.$message }}
                                            </div>
                                        </template>
                                    </RadioGroup>
                                    <template v-if="form.status == '4'">
                                        <div class="intro-x">
                                            <CommonEditor name="note" label="Nota de Rechazo" v-model="form.note"
                                                :validator="v$" />
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="intro-x">
                                            <CommonInput type="number" name="identifier_number" label="Nro. Contrato"
                                                v-model="form.identifier_number" :validator="v$" />
                                        </div>
                                    </template>
                                </div>
                                <div class="flex justify-end mt-4 space-x-4">
                                    <Button type="button" variant="soft-warning" @click="closeModal">
                                        Cancelar
                                    </Button>
                                    <Button type="submit" variant="soft-primary">
                                        Enviar
                                    </Button>
                                </div>
                            </form>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
