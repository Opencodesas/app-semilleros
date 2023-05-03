<script setup lang="ts">
import { required, requiredIf } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { selectOption } from '@/components/CommonSelect.vue';

const urlStorage = `${import.meta.env.VITE_BASE_URL}/storage/`;

const router = useRouter();
const route = useRoute();

const props = defineProps<{
    closeModal: Function;
    item: any;
}>();


const form = reactive({
    status_id: '',
    reject_message: '',
    municipality_id: '',
    date_visit: '',
    nro_assistants: 0,
    activity_name: '',
    objective_activity: '',
    scene: '',
    meeting_planing: '',
    team_socialization: '',
    development_activity: '',
    content_network: '',
    file: [],
});

const formdataParser = (form: any) => {
	const formData = new FormData();
	Object.keys(form).forEach((key) => {
		if (key == 'file') {
			form[key].forEach((file: any) => {
				formData.append('file[]', file);
			});
		} else {
			formData.append(key, form[key]);
		}
	});
	return formData;
};


const form_rules = computed(() => ({
    reject_message: { required: requiredIf(() => form.status_id == '4') },
    status_id: { required },
}));

const infoForm = reactive({
    municipality_name: '',
    created_by: '',
});

const files: any = ref([]);

const v$ = useVuelidate(form_rules, form);

const statusesList = ref<selectOption[]>([
    { label: 'Aprobado', value: '1' },
    { label: 'Rechazado', value: '4' }
])

const dataLoaded = ref(false)

const getData = () => {
    form.municipality_id = props.item.municipality_id;
    form.date_visit = props.item.date_visit;
    form.nro_assistants = props.item.nro_assistants;
    form.activity_name = props.item.activity_name;
    form.objective_activity = props.item.objective_activity;
    form.scene = props.item.scene;
    form.meeting_planing = props.item.meeting_planing;
    form.team_socialization = props.item.team_socialization;
    form.development_activity = props.item.development_activity;
    form.content_network = props.item.content_network;
    form.file = props.item.files;


    files.value = props.item.files;
    console.log(files.value)
    infoForm.municipality_name = props.item.municipalities.name;
    infoForm.created_by = `${props.item.creator.name} ${props.item.creator.lastname}`;
};


onMounted(async () => {
    console.log(route);
    getData();
    dataLoaded.value = true;
    console.log(form.status_id)
});



const onSubmit = async () => {
    form.file = files.value;
    console.log(form.file)
    const valid = await v$.value.$validate()
    if (valid) {
        await transversalActivityServices.update(props.item.id as string, formdataParser(form)).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    //props.closeModal()
                    alerts.update()
                    setLoading(true)
                    //router.push('psychosocial-coordinator.reviews').finally(() => {
                    setLoading(false)
                    //})
                    //window.location.reload();
                }
            }
        })
    }
    else {
        alerts.validation()
    }
}

const definereject_message = () => {
    if (form.status_id == '1') form.reject_message = '';
}
</script>

<template>
    <div class="flex items-center justify-between mt-5 mb-2 intro-y">
        <h1 class="mr-auto text-lg font-medium">Revisar Actividad Transversal</h1>
    </div>

    <div class="space-y-2 box px-5 py-4">
        <h2 class="font-bold">Revisión</h2>
        <CommonSelect @select="definereject_message" label="Estado de la tarea *" name="status_id" v-model="form.status_id"
            :validator="v$" :options="statusesList" />
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
            <h3><span class="font-bold">Psicologo:</span> {{ infoForm.created_by }}</h3>
        </div>
        <div class="grid grid-cols-3 gap-6 justify-evenly mt-4">
            <CommonInput disabled label="Municipio *" name="municipality" v-model="infoForm.municipality_name" />
            <CommonInput disabled type="date" label="Fecha  *" name="date_visit" v-model="form.date_visit" />
            <CommonInput disabled type="number" label="No. Asistentes *" name="nro_assistants"
                v-model="form.nro_assistants" />
        </div>
        <div class="mt-5 space-y-5">
            <CommonInput disabled type="text" label="Actividad Transversal  *" name="activity_name"
                v-model="form.activity_name" />
            <CommonInput disabled type="text" label="Objetivo de la actividad  *" name="objective_activity"
                v-model="form.objective_activity" />
            <CommonInput disabled type="text" label="Escenario  *" name="scene" v-model="form.scene" />

            <CommonTextarea disabled name="meeting_planing" label="Reuniones de Planeación *" rows="5"
                placeholder="Escriba..." v-model="form.meeting_planing" />
            <CommonTextarea disabled name="team_socialization" label="Socialización con el Equipo de Trabajo *" rows="5"
                placeholder="Escriba..." v-model="form.team_socialization" />
            <CommonTextarea disabled name="development_activity" label="Desarrollo de la Actividad *" rows="5"
                placeholder="Escriba..." v-model="form.development_activity" />
            <CommonTextarea disabled name="content_network" label="Contenido de Redes *" rows="5" placeholder="Escriba..."
                v-model="form.content_network" />
        </div>
        <div class="my-2">
            <h1 class="text-center font-bold">Evidencia</h1>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 col-span-3">
            <img v-for="file in files" :alt="`Evidencia del psicosocial ${infoForm.created_by}`"
                class="m-auto border rounded-lg h-80 w-80 xl:h-96 xl:w-96" :src="`${urlStorage}${file.path}`" />
        </div>
    </div>
</template>
