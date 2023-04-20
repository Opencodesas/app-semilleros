<script setup lang="ts">
import CommonFile from '@/components/CommonFile.vue';
import useVuelidate from '@vuelidate/core';
import { required, requiredIf } from '@vuelidate/validators';
import Swal from 'sweetalert2';

const urlStorage = `${import.meta.env.VITE_BASE_URL}/storage/`;
const router = useRouter();
const route = useRoute();
const dataLoaded = ref(false);
const form = reactive({
	id: '',
	reject_message: '',
	date_visit: '',
	hour_visit: '',
	municipalitie_id: '',
	sidewalk: '',
	user_id: '',
	discipline_id: '',
	sports_scene: '',
	beneficiary_coverage: '',
	description: '',
	observations: '',
	file: [],
	created_by: '',
	status_id: '',
});

const form_rules = computed(() => ({
	reject_message: { required: requiredIf(() => form.status_id == '2') },
	date_visit: { required },
	hour_visit: { required },
	municipalitie_id: { required },
	sidewalk: { required },
	user_id: { required },
	discipline_id: { required },
	sports_scene: { required },
	beneficiary_coverage: { required },
	description: { required },
	observations: { required },
	file: { required },
}));

const monitorList = [
	{ label: 'Joselito', value: 1 },
	{ label: 'Miguelito', value: 2 },
];
const v$ = useVuelidate(form_rules, form);

const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);

const disciplines = asyncComputed(async () => {
	return await getSelect(['disciplines']);
}, null);

const file = ref(null);

const fetch = async () => {
	await coordinatorVisitServices
		.get(route.params.id as string)
		.then((response) => {
			if (response?.status == 200 || response?.status == 201) {
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
				form.status_id = response.data.items.status_id;
				form.reject_message = response.data.items.reject_message;
				form.file = response.data.items.file;
				file.value = response.data.items.file;
				dataLoaded.value = true;
			} else {
				Swal.fire('', 'No se pudieron obtener los datos', 'error');
			}
		});
};
onMounted(() => {
	fetch();
});

/**
 * Para los archivos, vas a desestructurar el objeto form
 *      { files, ...rest } = form
 *      let fd = formdataParser(rest)
 *
 *      for (let i = 0; i < files.length; i++) {
 *          fd.append('files[]', files[i])
 *      }
 *
 *      servicios.create(fd)
 */

const selectFile = (event: any) => {
	console.log(event);
	if (event?.target.files.length > 0) {
		form.file = event.target.files[0];
		return 
	};
	form.file = file.value;
}

const formdataParser = (form: any) => {
	const formData = new FormData();
	Object.keys(form).forEach((key) => {
		formData.append(key, form[key]);
	});
	return formData;
};

const onSubmit = async () => {
	console.log(file.value);
	const valid = await v$.value.$validate();
	if (valid) {
		await coordinatorVisitServices
			.update(form.id, formdataParser(form))
			.then((response) => {
				if (response) {
					if (response.status >= 200 && response.status <= 300) {
						alerts.update();
						setLoading(true);
						router
							.push({
								name: 'coordinator.index',
							})
							.finally(() => {
								setLoading(false);
							});
					}
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
				:to="'coordinator.index'"
				title="Listado" />
			<h2 class="mr-auto text-lg font-medium">Editar visita</h2>
		</div>
	</div>
	<div
		class="content"
		v-if="dataLoaded">
		<div class="p-5 mt-5 intro-y box">
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
					placeholder="Seleccione"
					name="municipalitie_id"
					class="cursor-pointer"
					v-model="form.municipalitie_id"
					:validator="v$"
					:options="municipalities"
					:disabled="disableElements" />

				<CommonInput
					type="text"
					placeholder="Ingrese el corregimiento o vereda"
					label="Corregimiento / Vereda *"
					name="sidewalk"
					v-model="form.sidewalk"
					:validator="v$"
					:disabled="disableElements" />
				<CommonSelect
					label="Monitor *"
					name="user_id"
					placeholder="Seleccione"
					class="cursor-pointer"
					v-model="form.user_id"
					:validator="v$"
					:options="monitorList"
					:disabled="disableElements" />
				<CommonSelect
					label="Disciplinas *"
					placeholder="Seleccione"
					name="discipline_id"
					class="cursor-pointer"
					v-model="form.discipline_id"
					:validator="v$"
					:options="disciplines"
					:disabled="disableElements" />
				<CommonInput
					type="text"
					placeholder="Ingrese el escenario deportivo"
					label="Escenario deportivo *"
					name="sports_scene"
					v-model="form.sports_scene"
					:validator="v$"
					:disabled="disableElements" />
				<CommonInput
					type="number"
					min="0"
					placeholder="Ingrese un numero de beneficiarios"
					label="Cobertura de benificiario *"
					name="beneficiary_coverage"
					v-model="form.beneficiary_coverage"
					:validator="v$"
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
					:alt="`Evidencia de la visita del subdirector`"
					class="m-auto border rounded-lg"
					:src="`${urlStorage}${file}`"
					width="400" />
			</div>
			<div class="p-5 mt-6 intro-y">
				<CommonFile
					:validator="v$"
					v-model="form.file"
					name="file"
					@change="selectFile"
					@removefile="selectFile"
					class="w-11/12 sm:w-8/12 m-auto cursor-pointer"
					v-if="!disableElements" />
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
	</div>
	<div
		class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly"
		v-else>
		Cargando datos...
	</div>
</template>
