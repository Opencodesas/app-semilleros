<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { selectOption } from '@/components/CommonSelect.vue';
import { technicalDirectorVisitServices } from '@/services/technical_director/technicalDirectorVisitServices';

const urlStorage = `${import.meta.env.VITE_BASE_URL}/storage/`;

const props = defineProps<{
	closeModal: Function;
	item: any;
}>();

const form = reactive({
	date_visit: '',
	hour_visit: '',
	observations: '',
	monitor_id: '',
	municipality_id: '',
	event_support: '',
	discipline_id: '',
	sidewalk: '',
	sports_scene: '',
	beneficiary_coverage: '',
	technical: '',
	description: '',
	file: [],
	created_by: '',
	status_id: '',
	reject_message: '',
});

const form_rules = computed(() => ({
	status_id: { required },
	reject_message: { required: parseInt(form.status_id) == 2 },
}));

const event_supportList = [
	{ label: 'Si', value: 1 },
	{ label: 'No', value: 2 },
];
const evaluationList = [
	{ label: 'Aceptada', value: 1 },
	{ label: 'Rechazada', value: 2 },
];

const statusesList = ref<selectOption[]>([
	{ label: 'Aprobado', value: '1' },
	{ label: 'Rechazado', value: '4' }
])

const dataLoaded = ref(false)

const v$ = useVuelidate(form_rules, form);

const data = async () => {
	form.date_visit = props.item.date_visit;
	form.hour_visit = props.item.hour_visit;
	form.municipality_id = props.item.municipality.name;
	form.sidewalk = props.item.sidewalk;
	form.monitor_id = props.item.monitor.name;
	form.discipline_id = props.item.discipline.name;
	form.sports_scene = props.item.sports_scene;
	form.beneficiary_coverage = props.item.beneficiary_coverage;
	form.technical = props.item.technical;
	form.event_support = props.item.event_support;
	form.description = props.item.description;
	form.observations = props.item.observations;
	form.file = props.item.file;
	form.created_by = props.item.created_by.name;
};

onMounted(async () => {
	await data();
	dataLoaded.value = true;
});

const onSubmit = async () => {
	const valid = await v$.value.$validate();
	if (valid) {
		await subdirectorVisitServices.update(props.item.id as string, formdataParser(form))
			.then((response) => {
				if (response?.status == 200 || response?.status == 201) {
					props.closeModal()
					alerts.custom('', 'Revisión exitosa!', 'success');
					// setLoading(true);
					// router.push('').finally(() => {
					// 	setLoading(false);
					// });
					window.location.reload()
				} else {
					alerts.custom('', 'Error al revisar!', 'error')
				}
			});
	}
};

watch(() => form.status_id, () => {
	if (form.status_id == '1') form.reject_message = '';
})

</script>

<template>
	<div class="flex items-center justify-between mt-5 mb-2 intro-y">
		<h1 class="mr-auto text-lg font-medium">Revisar visitas de los directores tecnicos</h1>
	</div>

	<div class="space-y-2 box px-5 py-4">
		<h2 class="font-bold">Revisión</h2>
		<CommonSelect label="Estado de la tarea *" name="status_id" v-model="form.status_id"
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
			<h3><span class="font-bold">Director:</span> {{ form.created_by }}</h3>
		</div>
		<div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
			<CommonInput disabled type="date" label="Fecha  *" name="date_visit" v-model="form.date_visit" />
			<CommonInput disabled type="time" label="Hora  *" name="hour_visit" v-model="form.hour_visit" />
			<CommonInput disabled label="Municipio *" name="municipality" class="cursor-pointer"
				v-model="form.municipality_id" />

			<CommonInput disabled type="text" placeholder="Ingrese" label="Corregimiento / Vereda *" name="sidewalk"
				v-model="form.sidewalk" />
			<CommonInput disabled label="Monitor *" name="monitor" class="cursor-pointer" v-model="form.monitor_id" />
			<CommonInput disabled label="Disciplinas *" name="discipline" class="cursor-pointer"
				v-model="form.discipline_id" />
			<CommonInput disabled type="text" placeholder="Ingrese" label="Escenario deportivo *" name="sports_scene"
				v-model="form.sports_scene" />
			<CommonInput disabled type="number" min="0" placeholder="Ingresar el numero de beneficiarios"
				label="Cobertura de benificiario *" name="beneficiary_coverage" v-model="form.beneficiary_coverage" />
			<CommonSelect disabled label="Cumple con el desarrollo tecnico del mes *" name="technical"
				class="cursor-pointer" v-model="form.technical" :options="evaluationList" />
			<CommonSelect disabled label="Apoyo a eventos *" name="event_support" class="cursor-pointer"
				v-model="form.event_support" :options="event_supportList" />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea disabled label="Descripcion *" rows="5" placeholder="Ingrese las Descripcion" name="description"
				v-model="form.description" />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea disabled label="Observaciones *" rows="5" placeholder="Ingrese las observaciones"
				name="observations" v-model="form.observations" />
		</div>
		<div class="gap-10 p-5">
			<h1 class="text-center font-bold mb-2">Evidencia</h1>
			<img alt="Evidencia de la visita del director" class="m-auto border rounded-lg" :src="`${urlStorage}${form.file}`" width="400" />
		</div>
	</div>
</template>
    