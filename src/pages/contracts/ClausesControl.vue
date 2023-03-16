<script setup lang="ts">
import { pick } from 'lodash';
import { required, clause } from '@/utils/validators'
import CommonEditor from '@/components/CommonEditor.vue';
import getClauseLabel from '@/helpers/getClauseLabel'
import useVuelidate from '@vuelidate/core'
import CommonSelect from '@/components/CommonSelect.vue';
import RequestHandleError from '@/components/RequestHandleError.vue';
import RequestHandleLoading from '@/components/RequestHandleLoading.vue';
import { ClausesTypes } from '@/types/clausesTypes';

const { findOne, create } = useApiV1()
const route = useRoute()
const router = useRouter()

const objects = computedAsync(async () => {
    return await (await getSelect(['objects'])).map(({ label }) => ({ label, value: label }))
}, null)

const rejections = ref()
const rejectedClauses = reactive<string[]>([])
const rejectNote = ref()

const existsInRejections = (name: string) => {
    if (rejectedClauses.length) {
        return rejectedClauses.some((rejected) => rejected == name)
    }
    else {
        return false
    }
}

const form = reactive({
    cap_date: '',
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
})

const form_rules = computed(() => ({
    cap_date: rejections.value && rejections.value.some((rejection: string) => rejection === 'cd') ? { required } : {},
    clause1: existsInRejections('clause1') ? { ...clause } : {},
    clause2: existsInRejections('clause2') ? { ...clause } : {},
    clause3: existsInRejections('clause3') ? { ...clause } : {},
    clause4: existsInRejections('clause4') ? { ...clause } : {},
    clause5: existsInRejections('clause5') ? { ...clause } : {},
    clause6: existsInRejections('clause6') ? { ...clause } : {},
    clause7: existsInRejections('clause7') ? { ...clause } : {},
    clause8: existsInRejections('clause8') ? { ...clause } : {},
    clause9: existsInRejections('clause9') ? { ...clause } : {},
    clause10: existsInRejections('clause10') ? { ...clause } : {},
    clause11: existsInRejections('clause11') ? { ...clause } : {},
    clause12: existsInRejections('clause12') ? { ...clause } : {},
    clause13: existsInRejections('clause13') ? { ...clause } : {},
    clause14: existsInRejections('clause14') ? { ...clause } : {},
    clause15: existsInRejections('clause15') ? { ...clause } : {},
    clause16: existsInRejections('clause16') ? { ...clause } : {},
    clause17: existsInRejections('clause17') ? { ...clause } : {},
    clause18: existsInRejections('clause18') ? { ...clause } : {},
    clause19: existsInRejections('clause19') ? { ...clause } : {},
    clause20: existsInRejections('clause20') ? { ...clause } : {},
    clause21: existsInRejections('clause21') ? { ...clause } : {},
    clause22: existsInRejections('clause22') ? { ...clause } : {},
    clause23: existsInRejections('clause23') ? { ...clause } : {},
    clause24: existsInRejections('clause24') ? { ...clause } : {},
}))

const clausesQueue = () => findOne<{ items: { clauses: ClausesTypes, contract: any } }>('clausesContracts/findByContractor', route.query.contractor as string).then((response) => {
    let clauses = response.data.items.clauses
    let contract = response.data.items.contract

    rejections.value = contract.rejections.split(',')
    rejectNote.value = contract.rejection_message

    const clauseKeys = Object.keys(clauses).filter((key) => key.includes('clause'))

    clauseKeys.map((key) => {
        rejections.value.map((rejection: string) => {
            const record = key.includes(rejection)

            if (record) {
                rejectedClauses.push(key)
            }
        })
    })

    rejectedClauses.forEach(rejectedClause => {
        form[rejectedClause as keyof typeof form] = clauses[rejectedClause as keyof typeof clauses] as string
    })

    if (rejections.value.some((rejection: string) => rejection === 'cd')) {
        form.cap_date = contract.cap_date
    }
})

const contractorQueue = async () => await findOne<{ items: any }>('contractors', route.query.contractor as string).then((response) => {
    return response.data.items
})

const v$ = useVuelidate(form_rules, form)

const { result } = useAsyncQueue([clausesQueue, contractorQueue])

const onSubmit = async () => {
    const valid = await v$.value.$validate()

    if (valid) {
        setLoading(true)

        const fd = formdataParser({
            ...pick(form, rejectedClauses),
        })

        if (rejections.value.some((rejection: string) => rejection === 'cd')) {
            fd.append('cap_date', form.cap_date)
        }

        fd.append('contractor_id', route.query.contractor as string)

        await create('clauses-control', fd)
            .then((response) => {
                console.log(response)
                if (response.status >= 200 && response.status <= 300) {
                    alerts.custom('Completado', 'EL contrato se actualizo con éxito.', 'success')
                    setTimeout(() => {
                        router.go(-1)
                    }, 1000);
                }
            })
            .finally(() => setLoading(false))
    }
    else {
        alerts.validation()
    }
}
</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Control de Clausulas</h2>
    </div>
    <div class="p-5 mt-5 intro-y box">
        <template v-if="result[0].state == 'pending'">
            <RequestHandleLoading />
        </template>
        <template v-else-if="result[0].state == 'rejected'">
            <RequestHandleError @click="$router.go(0)" />
        </template>
        <template v-else-if="result[0].state == 'fulfilled'">
            <form @submit.prevent="onSubmit" class="space-y-8 divide-y divide-slate-200">
                <div>
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                        Clausulas Rechazadas
                    </h3>
                    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2">
                        <template v-for="(clause, index) of rejectedClauses">
                            <template v-if="clause == 'clause1'">
                                <div class="col-span-1 md:col-span-2">
                                    <CommonSelect :label="getClauseLabel(clause)" :name="clause"
                                        v-model="form[clause as keyof typeof form]" :options="objects"
                                        :validator="v$" />
                                </div>
                            </template>
                            <template v-else-if="clause == 'clause8' && result[1].state == 'fulfilled'">
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
                                                            {{ result[1].data.bank.name }}
                                                        </td>
                                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {{ result[1].data.bank_account_type.name }}
                                                        </td>
                                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {{ result[1].data.account_number }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <CommonEditor :label="getClauseLabel(clause)" :name="clause"
                                    v-model="form[clause as keyof typeof form]" :validator="v$" />
                            </template>
                        </template>
                    </div>
                </div>
                <div class="pt-8">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                        Otros Rechazos
                    </h3>
                    <div class="mt-6 grid grid-cols-1">
                        <template v-if="rejections.some((rejection: string) => rejection === 'cd')">
                            <CommonInput type="date" label="Fecha CAP" name="cap_date" v-model="form.cap_date"
                                :validator="v$" />
                        </template>
                    </div>
                </div>
                <div class="pt-8">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                        Nota de Rechazo
                    </h3>
                    <div class="mt-6 grid grid-cols-1">
                        <div class="bg-slate-100 w-full text-sm border border-slate-200 p-2 shadow-sm rounded-md h-auto overflow-y-auto"
                            v-html="rejectNote" />
                    </div>
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