<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'

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
}))

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
        <h2 class="mr-auto text-lg font-medium">Creación de Contratista</h2>
        <CommonFormState :consecutive="form.consecutive" />
    </div>

    <div class="p-5 mt-5 intro-y box">
        <form @submit.prevent="onSubmit" class="space-y-8 divide-y divide-slate-200">
            <div class="space-y-8 divide-y divide-slate-200">
                <div>
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                        Información Personal
                    </h3>

                    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <CommonInput type="text" placeholder="John" label="Nombres *" name="name" v-model="form.name"
                            :validator="v$" />
                        <CommonInput type="text" placeholder="Doe" label="Apellidos *" name="lastname"
                            v-model="form.lastname" :validator="v$" />
                        <CommonInput type="date" label="Fecha de Nacimiento *" name="birth_date" :max="_maxBirthDate"
                            v-model="form.birth_date" :validator="v$" />
                        <CommonInput type="email" placeholder="john@email.com" label="Correo *" name="email"
                            v-model="form.email" :validator="v$" />
                        <CommonInput type="number" placeholder="000-000-0000" label="Celular *" name="phone"
                            v-model="form.phone" :validator="v$" />
                        <!--   <CommonInput type="number" placeholder="000-000-0000" label="Numero Compartido" name="number_share"
                                v-model="form.number_share" :validator="v$" /> -->
                        <div class="col-span-1 sm:col-span-2 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                            <CommonSelect label="Departamento *" name="department" v-model="form.department" :validator="v$"
                                :options="departments" />
                            <CommonSelect label="Municipio *" name="municipality" v-model="form.municipality"
                                :validator="v$" :options="cities" />
                            <CommonInput type="text" placeholder="Calle Bolivar" label="Dirección *" name="address"
                                v-model="form.address" :validator="v$" />
                        </div>
                        <CommonSelect label="Tipo documento *" name="identification_type" v-model="form.identification_type"
                            :validator="v$" :options="[{ value: 'CC', label: 'Cédula de Ciudadanía' }]" />
                        <CommonInput type="number" placeholder="00000000000" label="Numero de documento *"
                            name="identification" v-model="form.identification" :validator="v$" />
                    </div>
                </div>
                <div class="pt-8">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                        Información Legal
                    </h3>

                    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <CommonInput type="text" placeholder="Nombre" label="Razón social" name="business_name"
                            v-model="form.business_name" :validator="v$" />
                        <CommonInput type="number" placeholder="000000000" label="Nit" name="nit" v-model="form.nit"
                            :validator="v$" />
                    </div>
                </div>
                <div class="pt-8">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                        Información Contractual
                    </h3>

                    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <CommonInput type="number" placeholder="0.000.000" label="Valor del Contrato *"
                            name="contract_value" v-model="form.contract_value" :validator="v$" />
                        <CommonSelect label="Periodo de Vigencia *" name="validity_periods_id"
                            v-model="form.validity_periods_id" :validator="v$" :options="validity_periods" />
                        <CommonSelect label="Banco *" name="bank" v-model="form.bank" :validator="v$" :options="banks" />
                        <CommonSelect label="Tipo de Cuenta *" name="bank_account_type" v-model="form.bank_account_type"
                            :validator="v$" :options="bank_account_types" />
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