<script setup lang="ts">
import CommonFile from '@/components/CommonFile.vue';
import { filePondValue } from '@/composables/useFilepondEvents';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { onboardingStore } from '@/stores/onboardingStore';
import { technicalDirectorVisitServices } from '@/services/technical_director/technicalDirectorVisitServices';
import Swal from 'sweetalert2';


const store = onboardingStore();
const { multiple } = useFilepondEvents();
const router = useRouter();
const route = useRoute();
const { id } = route.params;

const form = reactive({
	status_id: '',
	rejection_message: '',
	date_visit: '2023-02-27',
	hour_visit: '09:30',
	observations: 'a pesar de la fuerte lluvia se vivencio buena población.',
	monitor_id: '',
	municipality_id: '',
	event_support_id: '',
	discipline_id: '',
	sidewalk: 'Jamundi',
	sports_scene: 'Cancha Marcella',
	beneficiary_coverage: '8',
	technical: '',
	description:
		'se encontró en el escenario, confunde los componentes se le deben reforzar.',
	file: [],
	created_by: store.user.id,
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
	event_support_id: { required },
	technical: { required },
	observations: { required },
	description: { required },
	file: { required },
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
const v$ = useVuelidate(form_rules, form);
const data = async () => {
	await technicalDirectorVisitServices.get(id as string).then((response) => {
		if (response?.status == 200) {
			form.observations = response.data.observations;
			form.monitor_id = response.data.monitor_id;
			form.municipality_id = response.data.municipality_id;
			form.event_support_id = response.data.event_support_id;
			form.hour_visit = response.data.hour_visit;
			form.discipline_id = response.data.discipline_id;
			form.sidewalk = response.data.sidewalk;
			form.sports_scene = response.data.sports_scene;
			form.beneficiary_coverage = response.data.beneficiary_coverage;
			form.technical = response.data.technical;
			form.date_visit = response.data.date_visit;
			form.description = response.data.description;
			form.file = response.data.file;
			form.status_id = response.data.status_id;
			form.rejection_message = response.data.rejection_message;
			setLoading(false);
		} else {
			setLoading(false);
		}
		return;
	});
};
onMounted(() => {
	form.status_id = '2';
	form.rejection_message = 'La foto no es una evidencia de la visita';
	form.hour_visit = '9:30';
	form.municipality_id = '39';
	form.monitor_id = '2';
	form.discipline_id = '8';
	form.technical = '1';
	form.event_support_id = '1';
});
const onSubmit = async () => {
	console.log(form.hour_visit);
	form.status_id = '3';
	form.rejection_message = '';
	const valid = await v$.value.$validate();
	if (valid) {
		await technicalDirectorVisitServices
			.update(id as string, formdataParser(form))
			.then((response) => {
				if (response?.status == 200 || response?.status == 201) {
					Swal.fire('', 'Modificacion exitosa!', 'success');
					setLoading(true);
					router.push('technical_director.visits').finally(() => {
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

const diableElements = computed(() => {
    return form.status_id == '4' ? false : true; //id: 4 => Rechazado => REC
})
</script>

<template>
	<div class="flex items-center mt-8 intro-y">
		<div class="flex items-center space-x-4">
			<CommonBackButton
				:to="'technical_director.visits'"
				title="Listado" />
            <h2 v-if="form.status_id == '4'" class="mr-auto text-lg font-medium">Editar visita personalizada</h2>
            <h2 v-else class="mr-auto text-lg font-medium">Vista visita personalizada</h2>
		</div>
	</div>

	<div class="p-5 mt-5 intro-y box">
		<div
			class="mb-6"
			v-if="parseInt(form.status_id) == 2">
			<p class="text-danger font-bold">Razon de rechazo</p>
			<p>{{ form.rejection_message }}</p>
		</div>

		<div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
			<CommonInput
                :disabled="diableElements"
				type="date"
				label="Fecha  *"
				name="date_visit"
				v-model="form.date_visit"
				:validator="v$" />
			<CommonInput
                :disabled="diableElements"
				type="time"
				label="Hora  *"
				name="hour_visit"
				v-model="form.hour_visit"
				:validator="v$" />
			<CommonSelect
                :disabled="diableElements"
				label="Municipio *"
				name="municipality_id"
				class="cursor-pointer"
				v-model="form.municipality_id"
				:validator="v$"
				:options="municipalities" />

			<CommonInput
                :disabled="diableElements"
				type="text"
				placeholder="Ingrese"
				label="Corregimiento / Vereda *"
				name="sidewalk"
				v-model="form.sidewalk"
				:validator="v$" />
			<CommonSelect
                :disabled="diableElements"
				label="Monitor *"
				name="monitor_id"
				class="cursor-pointer"
				v-model="form.monitor_id"
				:validator="v$"
				:options="monitorList" />
			<CommonSelect
                :disabled="diableElements"
				label="Disciplinas *"
				name="discipline_id"
				class="cursor-pointer"
				v-model="form.discipline_id"
				:validator="v$"
				:options="disciplines" />
			<CommonInput
                :disabled="diableElements"
				type="text"
				placeholder="Ingrese"
				label="Escenario deportivo *"
				name="sports_scene"
				v-model="form.sports_scene"
				:validator="v$" />
			<CommonInput
                :disabled="diableElements"
				type="number"
				min="0"
				placeholder="Ingresar el numero de beneficiarios"
				label="Cobertura de benificiario *"
				name="beneficiary_coverage"
				v-model="form.beneficiary_coverage"
				:validator="v$" />
			<CommonSelect
                :disabled="diableElements"
				label="Cumple con el desarrollo tecnico del mes *"
				name="technical"
				class="cursor-pointer"
				v-model="form.technical"
				:validator="v$"
				:options="evaluationList" />
			<CommonSelect
                :disabled="diableElements"
				label="Apoyo a eventos *"
				name="event_support_id"
				class="cursor-pointer"
				v-model="form.event_support_id"
				:validator="v$"
				:options="event_supportList" />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea
                :disabled="diableElements"
				label="Descripcion *"
				rows="5"
				placeholder="Ingrese las Descripcion"
				name="description"
				v-model="form.description"
				:validator="v$" />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea
                :disabled="diableElements"
				label="Observaciones *"
				rows="5"
				placeholder="Ingrese las observaciones"
				name="observations"
				v-model="form.observations"
				:validator="v$" />
		</div>
		<div class="p-5 mt-6 intro-y">
			<FormLabel
				for="evidencia"
				class="flex flex-col w-full sm:flex-row">
				Evidencia *
			</FormLabel>
			<img
				:alt="`Evidencia de la visita del director`"
				class="m-auto border rounded-lg"
				src="/semilleros.png"
				width="400" />
		</div>
		<div class="p-5 mt-6 intro-y">
			<CommonFile
                v-if="parseInt(form.status_id) == 4"
				:validator="v$"
				v-model="form.file"
				name="file"
				class="w-11/12 sm:w-8/12 m-auto cursor-pointer"
				@addfile="(error: any, value: filePondValue) => { form.file = multiple.addfile({ error, value }, form.file) as never[] }"
				@removefile="(error: any, value: filePondValue) => { form.file = multiple.removefile({ error, value }, form.file) as never[] }" />
		</div>
	</div>

	<div class="mt-6 flex justify-end col-span-1 md:col-span-2">
		<Button v-if="form.status_id == '4'" type="submit" variant="primary">
            Editar visita
        </Button>

        <Button v-else-if="form.status_id == '1'" type="button" variant="primary" @click="download">
            Descargar visita
        </Button>
	</div>
</template>