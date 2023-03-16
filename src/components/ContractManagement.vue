<script setup lang="ts">
import { ref } from 'vue'
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue'
import CommonEditor from './CommonEditor.vue';
import { required } from '@/utils/validators'
import { useVuelidate } from '@vuelidate/core'
import Button from '@/base-components/Button';
import InputManagement from './InputManagement.vue';
import Lucide from '@/base-components/Lucide';

const isOpen = ref(false)

function closeModal() {
    isOpen.value = false
}
function openModal() {
    isOpen.value = true
}

const props = defineProps<{
    contractor: any
}>()

const form = reactive({
    rejection_message: '',
    status: '',
})

const formRules = computed(() => ({
    status: { required },
    rejection_message: form.status == '4' ? { required } : {}
}))

const v$ = useVuelidate(formRules, form, { $scope: true })

const { create } = useApiV1()
const router = useRouter()

const onSubmit = async () => {
    const valid = await v$.value.$validate()

    if (valid) {
        setLoading(true)

        const fd = formdataParser({
            status: form.status == '1' ? 7 : 4,
            rejection_message: form.rejection_message,
            contractor_id: props.contractor.contract.contractor_id,
        })

        await create('contracts-management', fd)
            .then((response) => {
                if (response.status >= 200 && response.status <= 300) {
                    closeModal()
                    alerts.custom('', `El contrato de ${props.contractor.name} ${props.contractor.lastname} fue gestionado.`, 'info')

                    setTimeout(() => {
                        router.go(0)
                    }, 1000)
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
    <div class="flex justify-end">
        <Button type="button" variant="outline-primary" @click="openModal">
            <Lucide icon="FileCheck" class="mr-2" />
            <span class="text-sm">
                Gestionar
            </span>
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
                            class="w-full max-w-md transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all divide-y divide-slate-200 space-y-2">
                            <!-- <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                                Gestion de Contrato para {{ `${contractor.name} ${contractor.lastname}`
                                }}
                            </DialogTitle> -->
                            <form @submit.prevent="onSubmit" class="pt-2">
                                <InputManagement name="status" v-model="form.status" :validator="v$" />
                                <template v-if="form.status == '4'">
                                    <div class="mt-2 space-y-4">
                                        <div class="intro-x">
                                            <CommonEditor name="rejection_message" label="Nota de Anulación" v-model="form.rejection_message"
                                                :validator="v$" />
                                        </div>
                                    </div>
                                </template>
                                <div class="flex justify-end mt-4 space-x-4">
                                    <Button type="button" variant="soft-secondary" @click="closeModal">
                                        Cancelar
                                    </Button>
                                    <Button type="submit" variant="soft-warning">
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
