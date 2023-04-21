<script setup lang="ts">
import { filePondValue } from '@/composables/useFilepondEvents';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const { multiple } = useFilepondEvents();
const router = useRouter();
const files = ref([]);
const form = reactive({
	status: '',
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
});

const form_rules = computed(() => ({
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
}));

const v$ = useVuelidate(form_rules, form);
const foto = ref(null);
const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);

const obtenerImagen = (e: any) => {
	form.file = Array.from(e.target.files);
	console.log(files._value);
	console.log(Array.from(e.target.files));
	console.log(form.file);
};

const formdataParser = (form: any) => {
	const formData = new FormData();

	// formData.append('municipality_id', form.municipality_id);
	// formData.append('date_visit', form.date_visit);
	// formData.append('nro_assistants', form.nro_assistants);
	// formData.append('activity_name', form.activity_name);
	// formData.append('objective_activity', form.objective_activity);
	// formData.append('scene', form.scene);
	// formData.append('meeting_planing', form.meeting_planing);
	// formData.append('team_socialization', form.team_socialization);
	// formData.append('development_activity', form.development_activity);
	// formData.append('content_network', form.content_network);
	// formData.append('file', [form.file]);
	//console.log(Object.keys(formData));
	Object.keys(form).forEach((key) => {
		console.log(form[key]);
		formData.append(key, form[key]);
	});
	return formData;
};

const onSubmit = async () => {
	const valid = await v$.value.$validate();
	if (form.nro_assistants < 0) {
		alerts.error('El numero de asistentes no puede ser negativo');
		return;
	}
	if (valid) {
		await transversalActivityServices
			.create(formdataParser(form))
			.then((response) => {
				if (response?.status == 200 || response?.status == 201) {
					alerts.create();
					// setLoading(true);
					// router
					// 	.push({
					// 		name: 'psychosocial.visits',
					// 	})
					// 	.finally(() => {
					// 		setLoading(false);
					// 	});
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
			<h2 class="mr-auto text-lg font-medium">
				Registrar actividad transversal
			</h2>
		</div>
	</div>

	<form enctype="multipart/form-data">
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
						min="0"
						label="No. de asistentes  *"
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
						placeholder="Ingrese el escenario"
						label="Escenario *"
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
			<div class="p-5 intro-y">
				<CommonDropzone
					class="w-3/4 mx-auto"
					name="file"
					:accept-multiple="true"
					v-model="form.file"
					:validator="v$"
					@change="obtenerImagen"
					@addfile="(error: any, value: filePondValue) => { files = multiple.addfile({ error, value }, files) as never[] }"
					@removefile="(error: any, value: filePondValue) => { files= multiple.removefile({ error, value }, files) as never[] }" />
			</div>
		</div>
		<div class="mt-6 flex justify-center col-span-1 md:col-span-2">
			<Button
				variant="primary"
				class="btn btn-primary"
				@click.prevent="onSubmit">
				Registrar
			</Button>
		</div>
	</form>
</template>
