<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import FormSwitch from "@/base-components/Form/FormSwitch";
import { filePondValue } from '@/composables/useFilepondEvents';
import { customVisitServices } from '@/services/psychosocial/customVisitServices';
import { Tooltip } from 'chart.js';


const { multiple } = useFilepondEvents();

const form = reactive({
    month: '',
    municipality: '',
    beneficiary: '',
    theme: '',
    agreements: '',
    concept: '1',
    swich_guardian_knows: false,
    file: [],
    status: 'ENR',

})


const form_rules = computed(() => ({
    month: { required },
    municipality: { required },
    beneficiary: { required },
    theme: { required },
    agreements: { required },
    concept: {},
    swich_guardian_knows: { required },
    file: [{ required }],
}))

const beneficiary_data = reactive({
    grade: '',
    health_entity: '',
    guardian_name: '',
    guardian_lastname: '',
    guardian_identification: '',
})


const months = asyncComputed(async () => {
    return await getSelect(['months'])
}, null)

const cities = asyncComputed(async () => {
    return await getSelect(['municipalities'])
}, null)

const municipality_id = computed(() => form.municipality)

// const beneficiaries = asyncComputed(async () => {
//     return municipality_id.value ? await getBeneficiariesByMunicipaly(municipality_id.value) : []
//  }, null)

// const beneficiary_data = asyncComputed(async () => {
//     return form.beneficiary ? await getBeneficiaryData(form.beneficiary) : null
// }, null)
//      |
//    grade: '',
//     health_entity: '',
//     guardian_name: '',
//     guardian_lastname: '',
//     guardian_identification: '',
//     

const v$ = useVuelidate(form_rules, form)

const { isProvider } = useProvider()
const router = useRouter()

const onSubmit = async () => {
    const valid = await v$.value.$validate()

    if (valid) {
        await customVisitServices.create(formdataParser(form)).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    alerts.create()
                    setLoading(true)

                    router.push('/dashboard').finally(() => {
                        setLoading(false)
                    })
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
        <h2 class="mr-auto text-lg font-medium">Registrar visita personalizada</h2>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <form @submit.prevent="onSubmit" class="space-y-8 divide-y divide-slate-200">
            <div class="space-y-8 divide-y divide-slate-200">
                <div>
                    <div class="mt-0 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3 ">
                        <CommonSelect label="Mes *" name="month" v-model="form.month" :validator="v$"
                            :options="months" />
                        <CommonSelect label="Municipio *" name="municipality" v-model="form.municipality"
                            :validator="v$" :options="cities" />
                        <CommonSelect label="Beneficiario *" name="beneficiary" v-model="form.beneficiary"
                            :validator="v$" :options="cities" />
                    </div>
                    <!-- cambiar condicion por "beneficiary_data" cuando haya función para traer los datos -->
                    <div v-if="form.beneficiary">
                        <!-- These inputs don't use the validator since they have data from the DB  -->
                        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <CommonInput disabled type="text" label="Grado de escolaridad" name="grade"
                                v-model="beneficiary_data.grade" />
                            <CommonInput disabled type="text" label="Entidad de salud" name="health_entity"
                                v-model="beneficiary_data.health_entity" />
                        </div>

                        <div class="mt-6 grid grid-cols-2 gap-y-6 gap-x-4 sm:grid-cols-3">
                            <CommonInput disabled type="text" label="Nombre del padre o acudiente" name="guardian.name"
                                v-model="beneficiary_data.guardian_name" />
                            <CommonInput disabled type="text" label="Apellido del padre o acudiente"
                                name="guardian.lastname" v-model="beneficiary_data.guardian_lastname" />
                            <CommonInput disabled type="text" label="Documento de identificación"
                                name="guardian.identification" v-model="beneficiary_data.guardian_identification" />
                        </div>
                    </div>
                    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                        <div class="p-5 intro-y box col-span-3 sm:grid-cols-3 bg-gray-200 flex flex-col gap-3">
                            <div class="">

                                <FormSwitch.Input name="swich_plans" id="swich_plans" type="checkbox"
                                    v-model="form.swich_guardian_knows" :validator="v$" />
                                <FormSwitch.Label htmlFor="swich_plans"> ¿El padre o acudiente conoce el proyecto de
                                    Semilleros Deportivos?. </FormSwitch.Label>
                            </div>
                        </div>
                        <div class="col-span-3 sm:grid-cols-3">
                            <CommonTextarea
                                label="Temáticas durante la visita: físico, emocional, familiar, escolar, social, espiritual *" placeholder="Escriba..."
                                name="theme" rows="5" v-model="form.theme" :validator="v$" />

                        </div>
                        <div class="col-span-3 sm:grid-cols-3">
                            <CommonTextarea label="Acuerdos y recomendaciones *" placeholder="Escriba..." name="agreements" rows="5"
                                v-model="form.agreements" :validator="v$" />
                        </div>

                        <div class="grid justify-center col-span-3">
                            <CommonInput type="range"
                                label="Concepto del padre o acudiente que atendió la visita en una escala de 1 a 5 donde 1 es deficiente y 5 excelente"
                                name="concept" min="1" max="5" class="focus:outline-none" v-model="form.concept" />

                        </div>


                        <div class="grid col-span-3">
                            <CommonDropzone name="file" label="Suba su archivo aqui *" :accept-multiple="false"
                                v-model="form.file"
                                @addfile="(error: any, value: filePondValue) => { form.file = multiple.addfile({ error, value }, form.file) as never[] }"
                                @removefile="(error: any, value: filePondValue) => { form.file = multiple.removefile({ error, value }, form.file) as never[] }"
                                :validator="v$" />
                        </div>
                        <!-- <div>
                                                        <CommonFile label="Documento 1" name="file"/>
                                                    </div> -->
                    </div>
                </div>
            </div>
            <div class="pt-5">
                <div class="flex justify-center gap-x-4">
                    <Button type="submit" variant="dark">
                        Registrar
                    </Button>
                </div>
            </div>
        </form>
    </div>
</template>