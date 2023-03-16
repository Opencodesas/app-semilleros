<script setup lang="ts">
import { addFile } from '@/types/filepond'
import { required, email, identification } from '@/utils/validators'
import CommonBackButton from '@/components/CommonBackButton.vue'
import CommonFile from '@/components/CommonFile.vue'
import CommonFormState from '@/components/CommonFormState.vue'
import useVuelidate from '@vuelidate/core'
import { useFetch } from '@vueuse/core'

const form = reactive({
    birth_date: '',
    department: '',
    address: '',
    email: '',
    name: '',
    lastname: '',
    identification_type: '',
    identification: '',
    municipality: '',
    phone: '',
    validity_periods_id: '',
})

const form_rules = computed(() => ({
    birth_date: { required },
    department: { required },
    address: { required },
    email: { required },
    name: { required },
    lastname: { required },
    identification_type: { required },
    identification: { required, ...identification },
    municipality: { required },
    phone: { required },
    validity_periods_id: { required },
}))

const types = [
    {
        label: 'Tarjeta de identidad',
        value: 'TI'
    },
    {
        label: 'Cédula de ciudadanía',
        value: 'CC'
    },
    {
        label: 'Documento nacional de identidad',
        value: 'DNI'
    },
]

const departments = [
    {
        label: 'Amazonas',
        value: 'Amazonas'
    },
    {
        label: 'Antioquia',
        value: 'Antioquia'
    },
    {
        label: 'Atlántico',
        value: 'Atlántico'
    },
    {
        label: 'Bolivar',
        value: 'Bolivar'
    },
    {
        label: 'Boyaca',
        value: 'Boyaca'
    },
    {
        label: 'Caldas',
        value: 'Caldas'
    },
    {
        label: 'Caqueta',
        value: 'Caqueta'
    },
    {
        label: 'Cauca',
        value: 'Cauca'
    },
    {
        label: 'Cesar',
        value: 'Cesar'
    },
    {
        label: 'Cundinamarca',
        value: 'Cundinamarca'
    },
    {
        label: 'Valle del Cauca',
        value: 'Valle del Cauca'
    },
]

const validity_periods = asyncComputed(async () => {
    return await getSelect(['validity_periods'])
}, null)

const towns = asyncComputed(async () => {
    return await getSelect(['municipalities'])
}, null)

const v$ = useVuelidate(form_rules, form, { $lazy: true, $autoDirty: true })

const router = useRouter()
const route = useRoute()

const onSubmit = async () => {
    const valid = await v$.value.$validate()

    if (valid) {
        await contractorServices.create(formdataParser(form)).then((response) => {
            if (response?.status == 201) {
                alerts.create()
                setLoading(true)

                router.push('index').finally(() => {
                    setLoading(false)
                })
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
        <div class="flex items-center space-x-4">
            <CommonBackButton to="contractor.index" title="Listado" />
            <h2 class="mr-auto text-lg font-medium">Contratista</h2>
        </div>
        <!-- <CommonFormState consecutive="CR1" /> -->
    </div>

    <div class="p-5 mt-5 intro-y box">
        <form @submit.prevent="onSubmit" class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            <CommonSelect label="Periodo vigencia *" name="validity_periods_id" v-model="form.validity_periods_id"
                :validator="v$" :options="validity_periods" />
            <CommonInput type="text" placeholder="Ingrese" label="Nombre *" name="name"
                v-model="form.name" :validator="v$" />
            <CommonInput type="text" placeholder="Ingrese" label="Apellido *" name="lastname"
                v-model="form.lastname" :validator="v$" />
            <CommonSelect label="Tipo documento *" name="identification_type" v-model="form.identification_type"
                :validator="v$" :options="types" />
            <CommonInput type="number" placeholder="Ingrese su número de documento" label="Documento *"
                name="identification" v-model="form.identification" :validator="v$" />
            <CommonInput type="email" placeholder="Ingrese" label="Correo *" name="email" v-model="form.email"
                :validator="v$" />
            <CommonInput type="number" placeholder="Ingrese" label="Celular *" name="phone" v-model="form.phone"
                :validator="v$" />
            <CommonSelect label="Departamento *" name="department" v-model="form.department" :validator="v$"
                :options="departments" />
            <CommonSelect label="Municipios *" name="municipality" v-model="form.municipality" :validator="v$"
                :options="towns" />
            <CommonInput type="text" placeholder="Ingrese" label="Direccion *" name="address" v-model="form.address"
                :validator="v$" />
            <CommonInput type="date" label="Fecha nacimiento *" name="birth_date" v-model="form.birth_date"
                :validator="v$" />
            <div class="flex justify-end col-span-1 md:col-span-2">
                <Button type="submit" variant="primary" class="btn btn-primary">
                    Ingresar
                </Button>
            </div>
        </form>
    </div>
</template>