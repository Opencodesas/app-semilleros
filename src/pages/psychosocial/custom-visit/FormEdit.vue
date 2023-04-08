<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import FormSwitch from "@/base-components/Form/FormSwitch";
import { filePondValue } from '@/composables/useFilepondEvents';
import { customVisitServices } from '@/services/psychosocial/customVisitServices';
import { selectOption } from '@/components/CommonSelect.vue';
import { onboardingStore } from "@/stores/onboardingStore";

const { multiple } = useFilepondEvents();

const route = useRoute();

const { isProvider } = useProvider()

const store = onboardingStore();

//Recibe datos para editar visita personalizada
//QUITAR DATOS DE PRUEBA
const form = reactive({
    month: '1',
    municipality: '2',
    beneficiary: '2',
    topic: 'Físico',
    agreements: 'Se llegó al acuerdo de...',
    concept: '4',
    guardian_knows_semilleros: true,
    file: [],
    status: '4', //id:4 => Rechazado => REC cambiamos si queremos ver otra vista
    reason: 'Fue rechazado por...',
})


const form_rules = computed(() => ({
    month: { required },
    municipality: { required },
    beneficiary: { required },
    topic: { required },
    agreements: { required },
    concept: {},
    guardian_knows_semilleros: { required },
    file: [],
}))

const months = asyncComputed(async () => {
    return await getSelect(['months'])
}, null)

const municipalities = asyncComputed(async () => {
    return await getSelect(['municipalities'])
}, null)


const municipality_id = computed(() => form.municipality)

const beneficiary_data = reactive({
    grade: 'PRIMARIA',
    health_entity: 'NUEVA EPS',
    guardian_name: 'Liliana',
    guardian_lastname: 'Garcia',
    guardian_identification: '1074936855',
})

//Datos de prueba
const beneficiaries = ref<selectOption[]>([
    { label: 'Pedro', value: '1' },
    { label: 'Juan', value: '2' },
    { label: 'Maria', value: '3' },
    { label: 'Jose', value: '4' },
    { label: 'Luis', value: '5' },
])
//Usar para traer beneficiarios (nombre y id) por municipio
// const beneficiaries = asyncComputed(async () => {
//     return municipality_id.value ? await getBeneficiariesByMunicipaly(municipality_id.value) : []
//  }, null)

const dataLoaded = ref(false)
//Verificar si se puede hacer con asycComputed
const getData = async () => {

    await customVisitServices.get(route.params.id as string).then((response) => {
        console.log(response?.data.items);
        if (response?.status == 200 || response?.status == 201) {
            form.reason = response.data.items.reason;
            form.month = response.data.items.month;
            form.municipality = response.data.items.municipality;
            form.beneficiary = response.data.items.beneficiary;
            form.topic = response.data.items.topic;
            form.agreements = response.data.items.agreements;
            form.concept = response.data.items.concept;
            form.guardian_knows_semilleros = response.data.items.guardian_knows_semilleros;
            form.file = response.data.items.file;
            form.status = response.data.items.status;
        } else {
            alerts.custom("", "No se pudieron obtener los datos", "error");
        }
        console.log(form);
    })
};


onMounted(async () => {
    console.log(route);
    await getData();
    dataLoaded.value = true;
    //form.status = `${route.params.id}`
    console.log(form.status)
});

const getBeneficiaryData = async () => {
    //Verificar que traiga los datos necesarios
    await beneficiaryServices.get(form.beneficiary as string).then((response) => {
        console.log(response?.data.items);
        if (response?.status == 200 || response?.status == 201) {
            beneficiary_data.grade = response.data.items.grade;
            beneficiary_data.health_entity = response.data.items.health_entity;
            beneficiary_data.guardian_name = response.data.items.guardian_name;
            beneficiary_data.guardian_lastname = response.data.items.guardian_lastname;
            beneficiary_data.guardian_identification = response.data.items.guardian_identification;
        } else {
            alerts.custom("", "No se pudieron obtener los datos", "error");
        }
        console.log(form);
    })
}


//Mirar si hago servicio
// const beneficiary_data = asyncComputed(async () => {
//     return form.beneficiary ? await getBeneficiaryData(form.beneficiary) : null
// }, null)

const v$ = useVuelidate(form_rules, form)

const router = useRouter()

const onSubmit = async () => {
    const valid = await v$.value.$validate()
    if (valid) {
        form.status = '3';
        form.reason = '';
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
//Para cuando haya api para descargar el archivo
const download = () => {

}

const disableElements = computed(() => {
    return form.status == '4' ? false : true; //id: 4 => Rechazado => REC
})

const positionRange = computed(() => {
    const positionTooltip = (parseInt(form.concept) - 1) / (4);
    return `calc(${positionTooltip * 100}% - ${(2 * (parseInt(form.concept) - 1) ** 2) / 5 + 2 * (parseInt(form.concept) - 1)}px)`;
});
</script>

<template>
    <div class="flex items-center justify-between mt-8 intro-y">
        <div class="flex items-center space-x-4">
            <CommonBackButton :to="'psychosocial.visits'" title="Listado" />
            <h2 v-if="form.status == '4'" class="mr-auto text-lg font-medium">Editar visita personalizada</h2>
            <h2 v-else class="mr-auto text-lg font-medium">Vista visita personalizada</h2>
        </div>
    </div>

    <div v-if="dataLoaded" class="p-5 pt-1 mt-5 intro-y box">
        <div v-if="form.status == '4'">
            <h2 class="text-red-600 font-bold py-2">Razón de rechazo</h2>
            <p class="text-left">{{ form.reason }}</p>
        </div>
        <form @submit.prevent="onSubmit" class="space-y-8 divide-y divide-slate-200">
            <div class="space-y-8 divide-y divide-slate-200 ">
                <div>

                    <div :class="disableElements == false ? 'mt-6' : 'mt-3'"
                        class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                        <CommonSelect :disabled="disableElements" label="Mes *" name="month" v-model="form.month"
                            :validator="v$" :options="months" />
                        <CommonSelect :disabled="disableElements" label="Municipio *" name="municipality"
                            v-model="form.municipality" :validator="v$" :options="municipalities" />
                        <CommonSelect @select="getBeneficiaryData" :disabled="disableElements" label="Beneficiario *"
                            name="beneficiary" v-model="form.beneficiary" :validator="v$" :options="beneficiaries" />
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

                                <FormSwitch.Input :disabled="disableElements" name="swich_plans" id="swich_plans"
                                    type="checkbox" v-model="form.guardian_knows_semilleros" :validator="v$" />
                                <FormSwitch.Label htmlFor="swich_plans"> ¿El padre o acudiente conoce el proyecto de
                                    Semilleros Deportivos?. </FormSwitch.Label>
                            </div>
                        </div>
                        <div class="col-span-3 sm:grid-cols-3 space-y-6 pt-5">
                            <CommonTextarea :disabled="disableElements"
                                label="Temáticas durante la visita: físico, emocional, familiar, escolar, social, espiritual *"
                                placeholder="Escriba..." name="topic" rows="5" v-model="form.topic" :validator="v$" />

                            <CommonTextarea :disabled="disableElements" label="Acuerdos y recomendaciones *"
                                placeholder="Escriba..." name="agreements" rows="5" v-model="form.agreements"
                                :validator="v$" />

                            <div class="grid col-span-3 justify-center">
                                <label for="range" class="text-xs">Concepto del padre o acudiente que atendió la visita en
                                    una
                                    escala de 1 a 5 donde 1 es deficiente y 5 excelente:
                                </label>
                                <div id="range" class="relative mb-5">
                                    <input :disabled="disableElements" class="w-full accent-primary" type="range" min="1"
                                        max="5" v-model="form.concept" />
                                    <div :style="{ left: positionRange }"
                                        class="absolute -translate-x-1/4 border-zinc-500 border-2 p-2  rounded-full bg-primary text-white select-none">
                                        {{ form.concept }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Comprobar qué es lo que se está enviando -->
                        <div class="grid justify-center col-span-3 gap-10 p-5">
                            <h1 class="text-center font-bold">Evidencia</h1>
                            <!-- <img v-if="form.file" :src="form.file[0]" alt=""> -->
                            <img src="/semilleros.png" width="200" alt="">
                        </div>

                        <div v-if="form.status == '4'" class="col-span-3 p-5 mt-6 intro-y">
                            <CommonFile :validator="v$" v-model="form.file" name="file"
                                class="w-11/12 sm:w-8/12 m-auto cursor-pointer" :accept-multiple="false"
                                @addfile="(error: any, value: filePondValue) => { form.file = multiple.addfile({ error, value }, form.file) as never[] }"
                                @removefile="(error: any, value: filePondValue) => { form.file = multiple.removefile({ error, value }, form.file) as never[] }" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="pt-5">
                <div class="flex justify-center gap-x-4">
                    <Button v-if="form.status == '4'" type="submit" variant="primary">
                        Editar visita
                    </Button>

                    <Button v-else-if="form.status == '1'" type="button" variant="primary" @click="download">
                        Descargar visita
                    </Button>
                </div>
            </div>
        </form>
    </div>
</template>