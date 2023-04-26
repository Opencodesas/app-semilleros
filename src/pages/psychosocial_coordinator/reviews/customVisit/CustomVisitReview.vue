<script setup lang="ts">
import FormSwitch from "@/base-components/Form/FormSwitch";
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import { customVisitServices } from '@/services/psychosocial/customVisitServices';
import { selectOption } from '@/components/CommonSelect.vue';
import { filePondValue } from '@/composables/useFilepondEvents';
import { requiredIf } from "@vuelidate/validators";

const { multiple } = useFilepondEvents();

const route = useRoute();

const props = defineProps<{
    closeModal: Function;
    id_review: String | number;
}>();

//Quitar datos de prueba
const form = reactive({
    reject_message: '',
    status_id: '',
    month: '',
    municipality: '',
    beneficiary: '',
    theme: '',
    agreements: '',
    concept: '',
    guardian_knows_semilleros: true,
    file: [],
    created_by: '', //Revisar si recibe un objeto
})


const form_rules = computed(() => ({
    status_id: { required },
    reject_message: { required: requiredIf(() => form.status_id == '4') },

}))

const status_idList = ref<selectOption[]>([
    { label: 'Aprobado', value: '1' },
    { label: 'Rechazado', value: '4' }
])

const beneficiary_data = reactive({
    scholar_level: '',
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

const municipalities = asyncComputed(async () => {
    return await getSelect(['municipalities'])
}, null)

const beneficiariesList = ref<selectOption[]>([]);

const getBeneficiariesByMunicipaly = async () => {
    await beneficiaryServices.getByDeparment(form.municipality as string).then((response) => {
        if (response?.status == 200 || response?.status == 201) {
            beneficiariesList.value = response?.data
            console.log(response?.data)
        }
    })
}

watch(() => form.municipality, (newVal, oldVal) => {
    console.log(newVal);
    if (newVal != null) getBeneficiariesByMunicipaly();
})

const healthEntities = computedAsync(async () => {
    return await getHealthentities();
}, null)

const dataLoaded = ref(false)
//Verificar si se puede hacer con asycComputed
const getData = async () => {

    await customVisitServices.get(props.id_review as string).then((response) => {
        console.log(response?.data.items);
        if (response?.status == 200 || response?.status == 201) {
            form.reject_message = response.data.items.reject_message;
            form.month = response.data.items.month_id;
            form.municipality = response.data.items.municipality_id;
            form.beneficiary = response.data.items.beneficiary_id;
            form.theme = response.data.items.theme;
            form.agreements = response.data.items.agreements;
            form.concept = response.data.items.concept;
            form.guardian_knows_semilleros = response.data.items.guardian_knows_semilleros;
            form.file = response.data.items.file;
            form.created_by = response.data.items.createdBy.name;
            alerts.custom('', response?.data.message, 'info');

        } else {
            alerts.custom("", "No se pudieron obtener los datos", "error");
        }
        console.log(form);
    });
};


const getBeneficiaryData = async () => {
    await beneficiaryServices.get(form.beneficiary as string).then((response) => {
        console.log(response?.data.items);
        if (response?.status == 200 || response?.status == 201) {
            beneficiary_data.scholar_level = response.data.items.scholar_level ? scholarLevels[response.data.items.scholar_level - 1].label : 'No tiene';
            beneficiary_data.health_entity = response.data.items.health_entity_id ? healthEntities.value[response.data.items.health_entity_id - 1].label : 'No tiene';
            beneficiary_data.guardian_name = response.data.items.acudiente.firts_name;
            beneficiary_data.guardian_lastname = response.data.items.acudiente.last_name;
            beneficiary_data.guardian_identification = response.data.items.acudiente.cedula;
        } else {
            alerts.custom("", "No se pudieron obtener los datos", "error");
        }
    })
}



onMounted(async () => {
    console.log(route);
    await getData();
    await getBeneficiaryData();
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
                    setLoading(true)
                    props.closeModal
                    alerts.custom('', 'Revisión exitosa!', 'success');
                    setLoading(false)
                }
                else {
                    alerts.custom('', 'Error al revisar!', 'error');
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

//Manejo de reject_message para no guardarla si el user selecciona rechazado y pone reject_message y despues pone aprobado.
const definereject_message = () => {
    if (form.status_id == '1') form.reject_message = '';
}
</script>

<template>
    <div class="flex items-center justify-between mt-5 mb-2 intro-y">
        <h1 class="mr-auto text-lg font-medium">Revisar visitas personalizadas de los Psicologos</h1>
    </div>

    <div class="space-y-2 box px-5 py-4">
        <h2 class="font-bold">Revisión</h2>
        <CommonSelect @select="definereject_message" label="Estado de la tarea *" name="status_id"
            v-model="form.status_id" :validator="v$" :options="status_idList" />
        <div v-if="form.status_id == '4'" class="pt-4">
            <CommonTextarea name="reject_message" class="" label="Comentario *" placeholder="Escriba..." rows="5"
                v-model="form.reject_message" :validator="v$" />
        </div>
        <div class="mt-6 flex justify-end col-span-1 md:col-span-2 border-none gap-1" tabindex="1">
            <Button variant="danger" @click="props.closeModal">Cerrar</Button>
            <Button variant="primary" class="btn btn-primary" @click="onSubmit">
                Enviar
            </Button>
        </div>
    </div>

    <div v-if="dataLoaded" class="p-5 pt-1 mt-5 intro-y box">
        <div class="my-4">
            <h3><span class="font-bold">Psicologo:</span> {{ form.created_by }}</h3>
        </div>

        <div class="space-y-8 divide-y divide-slate-200 ">

            <div class="mt-3 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                <CommonSelect disabled label="Mes *" name="month" v-model="form.month" :options="months" />
                <CommonSelect disabled label="Municipio *" name="municipality" v-model="form.municipality"
                    :options="municipalities" />
                <CommonSelect disabled label="Beneficiario *" name="beneficiary" v-model="form.beneficiary"
                    :options="beneficiariesList" />
            </div>
            <!-- cambiar condicion por "beneficiary_data" cuando haya función para traer los datos -->
            <div v-if="form.beneficiary">
                <!-- These inputs don't use the validator since they have data from the DB   cambiar los v-model-->
                <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <CommonInput disabled type="text" label="Grado de escolaridad" name="scholar_level"
                        v-model="beneficiary_data.scholar_level" />
                    <CommonInput disabled type="text" label="Entidad de salud" name="health_entity"
                        v-model="beneficiary_data.health_entity" />
                </div>

                <div class="mt-6 grid grid-cols-2 gap-y-6 gap-x-4 sm:grid-cols-3">
                    <CommonInput disabled type="text" label="Nombre del padre o acudiente" name="guardian.name"
                        v-model="beneficiary_data.guardian_name" />
                    <CommonInput disabled type="text" label="Apellido del padre o acudiente" name="guardian.lastname"
                        v-model="beneficiary_data.guardian_lastname" />
                    <CommonInput disabled type="text" label="Documento de identificación" name="guardian.identification"
                        v-model="beneficiary_data.guardian_identification" />
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
                    <CommonTextarea disabled label="Acuerdos y recomendaciones *" placeholder="Escriba..." name="agreements"
                        rows="5" v-model="form.agreements" />
                </div>

                <div class="grid col-span-3 justify-center">
                    <label for="range" class="text-xs">Concepto del padre o acudiente que atendió la visita en una
                        escala de 1 a 5 donde 1 es deficiente y 5 excelente:
                    </label>
                    <div id="range" class="relative mb-5">
                        <input disabled class="w-full accent-primary" type="range" min="1" max="5" v-model="form.concept" />
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
</template>