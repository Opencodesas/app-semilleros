<script setup lang="ts">
import CommonFile from '@/components/CommonFile.vue';
import { filePondValue } from '@/composables/useFilepondEvents';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const { multiple } = useFilepondEvents();
const router = useRouter();
const route = useRoute();
const { id } = route.params;

const form = reactive({
	id: '',
	status: '',
	reason: '',
	municipality_id: '',
	date_visit: '',
	nro_assistants: '',
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
	file: { required },
	create_by: { required },
}));

const v$ = useVuelidate(form_rules, form);

const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);

const onSubmit = async () => {
	const valid = await v$.value.$validate();

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
				:to="'subdirector_visit.index'"
				title="Listado" />
			<h2 class="mr-auto text-lg font-medium">
				Registrar actividad transversal
			</h2>
		</div>
	</div>

	<div class="p-5 mt-5 intro-y box">
		<div class="grid grid-cols-1 md:grid md:grid-cols-3 gap-6 justify-evenly">
			<div class="grid md:grid-cols-3 gap-6 md:col-span-3">
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
					min="0"
					label="Numero de asistentes  *"
					name="nro_assistants"
					v-model="form.nro_assistants"
					:validator="v$" />
			</div>
			<CommonInput
				type="text"
				placeholder="Ingrese el corregimiento o vereda"
				label="Corregimiento / Vereda *"
				name="activity_name"
				v-model="form.activity_name"
				:validator="v$" />
			<CommonInput
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
		<div class="p-5 mt-6 intro-y">
			<CommonFile
				:validator="v$"
				v-model="form.file"
				name="file"
				class="w-11/12 sm:w-8/12 m-auto cursor-pointer"
				@addfile="(error: any, value: filePondValue) => { form.file = multiple.addfile({ error, value }, form.file) as never[] }"
				@removefile="(error: any, value: filePondValue) => { form.file = multiple.removefile({ error, value }, form.file) as never[] }" />
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
