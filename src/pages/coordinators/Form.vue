<script setup lang="ts">
import CommonFile from '@/components/CommonFile.vue';
import { filePondValue } from '@/composables/useFilepondEvents';
import { onboardingStore } from '@/stores/onboardingStore';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import Swal from 'sweetalert2';

const { multiple } = useFilepondEvents();
const store = onboardingStore();
const router = useRouter();
const route = useRoute();

const form = reactive({
	rejection_message: '',
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
	created_by: store.user.id,
	status_id: '2',
});

const form_rules = computed(() => ({
	status_id: { required },
	rejection_message: {},
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
	created_by: {},
}));

const disciplinesList = ref([]);
const monitorList = [
	{ label: 'Joselito', value: 1 },
	{ label: 'Miguelito', value: 2 },
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

const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);

const disciplines = asyncComputed(async () => {
	return await getSelect(['disciplines']);
}, null);

const onSubmit = async () => {
	console.log(form);
	const valid = await v$.value.$validate();
	if (valid) {
		await coordinatorVisitServices
			.create(formdataParser(form))
			.then((response) => {
				if (response) {
					if (response.status >= 200 && response.status <= 300) {
						alerts.create();
						setLoading(true);
						router.push({ name: 'coordinator_visit.index' }).finally(() => {
							setLoading(false);
						});
					}
				} else {
					Swal.fire('', 'No se pudo crear', 'error');
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
			<h2 class="mr-auto text-lg font-medium">Registrar visita</h2>
		</div>
	</div>

	<div class="p-5 mt-5 intro-y box">
		<div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
			<CommonInput
				type="date"
				label="Fecha  *"
				name="date_visit"
				v-model="form.date_visit"
				:validator="v$" />
			<CommonInput
				type="time"
				label="Hora  *"
				name="hour_visit"
				v-model="form.hour_visit"
				:validator="v$" />
			<CommonSelect
				label="Municipio *"
				placeholder="Seleccione"
				name="municipalitie_id"
				class="cursor-pointer"
				v-model="form.municipalitie_id"
				:validator="v$"
				:options="municipalities" />

			<CommonInput
				type="text"
				placeholder="Ingrese el corregimiento o vereda"
				label="Corregimiento / Vereda *"
				name="sidewalk"
				v-model="form.sidewalk"
				:validator="v$" />
			<CommonSelect
				label="Monitor *"
				name="user_id"
				placeholder="Seleccione"
				class="cursor-pointer"
				v-model="form.user_id"
				:validator="v$"
				:options="monitorList" />
			<CommonSelect
				label="Disciplinas *"
				placeholder="Seleccione"
				name="discipline_id"
				class="cursor-pointer"
				v-model="form.discipline_id"
				:validator="v$"
				:options="disciplines" />
			<CommonInput
				type="text"
				placeholder="Ingrese el escenario deportivo"
				label="Escenario deportivo *"
				name="sports_scene"
				v-model="form.sports_scene"
				:validator="v$" />
			<CommonInput
				type="number"
				min="0"
				placeholder="Ingrese un numero de beneficiarios"
				label="Cobertura de benificiario *"
				name="beneficiary_coverage"
				v-model="form.beneficiary_coverage"
				:validator="v$" />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea
				label="Descripcion *"
				rows="5"
				placeholder="Ingrese las Descripcion"
				name="description"
				v-model="form.description"
				:validator="v$" />
		</div>
		<div class="mt-6 intro-y">
			<CommonTextarea
				label="Observaciones *"
				rows="5"
				placeholder="Ingrese las observaciones"
				name="observations"
				v-model="form.observations"
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

	<div class="mt-6 flex justify-center col-span-1 md:col-span-2">
		<Button
			variant="primary"
			class="btn btn-primary"
			@click="onSubmit">
			Registrar
		</Button>
	</div>
</template>
