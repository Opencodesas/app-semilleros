<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import FormSwitch from "@/base-components/Form/FormSwitch";
import { filePondValue } from '@/composables/useFilepondEvents';
import { customVisitServices } from '@/services/psychosocial/customVisitServices';
import { selectOption } from '@/components/CommonSelect.vue';

const { multiple } = useFilepondEvents();

const route = useRoute();

//const router = useRouter(); ya existe

// router.push({ name: 'psychosocial.custom-visit.edit', params: { id: 1 } })
//Quitar datos de prueba
const form = reactive({
    reason: 'Fue rechazado por...',
    month: '1', //Se guarda como posicion
    municipality: '2',
    beneficiary: '2',
    theme: 'Físico',
    agreements: 'Se llegó al acuerdo de...',
    concept: '4',
    swich_guardian_knows: true,
    file: [],
    status: '',
})


const form_rules = computed(() => ({
    month: { required },
    municipality: { required },
    beneficiary: { required },
    theme: { required },
    agreements: { required },
    concept: {},
    swich_guardian_knows: { required },
    file: [],
}))

const beneficiary_data = reactive({
    grade: 'PRIMARIA',
    health_entity: 'NUEVA EPS',
    guardian_name: 'Liliana',
    guardian_lastname: 'Garcia',
    guardian_identification: '1074936855',
})

const months = asyncComputed(async () => {
    return await getSelect(['months'])
}, null)

const cities = asyncComputed(async () => {
    return await getSelect(['municipalities'])
}, null)

const beneficiaries = ref<selectOption[]>([
    {label: 'Pedro', value: '1'},
    {label: 'Juan', value: '2'},
    {label: 'Maria', value: '3'},
    {label: 'Jose', value: '4'},
    {label: 'Luis', value: '5'},
])

//Probar si se cambia el beneficiario cuando se llaman los datos
//ya que se tiene que esperar a que traigan el municipio del form
const municipality_id = computed(() => form.municipality)

// const beneficiaries = asyncComputed(async () => {
//     return municipality_id.value ? await getBeneficiariesByMunicipaly(municipality_id.value) : []
//  }, null)

const dataLoaded = ref(false)
// const disabledComponents = computed(() => {
//     if( form.status == 'REC' ) {
//         return false
//     }else{
//         return true
//     }
//})
//Verificar si se puede hacer con asycComputed
const getData = async () => {
    //console.log(3);
    await customVisitServices.get(route.params.id as string).then((response) => {
        console.log(response?.data.items);
        if (response?.status == 200 || response?.status == 201) {
            form.reason = response.data.items.reason;
            form.month = response.data.items.month;
            form.municipality = response.data.items.municipality;
            form.beneficiary = response.data.items.beneficiary;
            form.theme = response.data.items.theme;
            form.agreements = response.data.items.agreements;
            form.concept = response.data.items.concept;
            form.swich_guardian_knows = response.data.items.swich_guardian_knows;
            form.file = response.data.items.file;
            form.status = response.data.items.status;
            alerts.custom('', response?.data.message, 'info');

        } else {
            alerts.custom("", "No se pudieron obtener los datos", "error");
        }
        console.log(form);
    });
};


onMounted(async () => {
    console.log(route);
    await getData();
    dataLoaded.value = true;
    form.status = `${route.params.status}`
});


//Mirar si hago servicio
// const beneficiary_data = asyncComputed(async () => {
//     return form.beneficiary ? await getBeneficiaryData(form.beneficiary) : null
// }, null)

const v$ = useVuelidate(form_rules, form)

const { isProvider } = useProvider()
const router = useRouter()

const onSubmit = async () => {
    const valid = await v$.value.$validate()
    if (valid) {
        await customVisitServices.update(route.params.id as string, formdataParser(form)).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    alerts.update()
                    setLoading(true)
                    router.push('psychosocial.visits').finally(() => {
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
        <h2 v-if="form.status == 'REC'" class="mr-auto text-lg font-medium">Editar visita personalizada</h2>
        <h2 v-else class="mr-auto text-lg font-medium">Vista visita personalizada</h2>
    </div>

    <div v-if="dataLoaded" class="p-5 pt-1 mt-5 intro-y box">
        <div v-if="form.status == 'REC'">
            <h2 class="text-red-600 font-bold py-2">Razón de rechazo</h2>
            <p class="text-left">{{ form.reason }}</p>
        </div>
        <form @submit.prevent="onSubmit" class="space-y-8 divide-y divide-slate-200">
            <div class="space-y-8 divide-y divide-slate-200 ">
                <div>

                    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                        <CommonSelect :disabled="form.status != 'REC'" label="Mes *" name="month" v-model="form.month"
                            :validator="v$" :options="months" />
                        <CommonSelect :disabled="form.status != 'REC'" label="Municipio *" name="municipality"
                            v-model="form.municipality" :validator="v$" :options="cities" />
                        <CommonSelect :disabled="form.status != 'REC'" label="Beneficiario *" name="beneficiary"
                            v-model="form.beneficiary" :validator="v$" :options="beneficiaries" />
                    </div>
                    <!-- cambiar condicion por "beneficiary_data" cuando haya función para traer los datos -->
                    <div v-if="form.beneficiary">
                        <!-- These inputs don't use the validator since they have data from the DB   cambiar los v-model-->
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

                                <FormSwitch.Input :disabled="form.status != 'REC'" name="swich_plans" id="swich_plans"
                                    type="checkbox" v-model="form.swich_guardian_knows" :validator="v$" />
                                <FormSwitch.Label htmlFor="swich_plans"> ¿El padre o acudiente conoce el proyecto de
                                    Semilleros Deportivos?. </FormSwitch.Label>
                            </div>
                        </div>
                        <div class="col-span-3 sm:grid-cols-3">
                            <CommonTextarea :disabled="form.status != 'REC'"
                                label="Temáticas durante la visita: físico, emocional, familiar, escolar, social, espiritual *" placeholder="Escriba..."
                                name="theme" rows="5" v-model="form.theme" :validator="v$" />

                        </div>
                        <div class="col-span-3 sm:grid-cols-3">
                            <CommonTextarea :disabled="form.status != 'REC'" label="Acuerdos y recomendaciones *" placeholder="Escriba..."
                                name="agreements" rows="5" v-model="form.agreements" :validator="v$" />
                        </div>

                        <div class="grid justify-center col-span-3">
                            <CommonInput :disabled="form.status != 'REC'" type="range"
                                label="Concepto del padre o acudiente que atendió la visita en una escala de 1 a 5 donde 1 es deficiente y 5 excelente"
                                name="concept" min="1" max="5" v-model="form.concept" />
                        </div>
                        <!-- Comprobar qué es lo que se está enviando -->
                        <div class="grid justify-center col-span-3 gap-10 p-5">
                            <h1 class="text-center">Evidencia</h1>
                            <!-- <img :src="form.file[0]" alt=""> -->
                            <img src="/semilleros.png" width="200" alt="">
                        </div>

                        <div class="grid col-span-3">
                            <CommonDropzone v-if="form.status == 'REC'" name="file"
                                label="Suba su archivo aqui para cambiar evidencia *" :accept-multiple="false"
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
                <div v-if="form.status == 'REC'" class="flex justify-center gap-x-4">
                    <Button type="submit" variant="primary">
                        Editar visita
                    </Button>
                </div>
                <div v-else-if="form.status == 'APR'" class="flex justify-center gap-x-4">
                    <Button type="button" variant="dark" @click="() => { router.push({ name: 'psychosocial.visits' }) }">
                        Descargar visita
                    </Button>
                </div>
            </div>
        </form>
    </div>
</template>