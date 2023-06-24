<script setup lang="ts">
import { filePondValue } from '@/composables/useFilepondEvents';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const { multiple } = useFilepondEvents();
const router = useRouter();
const urlStorage = `${import.meta.env.VITE_BASE_URL}/storage/`;
const dataLoaded = ref(false);


const form = reactive({
	id: '',
	status_id: '',
	rejection_message: '',
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
	create_by: '',
});

const form_rules = computed(() => ({
	status_id: { required },
	municipality_id: { required },
	date_visit: { required },
	nro_assistants: { required },
	activity_name: { required },
	objective_activity: { required },
	scene: { required },
	meeting_planing: { required },
	team_socialization: { required },
	development_activity: { required },
	content_network: { required },
	file: {},
	create_by: { required },
}));

const files: any = ref([]);

const v$ = useVuelidate(form_rules, form);

const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);

onMounted(async () => {
	await transversalActivityServices
		.get(router.currentRoute.value.params.id as string)
		.then((response: any) => {
			form.id = response.data.items.id;
			form.status_id = response.data.items.status_id;
			form.rejection_message = response.data.items.reject_message;
			form.municipality_id = response.data.items.municipality_id;
			form.date_visit = response.data.items.date_visit;
			form.nro_assistants = response.data.items.nro_assistants;
			form.activity_name = response.data.items.activity_name;
			form.objective_activity = response.data.items.objective_activity;
			form.scene = response.data.items.scene;
			form.meeting_planing = response.data.items.meeting_planing;
			form.team_socialization = response.data.items.team_socialization;
			form.development_activity = response.data.items.development_activity;
			form.content_network = response.data.items.content_network;
			files.value = response.data.items.files;
			form.create_by = response.data.items.creator.name;
			dataLoaded.value = true;
		});
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

const onSubmit = async () => {
	form.file = form.file.length == 0 ? files.value : form.file;
	const valid = await v$.value.$validate();
	form.file = form.file == files.value ? [] : form.file;
	if (form.nro_assistants < 0) {
		alerts.error('El numero de asistentes no puede ser negativo');
		return;
	}
	if (valid) {
		await transversalActivityServices
			.update(form.id, formdataParser(form))
			.then((response: any) => {
				if (response.status == 200 || response.status == 201) {
					alerts.create();
					setLoading(true);
					router
						.push({
							name: 'psychosocial.visits',
						})
						.finally(() => {
							setLoading(false);
						});
				}
			});
	} else {
		alerts.validation();
	}
};
const disableElements = computed(() => {
	return form.status_id == '4' ? false : true; //id: 4 => Rechazado => REC
});

const download = async () => {
	return await transversalActivityServices.download(form.id).then((res) => {
		if (res) {
			if (res.status >= 200 && res.status <= 300) {
				downloadFile(res);
			}
		}
	});
};
</script>

<template>
	<div class="flex items-center mt-8 intro-y">
		<div class="flex items-center space-x-4">
			<CommonBackButton
				:to="'psychosocial.visits'"
				title="Listado" />
			<h2 class="mr-auto text-lg font-medium">
				Registrar actividad transversal
			</h2>
		</div>
	</div>

	<div
		class="p-5 mt-5 intro-y box"
		v-if="dataLoaded">
		<div
			class="mb-6"
			v-if="form.status_id == '4'">
			<p class="text-danger font-bold">Razon de rechazo</p>
			<p>{{ form.rejection_message }}</p>
		</div>
		<div class="grid grid-cols-1 gap-3 justify-evenly">
			<div class="grid md:grid-cols-3 gap-6">
				<CommonSelect
					label="Municipio *"
					placeholder="Seleccione"
					name="municipality_id"
					class="cursor-pointer"
					v-model="form.municipality_id"
					:validator="v$"
					:options="municipalities"
					:disabled="disableElements" />
				<CommonInput
					type="date"
					label="Fecha  *"
					name="date_visit"
					v-model="form.date_visit"
					:validator="v$"
					:disabled="disableElements" />
				<CommonInput
					type="number"
					placeholder="Ingrese el numero de asistentes"
					:min="0"
					label="Numero de asistentes  *"
					name="nro_assistants"
					v-model="form.nro_assistants"
					:validator="v$"
					:disabled="disableElements" />
			</div>
			<div class="w-full mt-2 grid gap-6">
				<CommonInput
					class="col-span-1"
					type="text"
					placeholder="Actividad transversal"
					label="Actividad transversal *"
					name="activity_name"
					v-model="form.activity_name"
					:validator="v$"
					:disabled="disableElements" />
				<CommonInput
					class="col-span-1"
					type="text"
					placeholder="ingrese el objetivo de la actividad"
					label="Objetivo de la actividad *"
					name="objective_activity"
					v-model="form.objective_activity"
					:validator="v$"
					:disabled="disableElements" />
				<CommonInput
					type="text"
					placeholder="Ingrese el escenario deportivo"
					label="Escenario deportivo *"
					name="scene"
					v-model="form.scene"
					:validator="v$"
					:disabled="disableElements" />
			</div>
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea
				label="Reuniones de Planeacion *"
				rows="5"
				placeholder="Reuniones de Planeacion"
				name="meeting_planing"
				v-model="form.meeting_planing"
				:validator="v$"
				:disabled="disableElements" />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea
				label="Socializacion con el equipo de trabajo *"
				rows="5"
				placeholder="Socializacion con el equipo de trabajo"
				name="team_socialization"
				v-model="form.team_socialization"
				:validator="v$"
				:disabled="disableElements" />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea
				label="Desarrollo de la actividad *"
				rows="5"
				placeholder="Desarrollo de la actividad"
				name="development_activity"
				v-model="form.development_activity"
				:validator="v$"
				:disabled="disableElements" />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea
				label="Contendio de redes *"
				rows="5"
				placeholder="Contenido de redes"
				name="content_network"
				v-model="form.content_network"
				:validator="v$"
				:disabled="disableElements" />
		</div>
		<div class="p-5 mt-6 intro-y">
			<FormLabel
				for="evidencia"
				class="flex flex-col w-full sm:flex-row">
				Evidencia *
			</FormLabel>
			<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
			<!-- {{urlStorage}} -->
				<img
					v-for="file in files"
					:alt="`Evidencia del psicosocial ${form.create_by}`"
					class="m-auto border rounded-lg h-80 w-80 xl:h-96 xl:w-96 object-contain"
					:src="`${urlStorage}${file.path}`" />
			</div>
		</div>
		<div
			class="p-5 intro-y"
			v-if="!disableElements">
			<CommonDropzone
				class="w-3/4 mx-auto"
				name="file"
				:accept-multiple="true"
				v-model="form.file"
				@addfile="(error: any, value: filePondValue) => { form.file = multiple.addfile({ error, value }, form.file) as never[] }"
				@removefile="(error: any, value: filePondValue) => { form.file = multiple.removefile({ error, value }, form.file) as never[] }"
				:validator="v$" />
		</div>
	</div>

	<div class="mt-6 flex justify-center col-span-1 md:col-span-2">
		<Button
			v-if="!disableElements"
			@click="onSubmit"
			variant="primary">
			Guardar
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
