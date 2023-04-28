<script setup lang="ts">
import CommonFile from '@/components/CommonFile.vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { onboardingStore } from '@/stores/onboardingStore';
import Swal from 'sweetalert2';


const store = onboardingStore();
const { multiple } = useFilepondEvents();
const urlStorage = `${import.meta.env.VITE_BASE_URL}/storage/`;
const router = useRouter();
const route = useRoute();
const { id } = route.params;

const form = reactive({
	status_id: '',
	rejection_message: '',
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
});
const form_rules = computed(() => ({
	status_id: { required },
	rejection_message: { required: parseInt(form.status_id) == 2 },
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
	created_by: { required },
}));


const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);
const disciplines = asyncComputed(async () => {
	return await getSelect(['disciplines']);
}, null);
const monitorList = [
	{ label: 'Joselito', value: 1 },
	{ label: 'Miguel Torres', value: 2 },
];

const event_supportList = [
	{ label: 'Si', value: 1 },
	{ label: 'No', value: 2 },
];

const evaluationList = [
	{ label: 'Aceptada', value: 1 },
	{ label: 'Rechazada', value: 2 },
];
// Convierte el objeto a FormData
const formdataParser = (form: any) => {
	const formData = new FormData();
	Object.keys(form).forEach((key) => {
		formData.append(key, form[key]);
	});
	return formData;
};
// Guarda la imagen en variable form.file
const selectFile = (e: any) => {
	form.file = e.target.files[0]
};
// Consulta el monitor por municipio
const monitor = asyncComputed(async () => {
	return await getMonitorByMunicipality(form.municipality_id);
}, null);


const v$ = useVuelidate(form_rules, form);

const dataLoaded = ref(false);

let file;
const data = async () => {
	await subdirectorVisitServices.get(id as string).then((response) => {
		if (response?.status == 200) {
			form.created_by = response.data.items.created_by.name;
			form.rejection_message = response.data.items.reject_message;
			form.status_id = response.data.items.status_id;
			form.date_visit = response.data.items.date_visit;
			form.hour_visit = response.data.items.hour_visit;
			form.municipality_id = response.data.items.municipality_id;
			form.sidewalk = response.data.items.sidewalk;
			form.monitor_id = response.data.items.monitor_id;
			form.discipline_id = response.data.items.discipline_id;
			form.sports_scene = response.data.items.sports_scene;
			form.beneficiary_coverage = response.data.items.beneficiary_coverage;
			form.event_support = response.data.items.event_support;
			form.technical = response.data.items.technical;
			form.observations = response.data.items.observations;
			form.description = response.data.items.description;
			form.file = response.data.items.file;
			setLoading(false);
		} else {
			setLoading(false);
		}
	});
};
onMounted(async () => {
	await data();
});

const update = async () => {
	const valid = await v$.value.$validate();
	if (parseInt(form.beneficiary_coverage) < 0) {
		alerts.error('El numero de asistentes no puede ser negativo');
		return;
	}
	if (valid) {
		await subdirectorVisitServices
			.update(id as string, formdataParser(form))
			.then((response) => {
				if (response?.status == 200 || response?.status == 201) {
					Swal.fire('', 'Modificacion exitosa!', 'success');
					setLoading(true);
					router.push({ name: 'technical_director.visits' }).finally(() => {
						setLoading(false);
					});
				} else {
					Swal.fire('', 'No se pudieron obtener los datos', 'error');
				}
			});
	}
};

//Para cuando haya api para descargar el archivo
const download = () => {

}

const disableElements = computed(() => {
	return form.status_id == '4' ? false : true; //id: 4 => Rechazado => REC
})
</script>

<template>
	<div class="flex items-center mt-8 intro-y">
		<div class="flex items-center space-x-4">
			<CommonBackButton :to="'technical_director.visits'" title="Listado" />
			<h2 v-if="form.status_id == '4'" class="mr-auto text-lg font-medium">Editar visita</h2>
			<h2 v-else class="mr-auto text-lg font-medium">Vista visita</h2>
		</div>
	</div>

	<div v-if="dataLoaded" class="p-5 mt-5 intro-y box">
		<div class="mb-6" v-if="form.status_id == '4'">
			<p class="text-danger font-bold">Razon de rechazo</p>
			<p>{{ form.rejection_message }}</p>
		</div>

		<div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
			<CommonInput :disabled="disableElements" type="date" label="Fecha  *" name="date_visit"
				v-model="form.date_visit" :validator="v$" />
			<CommonInput :disabled="disableElements" type="time" label="Hora  *" name="hour_visit" v-model="form.hour_visit"
				:validator="v$" />
			<CommonSelect :disabled="disableElements" label="Municipio *" name="municipality_id" class="cursor-pointer"
				v-model="form.municipality_id" :validator="v$" :options="municipalities" />

			<CommonInput :disabled="disableElements" type="text" placeholder="Ingrese" label="Corregimiento / Vereda *"
				name="sidewalk" v-model="form.sidewalk" :validator="v$" />
			<CommonSelect :disabled="disableElements" label="Monitor *" name="monitor_id" class="cursor-pointer"
				v-model="form.monitor_id" :validator="v$" :options="monitor" />
			<CommonSelect :disabled="disableElements" label="Disciplinas *" name="discipline_id" class="cursor-pointer"
				v-model="form.discipline_id" :validator="v$" :options="disciplines" />
			<CommonInput :disabled="disableElements" type="text" placeholder="Ingrese" label="Escenario deportivo *"
				name="sports_scene" v-model="form.sports_scene" :validator="v$" />
			<CommonInput :disabled="disableElements" type="number" min="0" placeholder="Ingresar el numero de beneficiarios"
				label="Cobertura de benificiario *" name="beneficiary_coverage" v-model="form.beneficiary_coverage"
				:validator="v$" />
			<CommonSelect :disabled="disableElements" label="Cumple con el desarrollo tecnico del mes *" name="technical"
				class="cursor-pointer" v-model="form.technical" :validator="v$" :options="evaluationList" />
			<CommonSelect :disabled="disableElements" label="Apoyo a eventos *" name="event_support" class="cursor-pointer"
				v-model="form.event_support" :validator="v$" :options="event_supportList" />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea :disabled="disableElements" label="Descripcion *" rows="5" placeholder="Ingrese las Descripcion"
				name="description" v-model="form.description" :validator="v$" />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea :disabled="disableElements" label="Observaciones *" rows="5"
				placeholder="Ingrese las observaciones" name="observations" v-model="form.observations" :validator="v$" />
		</div>
		<div class="p-5 mt-6 intro-y">
			<FormLabel for="evidencia" class="flex flex-col w-full sm:flex-row">
				Evidencia *
			</FormLabel>
			<img :alt="`Evidencia de la visita del director`" class="m-auto border rounded-lg" :src="`${urlStorage}/${form.file}`"
				width="400" />
		</div>
		<div class="p-5 mt-6 intro-y">
			<CommonFile v-if="form.status_id == '4'"
				:validator="v$"
				v-model="form.file"
				name="file"
				class="w-11/12 sm:w-8/12 m-auto cursor-pointer"
				@change="selectFile"
				@removefile="form.file = []" />
		</div>
	</div>

	<div class="mt-6 flex justify-center col-span-1 md:col-span-2">
		<Button v-if="form.status_id == '4'" @click="update" variant="primary">
			Editar visita
		</Button>

		<Button v-else-if="form.status_id == '1'" type="button" variant="primary" @click="download">
			Descargar visita
		</Button>
	</div>
</template>