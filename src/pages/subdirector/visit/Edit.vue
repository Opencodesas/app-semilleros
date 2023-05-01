<script setup lang="ts">
import CommonFile from '@/components/CommonFile.vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import Swal from 'sweetalert2';

const urlStorage = `${import.meta.env.VITE_BASE_URL}/storage/`;
const router = useRouter();
const route = useRoute();
const { id } = route.params;
const dataLoaded = ref(false);

const form = reactive({
	status_id: '',
	reject_message: '',
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
	created_by: '',
	file: [],
});

const form_rules = computed(() => ({
	status_id: { required },
	reject_message: { required: parseInt(form.status_id) == 2 },
	date_visit: { required },
	hour_visit: { required },
	municipality_id: { required },
	sidewalk: { required },
	monitor_id: { required },
	discipline_id: { required },
	sports_scene: { required },
	beneficiary_coverage: { required },
	event_support: { required },
	technical: { required },
	observations: { required },
	description: { required },
	file: {},
}));

const file = ref([]);

// Consulta todos lo municipios
const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);
// Consulta todas las disciplinas
const disciplines = asyncComputed(async () => {
	return await getDisciplinesByMonitor(form.monitor_id);
}, null);

watch(
	() => form.municipality_id,
	() => {
		if (dataLoaded.value) {
			form.monitor_id = '';
		}
	}
);

watch(
	() => form.monitor_id,
	() => {
		if (dataLoaded.value) {
			form.discipline_id = '';
		}
	}
);
// Consulta todos los monitores por municipio
const monitor = asyncComputed(async () => {
	return await getMonitorByMunicipality(form.municipality_id);
}, null);
const event_supportList = [
	{ label: 'Si', value: 1 },
	{ label: 'No', value: 2 },
];
const evaluationList = [
	{ label: 'Aceptada', value: 1 },
	{ label: 'Rechazada', value: 2 },
];
const v$ = useVuelidate(form_rules, form);

const fetch = async () => {
	await subdirectorVisitServices.get(id as string).then((response) => {
		if (response?.status == 200 || response?.status == 201) {
			console.log(response.data.items);
			form.observations = response.data.items.observations;
			form.monitor_id = response.data.items.monitor_id;
			form.municipality_id = response.data.items.municipality_id;
			form.event_support = response.data.items.event_support;
			form.hour_visit = response.data.items.hour_visit;
			form.discipline_id = response.data.items.discipline_id;
			form.sidewalk = response.data.items.sidewalk;
			form.sports_scene = response.data.items.sports_scene;
			form.beneficiary_coverage = response.data.items.beneficiary_coverage;
			form.technical = response.data.items.technical;
			form.date_visit = response.data.items.date_visit;
			form.description = response.data.items.description;
			form.file = response.data.items.file;
			file.value = response.data.items.file;
			form.status_id = response.data.items.status_id;
			form.reject_message = response.data.items.reject_message;
			form.created_by = response.data.items.created_by.name;
		} else {
			Swal.fire('', 'No se pudieron obtener los datos', 'error');
		}
	});
};
onMounted(async () => {
	await fetch();
	dataLoaded.value = true;
});

const selectFile = (event: any) => {
	if (event?.target.files.length > 0) {
		form.file = event.target.files[0];
		return;
	}
	form.file = file.value;
};

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
			.update(id as string, formdataParser(form))
			.then((response) => {
				if (response?.status == 200 || response?.status == 201) {
					// Swal.fire('', 'Modificacion exitosa!', 'success');
					alerts.update();
					setLoading(true);
					router.push({ name: 'subdirector_visit.index' }).finally(() => {
						setLoading(false);
					});
				} else {
					Swal.fire('', 'No se pudieron obtener los datos', 'error');
				}
			});
	} else {
		alerts.validation();
	}
};

const disableElements = computed(() => {
	return form.status_id == '4' ? false : true; //id: 4 => Rechazado => REC
});
const download = () => {};
</script>

<template>
	<div class="flex items-center mt-8 intro-y">
		<div class="flex items-center space-x-4">
			<CommonBackButton
				:to="'subdirector_visit.index'"
				title="Listado" />
			<h2 class="mr-auto text-lg font-medium">Editar visita</h2>
		</div>
	</div>

	<div
		class="p-5 mt-5 intro-y box"
		v-if="dataLoaded">
		<div
			class="mb-6"
			v-if="form.status_id == '4'">
			<p class="text-danger font-bold">Razon de rechazo</p>
			<p>{{ form.reject_message }}</p>
		</div>

		<div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
			<CommonInput
				type="date"
				label="Fecha  *"
				name="date_visit"
				v-model="form.date_visit"
				:validator="v$"
				:disabled="disableElements" />
			<CommonInput
				type="time"
				label="Hora  *"
				name="hour_visit"
				v-model="form.hour_visit"
				:validator="v$"
				:disabled="disableElements" />
			<CommonSelect
				label="Municipio *"
				name="municipality_id"
				class="cursor-pointer"
				v-model="form.municipality_id"
				:validator="v$"
				:options="municipalities"
				:disabled="disableElements" />

			<CommonInput
				type="text"
				placeholder="Ingrese"
				label="Corregimiento / Vereda *"
				name="sidewalk"
				v-model="form.sidewalk"
				:validator="v$"
				:disabled="disableElements" />
			<CommonSelect
				label="Monitor *"
				name="monitor_id"
				class="cursor-pointer"
				v-model="form.monitor_id"
				:validator="v$"
				:options="monitor"
				:disabled="disableElements" />
			<CommonSelect
				label="Disciplinas *"
				name="discipline_id"
				class="cursor-pointer"
				v-model="form.discipline_id"
				:validator="v$"
				:options="disciplines"
				:disabled="disableElements" />
			<CommonInput
				type="text"
				placeholder="Ingrese"
				label="Escenario deportivo *"
				name="sports_scene"
				v-model="form.sports_scene"
				:validator="v$"
				:disabled="disableElements" />
			<CommonInput
				type="number"
				min="0"
				placeholder="Ingresar el numero de beneficiarios"
				label="Cobertura de benificiario *"
				name="beneficiary_coverage"
				v-model="form.beneficiary_coverage"
				:validator="v$"
				:disabled="disableElements" />
			<CommonSelect
				label="Cumple con el desarrollo tecnico del mes *"
				name="technical"
				class="cursor-pointer"
				v-model="form.technical"
				:validator="v$"
				:options="evaluationList"
				:disabled="disableElements" />
			<CommonSelect
				label="Apoyo a eventos *"
				name="event_support"
				class="cursor-pointer"
				v-model="form.event_support"
				:validator="v$"
				:options="event_supportList"
				:disabled="disableElements" />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea
				label="Descripcion *"
				rows="5"
				placeholder="Ingrese las Descripcion"
				name="description"
				v-model="form.description"
				:validator="v$"
				:disabled="disableElements" />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea
				label="Observaciones *"
				rows="5"
				placeholder="Ingrese las observaciones"
				name="observations"
				v-model="form.observations"
				:validator="v$"
				:disabled="disableElements" />
		</div>
		<div class="p-5 mt-6 intro-y">
			<FormLabel
				for="evidencia"
				class="flex flex-col w-full sm:flex-row">
				Evidencia *
			</FormLabel>
			<img
				:alt="`Evidencia de la visita del subdirector ${form.created_by}`"
				class="m-auto border rounded-lg"
				:src="`${urlStorage}/${file}`"
				width="400" />
		</div>
		<div class="p-5 mt-6 intro-y">
			<CommonFile
				:validator="v$"
				v-model="form.file"
				name="file"
				class="w-11/12 sm:w-8/12 m-auto cursor-pointer"
				v-if="!disableElements"
				@change="selectFile"
				@removefile="selectFile" />
		</div>
	</div>

	<div class="mt-6 flex justify-center col-span-1 md:col-span-2">
		<Button
			v-if="!disableElements"
			@click="onSubmit"
			variant="primary">
			Editar visita
		</Button>

		<Button
			v-else-if="form.status_id == '1'"
			type="button"
			variant="primary"
			@click="download">
			Descargar visita
		</Button>
	</div>
</template>
