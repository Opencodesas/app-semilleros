<script setup lang="ts">
import { coordinatorVisitServices } from '@/services/coordinatorVisitServices';
import { onboardingStore } from '@/stores/onboardingStore';
import { required } from '@/utils/validators';
import useVuelidate from '@vuelidate/core';
import Swal from 'sweetalert2';

const store = onboardingStore();

const router = useRouter();
const urlStorage = `${import.meta.env.VITE_BASE_URL}/storage/`;
const dataLoaded = ref(false);

const props = defineProps<{
	closeModal: Function;
	id_review: number;
}>();

const form = reactive({
	id: '',
	coordinator_id: '',
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
const disciplines = asyncComputed(async () => {
	return await getSelect(['disciplines']);
}, null);

const monitorList = [
	{ label: 'Camilo Martinez', value: 1 },
	{ label: 'Miguel Torres', value: 2 },
];
const evaluationList = [
	{ label: 'Aprobado', value: 1 },
	{ label: 'Denegado', value: 2 },
];
const apoyoList = [
	{ label: 'Si', value: 1 },
	{ label: 'No', value: 2 },
];
const statusList = [
	{ label: 'Aprobado', value: 1 },
	{ label: 'Rechazado', value: 4 },
];
const v$ = useVuelidate(form_rules, form);

const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);
onMounted(async () => {
	await coordinatorVisitServices
		.get(props.id_review.toString())
		.then((response) => {
			if (response?.status == 200 || response?.status == 201) {
				console.log(response.data.items);
				form.id = response.data.items.id;
				form.beneficiary_coverage = response.data.items.beneficiary_coverage;
				form.date_visit = response.data.items.date_visit;
				form.hour_visit = response.data.items.hour_visit;
				form.sports_scene = response.data.items.sports_scene;
				form.observations = response.data.items.observations;
				form.description = response.data.items.description;
				form.discipline_id = response.data.items.discipline_id;
				form.municipalitie_id = response.data.items.municipalitie.id;
				form.user_id = response.data.items.user_id;
				form.sidewalk = response.data.items.sidewalk;
				form.coordinator_name = response.data.items.created_by.name;
				form.file = response.data.items.file;
				dataLoaded.value = true;
			} else {
				Swal.fire('', 'No se pudieron obtener los datos', 'error');
			}
		})
		.catch((error) => {
			console.log(error);
		});
});

const onSubmit = async () => {
	const valid = await v$.value.$validate();
	console.log(form.status_id);
	console.log(form.rejection_message);
	if (valid) {
		await coordinatorVisitServices
			.update(props.id_review.toString(), formdataParser(form))
			.then((response) => {
				if (response) {
					if (response.status >= 200 && response.status <= 300) {
						alerts.update();
						setLoading(true);
						props.closeModal()
					setLoading(false);
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

	<div v-if="dataLoaded" class="p-5 mt-5 intro-y box">
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
				:options="monitorList"
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
					:alt="`Evidencia del coordinador ${form.coordinator_id}`"
					class="m-auto border rounded-lg"
					:src="`${urlStorage}${form.file}`"
					width="400" />
			</div>
		</div>
	</div>
</template>
