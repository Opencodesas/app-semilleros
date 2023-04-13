<script setup lang="ts">
import FormSwitch from '@/base-components/Form/FormSwitch';
import { required } from '@/utils/validators';
import useVuelidate from '@vuelidate/core';



const router = useRouter();
const route = useRoute();

const props = defineProps<{
	closeModal: Function;
	id_review: number;
}>();

const form = reactive({
	id: '',
	methodologist_id: '',
	date_visit: '2023-03-15',
	hour_visit: '10:00',
	sidewalk: 'El Aguila',
	monitor_id: '1',
	discipline_id: '7',
	sports_scene: 'Cancha Principal Punta Brava',
	municipality_id: '5',
	beneficiary_coverage: '9',
	evaluation: '1',
	event_support_id: '1',
	methologist_name: 'Camilo Martinez',
	status_id: '',
	rejection_message: '',

	file: [],

	lesson_plan: true,
	congruent_activity: true,
	develop_technical_sports_component_month: false,
	functional_component_month: false,
	management_development_activities: true,
	puntuality: false,
	personal_presentation: false,
	patient: true,
	discipline: false,
	parent_child_communication: true,
	verbalization: true,
	traditional: false,
	behavioral: false,
	romantic: false,
	constructivist: false,
	globalizer: true,
	observations: 'Mejorar dominio de grupo',
});
const form_rules = computed(() => ({
	status_id: { required },
	rejection_message: { required: parseInt(form.status_id) == 2 },
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
const v$ = useVuelidate(form_rules, form);

const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);

// onMounted(async() => {
// 	await methodologistVisitServices
// 		.get(props.id_review.toString())
// 		.then((response) => {
// 			if (response) {
// 				if (response.status >= 200 && response.status <= 300) {
// 					form.id = response.data.id;
// 					form.methodologist_id = response.data.methodologist_id;
// 					form.date_visit = response.data.date_visit;
// 					form.hour_visit = response.data.hour_visit;
// 					form.sidewalk = response.data.sidewalk;
// 					form.monitor_id = response.data.monitor_id;
// 					form.discipline_id = response.data.discipline_id;
// 					form.sports_scene = response.data.sports_scene;
// 					form.municipality_id = response.data.municipality_id;
// 					form.beneficiary_coverage = response.data.beneficiary_coverage;
// 					form.evaluation = response.data.evaluation;
// 					form.event_support_id = response.data.event_support_id;
// 					form.methologist_name = response.data.methologist_name;
// 					form.file = response.data.file;
// 					form.lesson_plan = response.data.lesson_plan;
// 					form.congruent_activity = response.data.congruent_activity;
// 					form.develop_technical_sports_component_month =
// 						response.data.develop_technical_sports_component_month;
// 					form.functional_component_month =
// 						response.data.functional_component_month;
// 					form.management_development_activities =
// 						response.data.management_development_activities;
// 					form.puntuality = response.data.puntuality;
// 					form.personal_presentation = response.data.personal_presentation;
// 					form.patient = response.data.patient;
// 					form.discipline = response.data.discipline;
// 					form.parent_child_communication =
// 						response.data.parent_child_communication;
// 					form.verbalization = response.data.verbalization;
// 					form.traditional = response.data.traditional;
// 					form.behavioral = response.data.behavioral;
// 					form.romantic = response.data.romantic;
// 					form.constructivist = response.data.constructivist;
// 					form.globalizer = response.data.globalizer;
// 					form.observations = response.data.observations;
// 				}
// 			}
// 		});
// })

const onSubmit = async () => {
	const valid = await v$.value.$validate();

	if (valid) {
		await methodologistVisitServices
			.update(props.id_review.toString(), formdataParser(form))
			.then((response) => {
				if (response) {
					if (response.status >= 200 && response.status <= 300) {
						alerts.update();
						setLoading(true);

						router
							.push({
								name: 'subdirector_methodologist.list',
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
</script>

<template>
	<div class="flex items-center justify-between intro-y">
		<div class="flex items-center space-x-4">
			<h2 class="mr-auto text-lg font-medium">Revisar Visita Metodologo</h2>
		</div>
	</div>

	<div class="p-5 mt-3 intro-y box space-y-5 divide-y">
		<h3 class="text-lg font-medium text-gray-900">Estado *</h3>
		<CommonSelect
			placeholder="Estado *"
			name="status_id"
			v-model="form.status_id"
			:validator="v$"
			:options="statusList" />
		<CommonTextarea
			placeholder="Motivo del rechazo*"
			name="rejection_message"
			class="intro-x box"
			v-model="form.rejection_message"
			:validator="v$"
			rows="4"
			v-if="parseInt(form.status_id) == 2" />
		<div
			class="mt-6 flex justify-end col-span-1 md:col-span-2 border-none gap-1"
			tabindex="1">
			<Button
				variant="danger"
				@click="props.closeModal"
				>Cerrar</Button
			>
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
		<p class="mt-3">
			<span class="font-bold">Metodologo: </span
			>{{ form.methologist_name }}
		</p>
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
				name="municipality_id"
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
				v-model="form.monitor_id"
				:options="monitorList"
				disabled />
			<CommonSelect
				label="Disciplinas *"
				name="disciplines"
				v-model="form.discipline_id"
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
			<CommonSelect
				label="Evaluacion *"
				name="evaluation"
				v-model="form.evaluation"
				:options="evaluationList"
				disabled />
			<CommonSelect
				label="Apoyo a evento *"
				name="evaluation"
				v-model="form.event_support_id"
				:options="apoyoList"
				disabled />
		</div>
		<div class="w-full py-6 mx-auto">
			<h2 class="text-center mr-auto text-lg font-medium">Requerimientos</h2>
		</div>
		<div class="p-5 intro-y box">
			<div
				class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly"></div>

			<FormSwitch.Input
				name="lesson_plan"
				id="lesson_plan"
				type="checkbox"
				v-model="form.lesson_plan"
				disabled />
			<FormSwitch.Label htmlFor="lesson_plan">
				Plan de clases
			</FormSwitch.Label>
		</div>
		<div class="w-full py-6 mx-auto">
			<h2 class="text-center mr-auto text-lg font-medium">Sesión de clase</h2>
		</div>
		<div class="p-5 intro-y box">
			<div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
				<FormSwitch>
					<FormSwitch.Input
						name="congruent_activity"
						id="congruent_activity"
						type="checkbox"
						v-model="form.congruent_activity"
						disabled />
					<FormSwitch.Label htmlFor="congruent_activity">
						Plantea actividades congruentes para el cumplimiento de los
						objetivos de la sesión de clase
					</FormSwitch.Label>
				</FormSwitch>

				<FormSwitch>
					<FormSwitch.Input
						name="develop_technical_sports_component_month"
						id="develop_technical_sports_component_month"
						type="checkbox"
						v-model="form.develop_technical_sports_component_month"
						disabled />
					<FormSwitch.Label htmlFor="develop_technical_sports_component_month">
						Desarrolla el componente técnico deportivo del mes
					</FormSwitch.Label>
				</FormSwitch>
				<FormSwitch>
					<FormSwitch.Input
						name="functional_component_month"
						id="functional_component_month"
						type="checkbox"
						v-model="form.functional_component_month"
						disabled />
					<FormSwitch.Label htmlFor="functional_component_month">
						Desarrolla el componente funcional del mes
					</FormSwitch.Label>
				</FormSwitch>
				<FormSwitch>
					<FormSwitch.Input
						name="management_development_activities"
						id="management_development_activities"
						type="checkbox"
						v-model="form.management_development_activities"
						disabled />
					<FormSwitch.Label htmlFor="management_development_activities">
						Tiene buen manejo de grupo en el desarrollo de las actividades
					</FormSwitch.Label>
				</FormSwitch>
			</div>
		</div>
		<div class="w-full py-6 mx-auto">
			<h2 class="text-center mr-auto text-lg font-medium">
				Generalidades del monitor
			</h2>
		</div>
		<div class="p-5 intro-y box">
			<div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
				<FormSwitch>
					<FormSwitch.Input
						name="puntuality"
						id="puntuality"
						type="checkbox"
						v-model="form.puntuality"
						disabled />
					<FormSwitch.Label htmlFor="puntuality">
						Puntualidad
					</FormSwitch.Label>
				</FormSwitch>

				<FormSwitch>
					<FormSwitch.Input
						name="personal_presentation"
						id="personal_presentation"
						type="checkbox"
						v-model="form.personal_presentation"
						disabled />
					<FormSwitch.Label htmlFor="personal_presentation">
						Presentacion personal - uniforme del Proyecto
					</FormSwitch.Label>
				</FormSwitch>

				<FormSwitch>
					<FormSwitch.Input
						name="patient"
						id="patient"
						type="checkbox"
						v-model="form.patient"
						disabled />
					<FormSwitch.Label htmlFor="patient"> Paciente </FormSwitch.Label>
				</FormSwitch>

				<FormSwitch>
					<FormSwitch.Input
						name="discipline"
						id="discipline"
						type="checkbox"
						v-model="form.discipline"
						disabled />
					<FormSwitch.Label htmlFor="discipline"> Disciplina </FormSwitch.Label>
				</FormSwitch>
				<FormSwitch>
					<FormSwitch.Input
						name="parent_child_communication"
						id="parent_child_communication"
						type="checkbox"
						v-model="form.parent_child_communication"
						disabled />
					<FormSwitch.Label htmlFor="parent_child_communication">
						Comunicación alumnos y padres
					</FormSwitch.Label>
				</FormSwitch>
				<FormSwitch>
					<FormSwitch.Input
						name="verbalization"
						id="verbalization"
						type="checkbox"
						v-model="form.verbalization"
						disabled />
					<FormSwitch.Label htmlFor="verbalization">
						Verbalización clara y simple
					</FormSwitch.Label>
				</FormSwitch>
			</div>
		</div>
		<div class="w-full py-6 mx-auto">
			<h2 class="text-center mr-auto text-lg font-medium">
				Modelo pedagógico del monitor
			</h2>
		</div>
		<div class="p-5 intro-y box">
			<div class="grid grid-cols-3 md:grid md:grid-cols-3 gap-6 justify-evenly">
				<FormSwitch>
					<FormSwitch.Input
						name="traditional"
						id="traditional"
						type="checkbox"
						v-model="form.traditional"
						disabled />
					<FormSwitch.Label htmlFor="traditional">
						Modelo pedagógico del monitor
					</FormSwitch.Label>
				</FormSwitch>

				<FormSwitch>
					<FormSwitch.Input
						name="behavioral"
						id="behavioral"
						type="checkbox"
						v-model="form.behavioral"
						disabled />
					<FormSwitch.Label htmlFor="behavioral"> Conductual </FormSwitch.Label>
				</FormSwitch>

				<FormSwitch>
					<FormSwitch.Input
						name="romantic"
						id="romantic"
						type="checkbox"
						v-model="form.romantic"
						disabled />
					<FormSwitch.Label htmlFor="romantic"> Romantico </FormSwitch.Label>
				</FormSwitch>

				<FormSwitch>
					<FormSwitch.Input
						name="constructivist"
						id="constructivist"
						type="checkbox"
						v-model="form.constructivist"
						disabled />
					<FormSwitch.Label htmlFor="constructivist">
						Constructivista
					</FormSwitch.Label>
				</FormSwitch>

				<FormSwitch>
					<FormSwitch.Input
						name="globalizer"
						id="globalizer"
						type="checkbox"
						v-model="form.globalizer"
						disabled />
					<FormSwitch.Label htmlFor="globalizer">
						Integrador – globalizador
					</FormSwitch.Label>
				</FormSwitch>
			</div>
		</div>
		<div class="p-5 mt-6 intro-y">
			<CommonTextarea
				label="Observaciones *"
				placeholder="Ingrese las observaciones"
				name="observations"
				v-model="form.observations"
				rows="5"
				disabled />
		</div>
		<div class="p-5 mt-6 intro-y">
			<FormLabel
				for="evidencia"
				class="flex flex-col w-full sm:flex-row">
				Evidencia *
			</FormLabel>
			<img
				:alt="`Evidencia del metodologo ${form.methodologist_id}`"
				class="m-auto border rounded-lg"
				src="/semilleros.png"
				width="400" />
		</div>
	</div>
</template>
