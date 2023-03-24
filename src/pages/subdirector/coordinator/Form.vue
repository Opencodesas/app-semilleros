<script setup lang="ts">
import { required } from '@/utils/validators';
import useVuelidate from '@vuelidate/core';
const { isProvider } = useProvider();
const router = useRouter();
const route = useRoute();
const { id } = route.params;

const form = reactive({
	id: '',
	status_id: '',
	reason: '',
	coordinator_id: 'Camilo Martinez',
	date_visit: '2023-03-15',
	hour_visit: '10:00',
	sidewalk: 'El Aguila',
	monitor_id: 'Miguel Torres',
	disciplines_id: '7',
	sports_scene: 'Cancha Principal Punta Brava',
	municipality_id: '5',
	beneficiary_coverage: '9',
	description: 'Mejorar dominio de grupo',
	observations: 'Mejorar dominio de grupo',

	monitor: '1',

	file: [],
});
const formStatus = reactive({
	status: '',
	reason: '',
});
const form_rules = computed(() => ({
	status: { required },
	reason: { required: parseInt(formStatus.status) == 2 },
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
	{ label: 'Rechazado', value: 2 },
];
const v$ = useVuelidate(form_rules, formStatus);

const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);

const onSubmit = async () => {
	formStatus.status == '1' && (formStatus.reason = '');
	const valid = await v$.value.$validate();

	if (valid) {
		await methodologistVisitServices
			.update(id.toString(), formdataParser(formStatus))
			.then((response) => {
				if (response) {
					if (response.status >= 200 && response.status <= 300) {
						alerts.create();
						setLoading(true);

						if (isProvider('assistants')) {
							router
								.push({
									name: 'assistants_methodologist.list',
								})
								.finally(() => {
									setLoading(false);
								});
						} else {
							router
								.push({
									name: 'subdirector_methodologist.list',
								})
								.finally(() => {
									setLoading(false);
								});
						}
					}
				}
			});
	} else {
		alerts.validation();
	}
};
</script>

<template>
	<div class="flex items-center justify-between mt-8 intro-y">
		<div class="flex items-center space-x-4">
			<CommonBackButton
				:to="'subdirector_coordinator.list'"
				title="Listado" />
			<h2 class="mr-auto text-lg font-medium">Revisar Visita</h2>
		</div>
	</div>

	<div class="p-5 mt-5 intro-y box space-y-5 divide-y">
		<h3 class="text-lg font-medium text-gray-900">ESTADO *</h3>
		<CommonSelect
			placeholder="Estado *"
			name="status"
			v-model="formStatus.status"
			:validator="v$"
			:options="statusList" />
		<CommonTextarea
			placeholder="Motivo del rechazo*"
			name="reason"
			class="intro-x box"
			v-model="formStatus.reason"
			:validator="v$"
			rows="4"
			v-if="parseInt(formStatus.status) == 2" />
		<div class="mt-6 flex justify-end col-span-1 md:col-span-2 border-none">
			<Button
				variant="primary"
				class="btn btn-primary"
				@click="onSubmit">
				Enviar
			</Button>
		</div>
	</div>

	<div class="p-5 mt-5 intro-y box">
		<h3 class="text-lg font-medium leading-6 text-gray-900">Revision</h3>

		<div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
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
				v-model="form.municipality_id"
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
				name="monitor"
				v-model="form.monitor"
				:options="monitorList"
				disabled />
			<CommonSelect
				label="Disciplinas *"
				name="disciplines"
				v-model="form.disciplines_id"
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
				:disabled="true"  />
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
					src="/semilleros.png"
					width="400" />
			</div>
		</div>
	</div>
</template>
