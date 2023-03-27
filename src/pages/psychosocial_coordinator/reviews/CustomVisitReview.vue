<script setup lang="ts">
import FormSwitch from "@/base-components/Form/FormSwitch";
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import { customVisitServices } from '@/services/psychosocial/customVisitServices';
import { selectOption } from '@/components/CommonSelect.vue';
import { filePondValue } from '@/composables/useFilepondEvents';

const { multiple } = useFilepondEvents();

const route = useRoute();

//Usar para verificar
const { isProvider } = useProvider()

const props = defineProps<{
    id: string | number
}>()

//Quitar datos de prueba
const form = reactive({
    reason: 'Fue rechazado por...',
    month: '1',
    municipality: '2',
    beneficiary: '2',
    theme: 'Físico',
    agreements: 'Se llegó al acuerdo de...',
    concept: '4',
    guardian_knows_semilleros: true,
    file: [],
    status: '',
    createdBy: { id: '', name: 'Gabriel' }, //Revisar si recibe un objeto
})


const form_rules = computed(() => ({
    reason: { required },
    status: { required },

}))

const statusesList = ref<selectOption[]>([
    { label: 'Aprobado', value: '1' },
    { label: 'Rechazado', value: '4' }
])

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
    { label: 'Pedro', value: '1' },
    { label: 'Juan', value: '2' },
    { label: 'Maria', value: '3' },
    { label: 'Jose', value: '4' },
    { label: 'Luis', value: '5' },
])
// Lo de arriba sale de esta funcion
// const beneficiary_data = asyncComputed(async () => {
//     return form.beneficiary ? await getBeneficiaryData(form.beneficiary) : null
// }, null) 

//Probar si se cambia el beneficiario cuando se llaman los datos
//ya que se tiene que esperar a que traigan el municipio del form
const municipality_id = computed(() => form.municipality)

// const beneficiaries = asyncComputed(async () => {
//     return municipality_id.value ? await getBeneficiariesByMunicipaly(municipality_id.value) : []
//  }, null)

const dataLoaded = ref(false)
//Verificar si se puede hacer con asycComputed
const getData = async () => {

    await customVisitServices.get(props.id as string).then((response) => {
        console.log(response?.data.items);
        if (response?.status == 200 || response?.status == 201) {
            form.reason = response.data.items.reason;
            form.month = response.data.items.month;
            form.municipality = response.data.items.municipality;
            form.beneficiary = response.data.items.beneficiary;
            form.theme = response.data.items.theme;
            form.agreements = response.data.items.agreements;
            form.concept = response.data.items.concept;
            form.guardian_knows_semilleros = response.data.items.guardian_knows_semilleros;
            form.file = response.data.items.file;
            //form.status = response.data.items.status; //Revisar si es necesario traerlo
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
});


//Mirar si hago servicio
// const beneficiary_data = asyncComputed(async () => {
//     return form.beneficiary ? await getBeneficiaryData(form.beneficiary) : null
// }, null)

const v$ = useVuelidate(form_rules, form)

const router = useRouter()

const onSubmit = async () => {
    const valid = await v$.value.$validate()
    if (valid) {
        await customVisitServices.update(route.params.id as string, formdataParser(form)).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    alerts.update()
                    setLoading(true)
                    router.push('psychosocial-coordinator.reviews').finally(() => {
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
const positionRange = computed(() => {
    const positionTooltip = (parseInt(form.concept) - 1) / (4);
    return `calc(${positionTooltip * 100}% - ${(2 * (parseInt(form.concept) - 1) ** 2) / 5 + 2 * (parseInt(form.concept) - 1)}px)`;
});

//Manejo de reason para no guardarla si el user selecciona rechazado y pone reason y despues pone aprobado.
const defineReason = () =>{
    if(form.status == '1') form.reason = '';
}
</script>

<template>
    <div class="flex items-center justify-between mt-5 mb-2 intro-y">
        <h1 class="mr-auto text-lg font-medium">Revisar visitas personalizadas de los Psicologos</h1>
    </div>

    <div class="space-y-2 box px-5 py-4">
        <h2 class="font-bold">Revisión</h2>
        <CommonSelect @select="defineReason" label="Estado de la tarea *" name="status" v-model="form.status" :validator="v$"
            :options="statusesList" />
        <div v-if="form.status == '4'" class="pt-4">
            <CommonTextarea name="reason" class="" label="Comentario *" placeholder="Escriba..." rows="5"
                v-model="form.reason"  :validator="v$"/>
        </div>
    </div>

    <div v-if="dataLoaded" class="p-5 pt-1 mt-5 intro-y box">
        <div class="my-4">
            <h3><span class="font-bold">Psicologo:</span> {{ form.createdBy.name }}</h3>
        </div>
        <form @submit.prevent="onSubmit" class="space-y-8 divide-y divide-slate-200">
            <div class="space-y-8 divide-y divide-slate-200 ">
                <div>

                    <div class="mt-3 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                        <CommonSelect disabled label="Mes *" name="month" v-model="form.month" :options="months" />
                        <CommonSelect disabled label="Municipio *" name="municipality" v-model="form.municipality"
                            :options="cities" />
                        <CommonSelect disabled label="Beneficiario *" name="beneficiary" v-model="form.beneficiary"
                            :options="beneficiaries" />
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

                                <FormSwitch.Input disabled name="swich_plans" id="swich_plans" type="checkbox"
                                    v-model="form.guardian_knows_semilleros" />
                                <FormSwitch.Label htmlFor="swich_plans"> ¿El padre o acudiente conoce el proyecto de
                                    Semilleros Deportivos?. </FormSwitch.Label>
                            </div>
                        </div>
                        <div class="col-span-3 sm:grid-cols-3">
                            <CommonTextarea disabled
                                label="Temáticas durante la visita: físico, emocional, familiar, escolar, social, espiritual *"
                                placeholder="Escriba..." name="theme" rows="5" v-model="form.theme" />

                        </div>
                        <div class="col-span-3 sm:grid-cols-3">
                            <CommonTextarea disabled label="Acuerdos y recomendaciones *" placeholder="Escriba..."
                                name="agreements" rows="5" v-model="form.agreements" />
                        </div>

                        <div class="grid col-span-3 justify-center">
                            <label for="range" class="text-xs">Concepto del padre o acudiente que atendió la visita en una
                                escala de 1 a 5 donde 1 es deficiente y 5 excelente:
                            </label>
                            <div id="range" class="relative mb-5">
                                <input disabled class="w-full accent-primary" type="range" min="1" max="5"
                                    v-model="form.concept" />
                                <div :style="{ left: positionRange }"
                                    class="absolute -translate-x-1/4 border-zinc-500 border-2 p-2  rounded-full bg-primary text-white select-none">
                                    {{ form.concept }}
                                </div>
                            </div>
                        </div>
                        <!-- Comprobar qué es lo que se está enviando -->
                        <div class="grid justify-center col-span-3 gap-10 p-5">
                            <h1 class="text-center font-bold">Evidencia</h1>
                            <!-- <img :src="form.file[0]" alt=""> -->
                            <img src="/semilleros.png" width="200" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-right space-x-3 mx-5 pt-5">
                <Button type="button" variant="dark" class="w-24"
                    @click="() => { router.push({ name: 'psychosocial-coordinator.reviews' }) }">
                    Cancelar
                </Button>
                <Button type="submit" variant="primary" class="w-24">
                    Revisar
                </Button>
            </div>
        </form>
    </div>
</template>