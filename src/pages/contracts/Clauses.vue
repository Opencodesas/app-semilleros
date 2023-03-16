<script setup lang="ts">
import { pick } from 'lodash';
import { required, clause } from '@/utils/validators'
import CommonEditor from '@/components/CommonEditor.vue';
import getClauseLabel from '@/helpers/getClauseLabel'
import useVuelidate from '@vuelidate/core'
import CommonSelect from '@/components/CommonSelect.vue';
import RequestHandleError from '@/components/RequestHandleError.vue';
import RequestHandleLoading from '@/components/RequestHandleLoading.vue';

const { find, findOne, create } = useApiV1()
const route = useRoute()
const router = useRouter()

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
    cap_date: { required },
    clause1: { ...clause },
    clause2: { ...clause },
    clause3: { ...clause },
    clause4: { ...clause },
    clause5: { ...clause },
    clause6: { ...clause },
    clause7: { ...clause },
    clause8: {},
    clause9: { ...clause },
    clause10: { ...clause },
    clause11: { ...clause },
    clause12: { ...clause },
    clause13: { ...clause },
    clause14: { ...clause },
    clause15: { ...clause },
    clause16: { ...clause },
    clause17: { ...clause },
    clause18: { ...clause },
    clause19: { ...clause },
    clause20: { ...clause },
    clause21: { ...clause },
    clause22: { ...clause },
    clause23: { ...clause },
    clause24: { ...clause },
}))

const clausesKeys = computed(() => Object.keys(form).filter((key) => key.includes('clause')))
const v$ = useVuelidate(form_rules, form)

const objects = computedAsync(async () => {
    return await (await getSelect(['objects'])).map(({ label }) => ({ label, value: label }))
}, null)

const contractor = reactive({
    bank: {
        name: ''
    },
    bank_account_type: {
        name: ''
    },
    account_number: ''
})

const baseQueue = async () => await find<{ items: Array<Object> }>('baseClauses').then((response) => {
    Object.assign(form, pick(response.data.items[0], clausesKeys.value))
})

const contractorQueue = async () => await findOne<{ items: Object }>('contractors', route.query.contractor as string).then((response) => {
    Object.assign(contractor, response.data.items)
    console.log('Contratista', response.data.items)
})

const { result } = useAsyncQueue([baseQueue, contractorQueue])

const onSubmit = async () => {
    const valid = await v$.value.$validate()

    if (valid) {
        setLoading(true)

        await create('clausesContracts', formdataParser({
            contractor_id: route.query.contractor,
            ...form
        }))
            .then((response) => {
                console.log(response)
                if (response.status >= 200 && response.status <= 300) {
                    alerts.custom('Completado', 'Las clausulas y fecha CAP se guardaron con éxito.', 'success')
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
        <h2 class="mr-auto text-lg font-medium">Clausulas de Contrato</h2>
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
                <div class="grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2">
                    <template v-for="(clause, index) of clausesKeys">
                        <template v-if="clause == 'clause1'">
                            <div class="col-span-1 md:col-span-2">
                                <CommonSelect :label="getClauseLabel(clause)" :name="clause"
                                    v-model="form[clause as keyof typeof form]" :options="objects" :validator="v$" />
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
                                                        {{ contractor.bank.name }}
                                                    </td>
                                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {{ contractor.bank_account_type.name }}
                                                    </td>
                                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {{ contractor.account_number }}
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
                <div class="pt-5">
                    <CommonInput type="date" label="Fecha CAP" name="cap_date" v-model="form.cap_date"
                        :validator="v$" />
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