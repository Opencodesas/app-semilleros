<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@/utils/validators'
import FormSwitch from "@/base-components/Form/FormSwitch";
import { visitServices } from '@/services/psychosocial/visitServices';
import { selectOption } from '@/components/CommonSelect.vue';
import { requiredIf } from '@vuelidate/validators';

const props = defineProps<{
    closeModal: Function;
    id_review: String | number;
}>();


const form = reactive({
    date_visit: '',
    municipality_id: '',
    monitor_id: '',
    discipline_id: '',
    numberBeneficiaries: '',
    sports_scene: '',
    objetive: '',
    beneficiaries_knows_project: false,
    beneficiaries_knows_monthly_value: false,
    monitor_organization_discipline_management: false,
    description: '',
    observations: '',
    file: [],
    status_id: '',
    rejection_message: '',
    created_by: '',
});
const form_rules = computed(() => ({
    status_id: { required },
    rejection_message: { required: requiredIf(() => form.status_id == '4') },
}));

const status_idList = ref<selectOption[]>([
    { label: 'Aprobado', value: '1' },
    { label: 'Rechazado', value: '4' }
])

const municipalities = asyncComputed(async () => {
    return await getSelect(['municipalities'])
}, null)

const disciplinesList = ref([]);
const monitorList = [
    { label: "Joselito", value: 1 },
    { label: "Miguelito", value: 2 },
];

const v$ = useVuelidate(form_rules, form)


const dataLoaded = ref(false)

const getData = async () => {

    await visitServices.get(props.id_review as string).then((response) => {
        console.log(response?.data.items);
        if (response?.status == 200 || response?.status == 201) {
            form.rejection_message = response.data.items.rejection_message;
            form.date_visit = response.data.items.date_visit;
            form.municipality_id = response.data.items.municipality_id;
            form.monitor_id = response.data.items.monitor_id;
            form.discipline_id = response.data.items.discipline_id;
            form.numberBeneficiaries = response.data.items.numberBeneficiaries;
            form.sports_scene = response.data.items.sports_scene;
            form.objetive = response.data.items.objetive;
            form.beneficiaries_knows_project = response.data.items.beneficiaries_knows_project;
            form.beneficiaries_knows_monthly_value = response.data.items.beneficiaries_knows_monthly_value;
            form.monitor_organization_discipline_management = response.data.items.monitor_organization_discipline_management;
            form.description = response.data.items.description;
            form.observations = response.data.items.observations;
            form.file = response.data.items.file;
            form.status_id = response.data.items.status_id;
            form.created_by = response.data.items.created_by;
        } else {
            alerts.custom("", "No se pudieron obtener los datos", "error");
        }
        console.log(form);
    })
};

onMounted(async () => {
    await getData();
    dataLoaded.value = true;
});

const onSubmit = async () => {
    const valid = await v$.value.$validate()
    if (valid) {
        await visitServices.update(props.id_review as string, formdataParser(form)).then((response) => {
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

const definerejection_message = () => {
    if (form.status_id == '1') form.rejection_message = '';
}
</script>

<template>
    <div class="flex items-center justify-between mt-5 mb-2 intro-y">
        <h1 class="mr-auto text-lg font-medium">Revisar visitas personalizadas de los Psicologos</h1>
    </div>

    <div class="space-y-2 box px-5 py-4">
        <h2 class="font-bold">Revisión</h2>
        <CommonSelect @select="definerejection_message" label="Estado de la tarea *" name="status_id"
            v-model="form.status_id" :validator="v$" :options="status_idList" />
        <div v-if="form.status_id == '4'" class="pt-4">
            <CommonTextarea name="rejection_message" class="" label="Comentario *" placeholder="Escriba..." rows="5"
                v-model="form.rejection_message" :validator="v$" />
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

        <div class="space-y-8 divide-y divide-slate-200">

            <div class="grid grid-cols-2 gap-y-6 gap-x-4">
                <CommonInput disabled type="date" label="Fecha *" name="date_visit" v-model="form.date_visit" />
                <CommonSelect disabled label="Municipio *" name="municipality_id" v-model="form.municipality_id"
                    :options="municipalities" />
                <CommonSelect disabled label="Monitor Deportivo *" name="monitor_id" v-model="form.monitor_id"
                    :options="monitorList" />
                <CommonSelect disabled label="Disciplinas *" name="discipline_id" v-model="form.discipline_id"
                    :options="disciplinesList" />
                <CommonInput disabled type="number" min="0" label="No. Beneficiarios en el campo *" placeholder="Escriba..."
                    name="numberBeneficiaries" v-model="form.numberBeneficiaries" />
                <CommonInput disabled type="text" label="Escenario Deportivo *" placeholder="Escriba..." name="sports_scene"
                    v-model="form.sports_scene" />
                <div class="col-span-2">
                    <CommonInput disabled label="Objetivo del acompañamiento *" placeholder="Escriba..." name="objetive"
                        v-model="form.objetive" />
                </div>
            
                <div class="p-5 intro-y box col-span-2  bg-gray-200 flex flex-col gap-3">
                    <div class="">

                        <FormSwitch.Input disabled name="beneficiaries_knows_project" id="beneficiaries_knows_project"
                            type="checkbox" v-model="form.beneficiaries_knows_project" />
                        <FormSwitch.Label class="text-sm" htmlFor="beneficiaries_knows_project"> ¿LOS BENEFICIARIOS
                            RECONOCEN EL NOMBRE
                            DEL
                            PROYECTO? </FormSwitch.Label>
                    </div>
                    <div class="">

                        <FormSwitch.Input disabled name="beneficiaries_knows_monthly_value" id="beneficiaries_knows_monthly_value"
                            type="checkbox" v-model="form.beneficiaries_knows_monthly_value" />
                        <FormSwitch.Label htmlFor="beneficiaries_knows_monthly_value"> ¿LOS BENEFICIARIOS RECONOCEN EL
                            VALOR DESARROLLADO
                            EN EL MES? </FormSwitch.Label>
                    </div>
                    <div class="">

                        <FormSwitch.Input disabled name="monitor_organization_discipline_management"
                            id="monitor_organization_discipline_management" type="checkbox"
                            v-model="form.monitor_organization_discipline_management" />
                        <FormSwitch.Label htmlFor="monitor_organization_discipline_management"> ¿SE OBSERVA
                            ORGANIZACIÓN, DISCIPLINA Y BUEN MANEJO
                            DE GRUPO DURANTE LAS SESIONES DE CLASE DEL MONITOR? </FormSwitch.Label>
                    </div>
                </div>
                <div class="col-span-2">
                    <CommonTextarea disabled label="Descripción de actividades *" placeholder="Escriba..." name="description"
                        rows="5" v-model="form.description" />
                </div>
                <div class="col-span-2 sm:grid-cols-3">
                    <CommonTextarea disabled label="Observaciones *" placeholder="Escriba..." name="observations" rows="5"
                        v-model="form.observations" />
                </div>

                <!-- Comprobar qué es lo que se está enviando -->
                <div class="grid justify-center col-span-2 gap-10 p-5">
                    <h1 class="text-center font-bold">Evidencia</h1>
                    <!-- <img :src="form.file[0]" alt=""> -->
                    <img src="/semilleros.png" width="200" alt="">
                </div>
            </div>

        </div>
    </div>
</template>