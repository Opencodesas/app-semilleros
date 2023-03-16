<script setup lang="ts">
import { ClausesTypes } from '@/types/clausesTypes';
import { required } from '@/utils/validators'
import getClauseLabel from '@/helpers/getClauseLabel'
import RequestHandleLoading from '@/components/RequestHandleLoading.vue';
import RequestHandleError from '@/components/RequestHandleError.vue';
import useVuelidate from '@vuelidate/core';
import CommonTextarea from '@/components/CommonTextarea.vue';
import InputManagement from '@/components/InputManagement.vue';
import Lucide from '@/base-components/Lucide';
import Tippy from '@/base-components/Tippy';

const route = useRoute()
const router = useRouter()
const { findOne, create } = useApiV1()

const form = reactive({
    clause1: '',
    clause2: '',
    clause3: '',
    clause4: '',
    clause5: '',
    clause6: '',
    clause7: '',
    clause8: '',
    clause9: '',
    clause10: '',
    clause11: '',
    clause12: '',
    clause13: '',
    clause14: '',
    clause15: '',
    clause16: '',
    clause17: '',
    clause18: '',
    clause19: '',
    clause20: '',
    clause21: '',
    clause22: '',
    clause23: '',
    clause24: '',
    cap_date: '',
    rejection_message: '',
    identifier_number: '',
})

const status = computed(() => (Object.values(form).some((value) => value == '4') ? 4 : 1))

const formRules = computed(() => ({
    clause1: { required },
    clause2: { required },
    clause3: { required },
    clause4: { required },
    clause5: { required },
    clause6: { required },
    clause7: { required },
    clause8: { required },
    clause9: { required },
    clause10: { required },
    clause11: { required },
    clause12: { required },
    clause13: { required },
    clause14: { required },
    clause15: { required },
    clause16: { required },
    clause17: { required },
    clause18: { required },
    clause19: { required },
    clause20: { required },
    clause21: { required },
    clause22: { required },
    clause23: { required },
    clause24: { required },
    cap_date: { required },
    rejection_message: status.value == 4 ? { required } : {},
    identifier_number: status.value != 4 ? { required } : {}
}))

const rejections = computed(() => {
    const keys = Object.keys(form)
    let data: Array<string> = []

    keys.map((key) => {
        if (form[key as keyof typeof form] == '4') {
            if (key.includes('clause')) {
                data.push(`${key.split('clause')[1]}`)
            }
            else if (key.includes('cap_date')) {
                data.push('cd')
            }
        }
    })
    
    return data
})

const rejecteds = computed(() => {
    const keys = Object.keys(form)
    let data: Array<string> = []

    keys.map((key) => {
        if (form[key as keyof typeof form] == '4') {
            if (key.includes('clause')) {
                data.push(`C${key.split('clause')[1]}`)
            }
            else if (key.includes('cap_date')) {
                data.push('Fecha CAP')
            }
        }
    })

    return data.filter(Boolean).join(' - ')
})

const v$ = useVuelidate(formRules, form)

const baseQueue = async () => await findOne<{ items: { clauses: ClausesTypes, contract: Object } }>('clausesContracts/findByContractor', route.query.contractor as string)
    .then((response) => response.data.items)

const clausesKeys = computed(() => Object.keys(form).filter((key) => key.includes('clause')))

const contractorQueue = async () => await findOne<{ items: { bank: { name: string }, bank_account_type: { name: string }, account_number: string, contract: { cap_date: string } } }>('contractors', route.query.contractor as string).then((response) => {
    console.log('Contratista', response.data.items)
    return response.data.items
})

const { result } = useAsyncQueue([baseQueue, contractorQueue])

const clauses = computed(() => {
    return result[0].data?.clauses
})

const onSubmit = async () => {
    const valid = await v$.value.$validate()

    if (valid) {
        setLoading(true)

        const fd = formdataParser({
            status: status.value,
            contractor_id: route.query.contractor,
            rejections: rejections.value,
            rejection_message: `${form.rejection_message} <br><br> Se rechazo: ${rejecteds.value}`,
            identifier_number: form.identifier_number
        })

        await create('contracts-management', fd)
            .then((response) => {
                if (response.status >= 200 && response.status <= 300) {
                    alerts.custom('Completado', 'La gestión de clausulas fue exitosa!', 'success')

                    setTimeout(() => {
                        router.go(-1)
                    }, 1000);
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
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Clausulas de Contrato</h2>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <template v-if="result[0].state == 'pending'">
            <RequestHandleLoading />
        </template>
        <template v-else-if="result[0].state == 'rejected'">
            <RequestHandleError @click="$router.go(0)" />
        </template>
        <template v-else-if="clauses != null">
            <form @submit.prevent="onSubmit" class="space-y-8 divide-y divide-slate-200">
                <div class="grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2">
                    <template v-for="(clause, index) of clausesKeys">
                        <div class="flex flex-col gap-2">
                            <template v-if="clause == 'clause8'">
                                <template v-if="result[0].state == 'fulfilled'">
                                    <div>
                                        <FormLabel class="flex flex-col w-full sm:flex-row">
                                            {{ getClauseLabel(clause) }}
                                        </FormLabel>
                                        <div
                                            class="bg-slate-100 w-full inline-block min-w-full align-middle text-sm border border-slate-200 shadow-sm rounded-md h-auto overflow-y-auto">
                                            <div class="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                                                <table class="min-w-full divide-y divide-gray-300">
                                                    <thead class="bg-gray-50">
                                                        <tr>
                                                            <th scope="col"
                                                                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                                                                Banco</th>
                                                            <th scope="col"
                                                                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                Tipo de cuenta</th>
                                                            <th scope="col"
                                                                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                Cuenta</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="divide-y divide-gray-200 bg-white">
                                                        <tr>
                                                            <td
                                                                class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                                                {{ result[1].data?.bank.name }}
                                                            </td>
                                                            <td
                                                                class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                {{ result[1].data?.bank_account_type.name }}
                                                            </td>
                                                            <td
                                                                class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                {{ result[1].data?.account_number }}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </template>
                            <template v-else>
                                <div>
                                    <FormLabel class="flex flex-col w-full sm:flex-row">
                                        {{ getClauseLabel(clause) }}
                                    </FormLabel>
                                    <div class="bg-slate-50 w-full text-sm border border-slate-200 p-2 shadow-sm rounded-md h-40 overflow-y-auto"
                                        v-html="((clauses as ClausesTypes)[clause as keyof ClausesTypes] as string)" />
                                </div>
                            </template>
                            <InputManagement :name="clause" :validator="v$"
                                v-model="(form)[clause as keyof typeof form]" />
                        </div>
                    </template>
                    <div class="flex flex-col gap-2">
                        <div>
                            <FormLabel class="flex flex-col w-full sm:flex-row">
                                Fecha CAP
                            </FormLabel>
                            <div class="bg-slate-50 w-full text-sm border border-slate-200 p-2 shadow-sm rounded-md h-auto overflow-y-auto"
                                v-html="result[0].state == 'fulfilled' ? result[1].data?.contract.cap_date : ''" />
                        </div>
                        <InputManagement name="cap_date" :validator="v$" v-model="form['cap_date']" />
                    </div>
                </div>
                <div class="pt-5">
                    <template v-if="rejecteds.length">
                        <div class="intro-x">
                            <CommonTextarea name="rejection_message" label="Nota de rechazo"
                                v-model="form.rejection_message" :validator="v$" />
                            <div class="mt-2 flex items-center gap-2">
                                <div>
                                    <Tippy :content="'Esto se agregara al final de la nota de rechazo'">
                                        <Lucide icon="Info" />
                                    </Tippy>
                                </div>
                                <span>
                                    Se rechazo: {{ rejecteds }}
                                </span>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="intro-x">
                            <CommonInput type="number" name="identifier_number" label="Nro. Contrato"
                                v-model="form.identifier_number" :validator="v$" />
                        </div>
                    </template>
                </div>
                <div class="pt-5">
                    <div class="flex justify-end gap-x-4">
                        <Button @click="$router.go(-1)" type="button" variant="outline-secondary">
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary">
                            Guardar
                        </Button>
                    </div>
                </div>
            </form>
        </template>
    </div>
</template>