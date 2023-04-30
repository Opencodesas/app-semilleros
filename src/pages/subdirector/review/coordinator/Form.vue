<script setup lang="ts">
import { coordinatorVisitServices } from '@/services/coordinatorVisitServices';
import { required } from '@/utils/validators';
import useVuelidate from '@vuelidate/core';
import Swal from 'sweetalert2';

const urlStorage = `${import.meta.env.VITE_BASE_URL}/storage/`;
const dataLoaded = ref(false);

const props = defineProps<{
	closeModal: Function;
	item: any;
}>();

const form = reactive({
	id: '',
	date_visit: '',
	hour_visit: '',
	sidewalk: '',
	discipline_id: '',
	sports_scene: '',
	municipalitie_id: '',
	beneficiary_coverage: '',
	description: '',
	observations: '',
	coordinator_name: '',

	user_id: '',

	file: [],
	status_id: '',
	rejection_message: '',
	created_by: '',
});
const form_rules = computed(() => ({
	status_id: { required },
	rejection_message: { required: parseInt(form.status_id) == 4 },
}));
// Consulta todos lo municipios	
const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);
// Consulta todas las disciplinas
const disciplines = asyncComputed(async () => {
	return await getSelect(['disciplines']);
}, null);
// consulta los monitor por municipio
const monitor = asyncComputed(async () => {
	return await getMonitorByMunicipality(form.municipalitie_id);
}, null);

const monitorList = [
	{ label: 'Camilo Martinez', value: 1 },
	{ label: 'Miguel Torres', value: 2 },
];
const statusList = [
	{ label: 'Aprobado', value: 1 },
	{ label: 'Rechazado', value: 4 },
];


const v$ = useVuelidate(form_rules, form);

// Obtiene los datos de la visita
onMounted(() =>{ 
				form.id = props.item.id;
				form.beneficiary_coverage = props.item.beneficiary_coverage;
				form.date_visit = props.item.date_visit;
				form.hour_visit = props.item.hour_visit;
				form.sports_scene = props.item.sports_scene;
				form.observations = props.item.observations;
				form.description = props.item.description;
				form.discipline_id = props.item.discipline_id;
				form.municipalitie_id = props.item.municipalitie.id;
				form.user_id = props.item.user_id;
				form.sidewalk = props.item.sidewalk;
				form.coordinator_name = props.item.created_by.name;
				form.file = props.item.file;
				dataLoaded.value = true;
});

// Envia si la visita fue aprobada o rechazada
const onSubmit = async () => {
	const valid = await v$.value.$validate();
	if (valid) {
		await coordinatorVisitServices
			.update(form.id, formdataParser(form))
			.then((response) => {
				if (response) {
					if (response.status >= 200 && response.status <= 300) {
						alerts.update();
						setLoading(true);
						props.closeModal();
						setLoading(false);
						window.location.reload();
					}
				}
			});
	} else {
		alerts.validation();
	}
};
</script>

<template>
	<div class="flex items-center justify-between intro-y">
		<div class="flex items-center space-x-4">
			<h2 class="mr-auto text-lg font-medium">Revisar Visita Coordinador</h2>
		</div>
	</div>

	<div class="p-5 mt-5 intro-y box space-y-5 divide-y">
		<h3 class="text-lg font-medium text-gray-900">Estado *</h3>
		<CommonSelect
			placeholder="Estado *"
			name="status_id"
			v-model="form.status_id"
			:validator="v$"
			:options="statusList" />
		<CommonTextarea
			placeholder="Motivo del rechazo*"
			name="rejection_message"
			class="intro-x box"
			v-model="form.rejection_message"
			:validator="v$"
			rows="4"
			v-if="parseInt(form.status_id) == 4" />
		<div
			class="mt-6 gap-1 flex justify-end col-span-1 md:col-span-2 border-none"
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
		class="p-5 mt-5 intro-y box">
		<h3 class="text-lg font-medium leading-6 text-gray-900">Revision</h3>
		<p class="mt-3">
			<span class="font-bold">Coordinador regional: </span
			>{{ form.coordinator_name }}
		</p>
		<div class="mt-3 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
			<CommonInput
				type="date"
				placeholder="Fecha "
				label="Fecha *"
				name="activityDate"
				v-model="form.date_visit"
				disabled />
			<CommonInput
				type="time"
				placeholder="Hora"
				label="Hora *"
				name="activityTime"
				v-model="form.hour_visit"
				disabled />
			<CommonSelect
				label="Municipios *"
				name="municipality"
				v-model="form.municipalitie_id"
				:options="municipalities"
				disabled />
			<CommonInput
				type="text"
				placeholder="Corregimiento / Vereda"
				class="disabled:bg-red-700"
				label="Corregimiento / Vereda *"
				name="village"
				v-model="form.sidewalk"
				disabled />
			<CommonSelect
				label="Monitor Deportivo *"
				name="user_id"
				v-model="form.user_id"
				:options="monitor"
				disabled />
			<CommonSelect
				label="Disciplinas *"
				name="disciplines"
				v-model="form.discipline_id"
				:options="disciplines"
				disabled />
			<CommonInput
				type="text"
				placeholder="Escenario Deportivo"
				label="Escenario Deportivo *"
				name="sportsArena"
				v-model="form.sports_scene"
				disabled />
			<CommonInput
				type="number"
				placeholder="Cobertura de beneficiario"
				label="Cobertura de beneficiario *"
				name="beneficiary"
				v-model="form.beneficiary_coverage"
				disabled />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea
				label="Descripcion *"
				placeholder="Ingrese las descripcion"
				name="observations"
				v-model="form.description"
				rows="5"
				:disabled="true" />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea
				label="Observaciones *"
				placeholder="Ingrese las observaciones"
				name="observations"
				v-model="form.observations"
				rows="5"
				:disabled="true" />
		</div>
		<div class="p-5 intro-y box">
			<div
				class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly"></div>

			<div class="p-5 mt-6 intro-y">
				<FormLabel
					for="evidencia"
					class="flex flex-col w-full sm:flex-row">
					Evidencia *
				</FormLabel>
				<img
					:alt="`Evidencia del coordinador ${form.coordinator_name}`"
					class="m-auto border rounded-lg"
					:src="`${urlStorage}${form.file}`"
					width="400" />
			</div>
		</div>
	</div>
</template>
