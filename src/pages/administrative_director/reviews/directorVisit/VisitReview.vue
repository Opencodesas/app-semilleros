<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { onboardingStore } from '@/stores/onboardingStore';
import { selectOption } from '@/components/CommonSelect.vue';
import { technicalDirectorVisitServices } from '@/services/technical_director/technicalDirectorVisitServices';

const router = useRouter();
const route = useRoute();

const props = defineProps<{
    closeModal: Function;
    id_review: String | number;
}>();

const form = reactive({
	status_id: '',
	rejection_message: '',
	date_visit: '2023-02-27',
	hour_visit: '09:30',
	observations: 'a pesar de la fuerte lluvia se vivencio buena población.',
	monitor_id: '',
	municipality_id: '',
	event_support_id: '',
	discipline_id: '',
	sidewalk: 'Jamundi',
	sports_scene: 'Cancha Marcella',
	beneficiary_coverage: '8',
	technical: '',
	description:
		'se encontró en el escenario, confunde los componentes se le deben reforzar.',
	file: [],
	created_by: { id: '1', name: 'Joselito' },
});
const form_rules = computed(() => ({
	status_id: { required },
	rejection_message: { required: parseInt(form.status_id) == 2 },
}));

const statusesList = ref<selectOption[]>([
    { label: 'Aprobado', value: '1' },
    { label: 'Rechazado', value: '4' }
])
const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);
const disciplines = asyncComputed(async () => {
	return await getSelect(['disciplines']);
}, null);
const monitorList = [
	{ label: 'Joselito', value: 1 },
	{ label: 'Miguel Torres', value: 2 },
];
const event_supportList = [
	{ label: 'Si', value: 1 },
	{ label: 'No', value: 2 },
];
const evaluationList = [
	{ label: 'Aceptada', value: 1 },
	{ label: 'Rechazada', value: 2 },
];

const dataLoaded = ref(false)

const v$ = useVuelidate(form_rules, form);

const data = async () => {
	setLoading(true);
	await technicalDirectorVisitServices.get(props.id_review as string).then((response) => {
		if (response?.status == 200) {
			form.observations = response.data.observations;
			form.monitor_id = response.data.monitor_id;
			form.municipality_id = response.data.municipality_id;
			form.event_support_id = response.data.event_support_id;
			form.hour_visit = response.data.hour_visit;
			form.discipline_id = response.data.discipline_id;
			form.sidewalk = response.data.sidewalk;
			form.sports_scene = response.data.sports_scene;
			form.beneficiary_coverage = response.data.beneficiary_coverage;
			form.technical = response.data.technical;
			form.date_visit = response.data.date_visit;
			form.description = response.data.description;
			form.file = response.data.file;
			form.status_id = response.data.status_id;
			form.rejection_message = response.data.rejection_message;
			form.created_by = response.data.created_by;
			setLoading(false);
		} else {
			alerts.custom('', 'Error al cargar los datos!', 'error');
			setLoading(false);
		}
		return;
	});
};
onMounted(async () => {
    console.log(route);
    await data();
    dataLoaded.value = true;
});

const onSubmit = async () => {
	console.log(form.hour_visit);
	form.status_id = '3';
	form.rejection_message = '';
	const valid = await v$.value.$validate();
	if (valid) {
		await technicalDirectorVisitServices
			.update(props.id_review as string, formdataParser(form))
			.then((response) => {
				if (response?.status == 200 || response?.status == 201) {
					props.closeModal
                    alerts.custom('', 'Revisión exitosa!', 'success');
					setLoading(true);
					router.push('PONER RUTA').finally(() => {
						setLoading(false);
					});
				} else {
					alerts.custom('', 'Error al revisar!', 'error')
				}
			});
	}
};

const defineReason = () => {
    if (form.status_id == '1') form.rejection_message = '';
}
</script>

<template>
    <div class="flex items-center justify-between mt-5 mb-2 intro-y">
        <h1 class="mr-auto text-lg font-medium">Revisar visitas de los directores tecnicos</h1>
    </div>

    <div class="space-y-2 box px-5 py-4">
        <h2 class="font-bold">Revisión</h2>
        <CommonSelect @select="defineReason" label="Estado de la tarea *" name="status_id" v-model="form.status_id"
            :validator="v$" :options="statusesList" />
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
            <h3><span class="font-bold">Director:</span> {{ form.created_by.name }}</h3>
        </div>
		<div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
			<CommonInput
                disabled
				type="date"
				label="Fecha  *"
				name="date_visit"
				v-model="form.date_visit"
			/>
			<CommonInput
                disabled
				type="time"
				label="Hora  *"
				name="hour_visit"
				v-model="form.hour_visit"
			/>
			<CommonSelect
                disabled
				label="Municipio *"
				name="municipality_id"
				class="cursor-pointer"
				v-model="form.municipality_id"
				:options="municipalities" />

			<CommonInput
                disabled
				type="text"
				placeholder="Ingrese"
				label="Corregimiento / Vereda *"
				name="sidewalk"
				v-model="form.sidewalk"
			 />
			<CommonSelect
                disabled
				label="Monitor *"
				name="monitor_id"
				class="cursor-pointer"
				v-model="form.monitor_id"
				:options="monitorList" />
			<CommonSelect
                disabled
				label="Disciplinas *"
				name="discipline_id"
				class="cursor-pointer"
				v-model="form.discipline_id"
				:options="disciplines" />
			<CommonInput
                disabled
				type="text"
				placeholder="Ingrese"
				label="Escenario deportivo *"
				name="sports_scene"
				v-model="form.sports_scene"
			 />
			<CommonInput
                disabled
				type="number"
				min="0"
				placeholder="Ingresar el numero de beneficiarios"
				label="Cobertura de benificiario *"
				name="beneficiary_coverage"
				v-model="form.beneficiary_coverage"
			 />
			<CommonSelect
                disabled
				label="Cumple con el desarrollo tecnico del mes *"
				name="technical"
				class="cursor-pointer"
				v-model="form.technical"
				:options="evaluationList" />
			<CommonSelect
                disabled
				label="Apoyo a eventos *"
				name="event_support_id"
				class="cursor-pointer"
				v-model="form.event_support_id"
				:options="event_supportList" />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea
                disabled
				label="Descripcion *"
				rows="5"
				placeholder="Ingrese las Descripcion"
				name="description"
				v-model="form.description"
			 />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea
                disabled
				label="Observaciones *"
				rows="5"
				placeholder="Ingrese las observaciones"
				name="observations"
				v-model="form.observations"
			/>
		</div>
		<div class="p-5 mt-6 intro-y">
			<FormLabel
				for="evidencia"
				class="flex flex-col w-full sm:flex-row">
				Evidencia *
			</FormLabel>
			<img
				:alt="`Evidencia de la visita del director`"
				class="m-auto border rounded-lg"
				src="/semilleros.png"
				width="400" />
		</div>
	</div>
</template>
    