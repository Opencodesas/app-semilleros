<script setup lang="ts">
import { selectOption } from '@/components/CommonSelect.vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const urlStorage = `${import.meta.env.VITE_BASE_URL}/storage/`;

const props = defineProps<{
	closeModal: Function;
	id_review: String | number;
}>();

const form = reactive({
	id: '',
	date_visit: '',
	hour_visit: '',
	municipality_id: '',
	sidewalk: '',
	monitor_id: '',
	discipline_id: '',
	sports_scene: '',
	beneficiary_coverage: '',
	technical: '',
	event_support: '',
	description: '',
	observations: '',
	file: [],
	createdBy: {},
	status_id: '', //id:2 => En revisión => ENR
	rejection_message: 'Rechazado ya que...',
});

const form_rules = computed(() => ({
	rejection_message: { required: parseInt(form.status_id) == 2 },
	status_id: { required },
}));

const v$ = useVuelidate(form_rules, form);

const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);

//Traer todas las disciplinas
const disciplines = asyncComputed(async () => {
	return await getSelect(['disciplines']);
}, null);

const evaluationList = [
	{ label: 'Aceptada', value: 1 },
	{ label: 'Rechazada', value: 2 },
];
//Usar para traer monitores por municipio cuando haya funcion
const monitorList = [
	//No olvidar llamar las funciones cuando se selecciones con @select en el componente
	{ label: 'Joselito', value: 1 },
	{ label: 'Miguelito', value: 2 },
	//async () => {
	//     return municipality_id.value ? await getMonitorsByMunicipaly(municipality_id.value) : []
	//  }
];

const yes_no_List = [
	{ label: 'Si', value: 1 },
	{ label: 'No', value: 2 },
];

const statusesList = ref<selectOption[]>([
	{ label: 'Aprobado', value: '1' },
	{ label: 'Rechazado', value: '4' },
]);

const dataLoaded = ref(false);
//Verificar si se puede hacer con asycComputed
const getData = async () => {
	await subdirectorVisitServices
		.get(props.id_review as string)
		.then((response: any) => {
			if (response?.status == 200 || response?.status == 201) {
				form.id = response.data.items.id;
				form.date_visit = response.data.items.date_visit;
				form.hour_visit = response.data.items.hour_visit;
				form.municipality_id = response.data.items.municipality_id;
				form.sidewalk = response.data.items.sidewalk;
				form.monitor_id = response.data.items.monitor_id;
				form.discipline_id = response.data.items.discipline_id;
				form.sports_scene = response.data.items.sports_scene;
				form.beneficiary_coverage = response.data.items.beneficiary_coverage;
				form.technical = response.data.items.technical;
				form.event_support = response.data.items.event_support;
				form.description = response.data.items.description;
				form.observations = response.data.items.observations;
				form.status_id = response.data.items.status_id;
				form.rejection_message = response.data.items.rejection_message;
				form.file = response.data.items.file;
				form.createdBy = response.data.items.created_by.name;
			} else {
				alerts.custom('', 'No se pudieron obtener los datos', 'error');
			}
		});
};

onMounted(async () => {
	await getData();
	dataLoaded.value = true;
});

const formdataParser = (form: any) => {
	const formData = new FormData();
	Object.keys(form).forEach((key) => {
		formData.append(key, form[key]);
	});
	return formData;
};
const onSubmit = async () => {
	const valid = await v$.value.$validate();
	if (valid) {
		await subdirectorVisitServices
			.update(form.id, formdataParser(form))
			.then((response) => {
				if (response) {
					if (response.status >= 200 && response.status <= 300) {
						props.closeModal();
						alerts.update();
						setLoading(false);
					}
				}
			});
	} else {
		alerts.validation();
	}
};

const defineReason = () => {
	if (form.status_id == '1') form.rejection_message = '';
};
</script>

<template>
	<div class="flex items-center justify-between mb-1 intro-y">
		<h1 class="mr-auto text-lg font-medium">
			Revisar visitas de los subdirectores
		</h1>
	</div>

	<div class="space-y-2 box px-5 py-4">
		<h2 class="font-bold">Revisión</h2>
		<CommonSelect
			@select="defineReason"
			label="Estado de la tarea *"
			name="status_id"
			v-model="form.status_id"
			:validator="v$"
			:options="statusesList" />
		<div
			v-if="form.status_id == '4'"
			class="pt-4">
			<CommonTextarea
				name="rejection_message"
				class=""
				label="Comentario *"
				placeholder="Escriba..."
				rows="5"
				v-model="form.rejection_message"
				:validator="v$" />
		</div>
		<div
			class="mt-6 flex justify-end col-span-1 md:col-span-2 border-none gap-1"
			tabindex="1">
			<Button
				variant="danger"
				@click="props.closeModal"
				>Cerrar</Button
			>
			<Button
				variant="primary"
				class="btn btn-primary"
				@click="onSubmit">
				Enviar
			</Button>
		</div>
	</div>

	<div
		v-if="dataLoaded"
		class="p-5 pt-1 mt-5 intro-y box">
		<div class="my-4">
			<h3><span class="font-bold">Subdirector:</span> {{ form.createdBy }}</h3>
		</div>
		<div
			class="grid grid-cols-2 md:grid md:grid-cols-2 gap-6 justify-evenly mt-4">
			<CommonInput
				disabled
				type="date"
				label="Fecha  *"
				name="date_visit"
				v-model="form.date_visit" />
			<CommonInput
				disabled
				type="time"
				label="Hora  *"
				name="hour_visit"
				v-model="form.hour_visit" />
			<CommonSelect
				disabled
				label="Municipio *"
				name="municipality_id"
				v-model="form.municipality_id"
				:options="municipalities" />

			<CommonInput
				disabled
				type="text"
				placeholder="Ingrese"
				label="Corregimiento / Vereda *"
				name="sidewalk"
				v-model="form.sidewalk" />
			<CommonSelect
				disabled
				label="Monitor *"
				name="monitor_id"
				v-model="form.monitor_id"
				:options="monitorList" />
			<CommonSelect
				disabled
				label="Diciplinas *"
				name="discipline_id"
				v-model="form.discipline_id"
				:options="disciplines" />
			<CommonInput
				disabled
				type="text"
				placeholder="Ingrese"
				label="Escenario deportivo *"
				name="sports_scene"
				v-model="form.sports_scene" />
			<CommonInput
				disabled
				type="number"
				placeholder="Ingrese"
				label="Cobertura de benificiario *"
				name="beneficiary_coverage"
				v-model="form.beneficiary_coverage" />
			<CommonSelect
				disabled
				label="Cumple con el desarrollo del componente técnico del mes *"
				name="technical"
				v-model="form.technical"
				:options="evaluationList" />
			<CommonSelect
				disabled
				label="Apoyo a eventos *"
				name="event_support"
				v-model="form.event_support"
				:options="yes_no_List" />

			<!--  -->
		</div>
		<div class="col-span-3 sm:grid-cols-3 my-3">
			<CommonTextarea
				disabled
				name="description"
				label="Descripción *"
				rows="5"
				placeholder="Escriba..."
				v-model="form.description" />
		</div>
		<div class="col-span-3 sm:grid-cols-3">
			<CommonTextarea
				disabled
				name="observations"
				label="Observarciones *"
				rows="5"
				placeholder="Escriba..."
				v-model="form.observations" />
		</div>
		<div class="grid col-span-3 gap-10 p-5">
			<h1 class="text-left font-bold">Evidencia</h1>
			<!-- <img v-if="form.file" :src="form.file[0]" alt=""> -->
			<img
				class="m-auto border rounded-lg"
				:src="`${urlStorage}${form.file}`"
				width="400" />
			<div class="p-5 mt-6 intro-y"></div>
		</div>
	</div>
</template>
