<script setup lang="ts">
import { filePondValue } from '@/composables/useFilepondEvents';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const { multiple } = useFilepondEvents();
const router = useRouter();

const form = reactive({
	id: '',
	status: '',
	reason: '',
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
	files: [],
	create_by: '',
});

const form_rules = computed(() => ({
	status: { required },
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
	files: { required },
	create_by: { required },
}));

const v$ = useVuelidate(form_rules, form);

const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);

// onMounted(async () => {

// 	await transversalActivityServices.get(router.currentRoute.value.params.id as string).then((response: any) => {
// 		form.id = response.data.id;
// 		form.status = response.data.status;
// 		form.reason = response.data.reason;
// 		form.municipality_id = response.data.municipality_id;
// 		form.date_visit = response.data.date_visit;
// 		form.nro_assistants = response.data.nro_assistants;
// 		form.activity_name = response.data.activity_name;
// 		form.objective_activity = response.data.objective_activity;
// 		form.scene = response.data.scene;
// 		form.meeting_planing = response.data.meeting_planing;
// 		form.team_socialization = response.data.team_socialization;
// 		form.development_activity = response.data.development_activity;
// 		form.content_network = response.data.content_network;
// 		form.files = response.data.files;
// 		form.create_by = response.data.create_by;
// 	});
// })

const onSubmit = async () => {
	console.log(form.files);
	const valid = await v$.value.$validate();
	if (form.nro_assistants < 0) {
		alerts.error('El numero de asistentes no puede ser negativo');
		return;
	}
	if (valid) {
		await transversalActivityServices
			.create(formdataParser(form))
			.then((response: any) => {
				if (response.status == 200 || response.status == 201) {
					alerts.create();
					setLoading(true);
					router
						.push({
							name: 'psychosocial.transversal-activity.index',
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
</script>

<template>
	<div class="flex items-center mt-8 intro-y">
		<div class="flex items-center space-x-4">
			<CommonBackButton
				:to="'psychosocial.transversal-activity.index'"
				title="Listado" />
			<h2 class="mr-auto text-lg font-medium">
				Registrar actividad transversal
			</h2>
		</div>
	</div>

	<div class="p-5 mt-5 intro-y box">
		<div class="grid grid-cols-1 gap-3 justify-evenly">
			<div class="grid md:grid-cols-3 gap-6">
				<CommonSelect
					label="Municipio *"
					placeholder="Seleccione"
					name="municipality_id"
					class="cursor-pointer"
					v-model="form.municipality_id"
					:validator="v$"
					:options="municipalities" />
				<CommonInput
					type="date"
					label="Fecha  *"
					name="date_visit"
					v-model="form.date_visit"
					:validator="v$" />
				<CommonInput
					type="number"
					placeholder="Ingrese el numero de asistentes"
					:min="0"
					label="Numero de asistentes  *"
					name="nro_assistants"
					v-model="form.nro_assistants"
					:validator="v$" />
			</div>
			<div class="w-full mt-2 grid gap-6">
				<CommonInput
					class="col-span-1"
					type="text"
					placeholder="Actividad transversal"
					label="Actividad transversal *"
					name="activity_name"
					v-model="form.activity_name"
					:validator="v$" />
				<CommonInput
					class="col-span-1"
					type="text"
					placeholder="ingrese el objetivo de la actividad"
					label="Objetivo de la actividad *"
					name="objective_activity"
					v-model="form.objective_activity"
					:validator="v$" />
				<CommonInput
					type="text"
					placeholder="Ingrese el escenario deportivo"
					label="Escenario deportivo *"
					name="scene"
					v-model="form.scene"
					:validator="v$" />
			</div>
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea
				label="Reuniones de Planeacion *"
				rows="5"
				placeholder="Reuniones de Planeacion"
				name="meeting_planing"
				v-model="form.meeting_planing"
				:validator="v$" />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea
				label="Socializacion con el equipo de trabajo *"
				rows="5"
				placeholder="Socializacion con el equipo de trabajo"
				name="team_socialization"
				v-model="form.team_socialization"
				:validator="v$" />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea
				label="Desarrollo de la actividad *"
				rows="5"
				placeholder="Desarrollo de la actividad"
				name="development_activity"
				v-model="form.development_activity"
				:validator="v$" />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea
				label="Contendio de redes *"
				rows="5"
				placeholder="Contenido de redes"
				name="content_network"
				v-model="form.content_network"
				:validator="v$" />
		</div>
		<FormLabel
			for="evidencia"
			class="flex flex-col mt-6 w-full sm:flex-row">
			Evidencia *
		</FormLabel>
		<div class="p-5 intro-y">
			<CommonDropzone
				class="w-3/4 mx-auto"
				name="files"
				:accept-multiple="true"
				v-model="form.files"
				@addfile="(error: any, value: filePondValue) => { form.files = multiple.addfile({ error, value }, form.files) as never[] }"
				@removefile="(error: any, value: filePondValue) => { form.files = multiple.removefile({ error, value }, form.files) as never[] }"
				:validator="v$" />
		</div>
	</div>

	<div class="mt-6 flex justify-end col-span-1 md:col-span-2">
		<Button
			variant="primary"
			class="btn btn-primary"
			@click="onSubmit">
			Registrar
		</Button>
	</div>
</template>
