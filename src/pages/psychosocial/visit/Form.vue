<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import CommonFile from '@/components/CommonFile.vue'
import FormSwitch from "@/base-components/Form/FormSwitch";
import { filePondValue } from '@/composables/useFilepondEvents';

const { multiple } = useFilepondEvents();

const form = reactive({
    // account_number: '',
    address: '',
    bank_account_type: '',
    bank: '',
    birth_date: '',
    business_name: '',
    consecutive: '',
    contract_value: '',
    department: '',
    email: '',
    identification_type: '',
    identification: '',
    lastname: '',
    municipality: '',
    name: '',
    nit: '',
    // number_share: '',
    phone: '',
    validity_periods_id: '',
    file: []
    
})

const form_rules = computed(() => ({
    // account_number: {required},
    address: {},
    bank_account_type: { required },
    bank: { required },
    birth_date: { required },
    business_name: { required },
    consecutive: {},
    contract_value: { required },
    department: { required },
    email: { required },
    identification_type: { required },
    identification: { required },
    lastname: { required },
    municipality: { required },
    name: { required },
    nit: {},
    // number_share: {},
    phone: { required },
    validity_periods_id: { required },
    file: [{ required }],
}))

const monitorList = [
    { label: "Joselito", value: 1 },
    { label: "Miguelito", value: 2 },
];

const _maxBirthDate = maxBirthDate.value

const departments = asyncComputed(async () => {
    return await getSelect(['departments'])
}, null)

const department_id = computed(() => form.department)

const cities = asyncComputed(async () => {
    return department_id.value ? await getCitiesByDepartment(department_id.value) : []
}, null)

const validity_periods = asyncComputed(async () => {
    return await getSelect(['validity_periods'])
}, null)

const banks = asyncComputed(async () => {
    return await getSelect(['banks'])
}, null)

const bank_account_types = asyncComputed(async () => {
    return await getSelect(['bank_account_types'])
}, null)

const identification_types = asyncComputed(async () => {
    return await getSelect(['identification_types'])
}, null)

const v$ = useVuelidate(form_rules, form)

const { isProvider } = useProvider()
const router = useRouter()

onBeforeMount(async () => {
    await getConsecutive('contractors', 'C').then((response) => form.consecutive = response)
})

const onSubmit = async () => {
    const valid = await v$.value.$validate()

    if (valid) {
        await contractorServices.create(formdataParser(form)).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    alerts.create()
                    setLoading(true)

                    if (isProvider('assistants')) {
                        router.push('').finally(() => {
                            setLoading(false)
                        })
                    }
                    else {
                        router.push('').finally(() => {
                            setLoading(false)
                        })
                    }
                }
            }
        })
    }
    else {
        alerts.validation()
    }
}

</script>

<template>
    <div class="flex items-center justify-between mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Registrar Visita</h2>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <form @submit.prevent="onSubmit" class="space-y-8 divide-y divide-slate-200">
            <div class="space-y-8 divide-y divide-slate-200">
                <div>
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                        Información Personal
                    </h3>

                    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <CommonInput type="date" placeholder="Fecha de Nacimiento*" name="birth_date"
                            v-model="form.birth_date" :validator="v$" />
                        <CommonSelect placeholder="Municipio*" name="municipality" v-model="form.municipality"
                            :validator="v$" :options="cities" />
                        <CommonSelect placeholder="Monitor Deportivo*" name="municipality" v-model="form.municipality"
                            :validator="v$" :options="cities" />
                        <CommonSelect placeholder="Disciplinas*" name="municipality" v-model="form.municipality"
                            :validator="v$" :options="cities" />
                        <CommonInput type="number" placeholder="No. Beneficiarios en el campo *" name="name"
                            v-model="form.name" :validator="v$" />
                        <CommonInput type="text" placeholder="Escenario Deportivo*" name="phone" v-model="form.phone"
                            :validator="v$" />
                        <div class="col-span-2 sm:grid-cols-3">
                            <CommonTextarea placeholder="Objetivo del acompañamiento*" name="phone" v-model="form.phone"
                                :validator="v$" />
                        </div>
                        <div class="p-5 intro-y box col-span-2 sm:grid-cols-3 bg-gray-200 flex flex-col gap-3">
                            <div class="">

                                <FormSwitch.Input name="swich_plans" id="swich_plans" type="checkbox"
                                    v-model="form.swich_plans_r" :validator="v$" />
                                <FormSwitch.Label htmlFor="swich_plans"> Plan de clases </FormSwitch.Label>
                            </div>
                            <div class="">

                                <FormSwitch.Input name="swich_plans" id="swich_plans" type="checkbox"
                                    v-model="form.swich_plans_r" :validator="v$" />
                                <FormSwitch.Label htmlFor="swich_plans"> Plan de clases </FormSwitch.Label>
                            </div>
                            <div class="">

                                <FormSwitch.Input name="swich_plans" id="swich_plans" type="checkbox"
                                    v-model="form.swich_plans_r" :validator="v$" />
                                <FormSwitch.Label htmlFor="swich_plans"> Plan de clases </FormSwitch.Label>
                            </div>
                        </div>
                        <div class="col-span-2 sm:grid-cols-3">
                            <CommonTextarea placeholder="Objetivo del acompañamiento*" name="phone" rows="5"
                                v-model="form.phone" :validator="v$" />
                        </div>
                        <div class="col-span-2 sm:grid-cols-3">
                            <CommonTextarea placeholder="Objetivo del acompañamiento*" name="phone" rows="5"
                                v-model="form.phone" :validator="v$" />
                        </div>

                        <div class="grid col-span-2">
                            <CommonDropzone name="file" label="Suba su archivo aqui *" :accept-multiple="false"
                                v-model="form.file"
                                @addfile="(error: any, value: filePondValue) => { form.file = multiple.addfile({ error, value }, form.file) as never[] }"
                                @removefile="(error: any, value: filePondValue) => { form.file = multiple.removefile({ error, value }, form.file) as never[] }"
                                :validator="v$" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="pt-5">
                <div class="flex justify-end gap-x-4">
                    <Button
                        @click="$router.push({ name: isProvider('assistants') ? 'assistants.contractors' : 'contractors.index' })"
                        type="button" variant="outline-secondary">
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary">
                        Guardar
                    </Button>
                </div>
            </div>
        </form>
    </div>
</template>