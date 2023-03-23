<script setup lang="ts">
import FormSwitch from '@/base-components/Form/FormSwitch';
import { required } from '@/utils/validators';
import useVuelidate from '@vuelidate/core';
const { isProvider } = useProvider();
const router = useRouter();
const route = useRoute();
const { id } = route.params;

const form = reactive({
	status: '',
	reason: '',
	name_methodologist: 'Camilo Martinez',
	date_visit: '2023-03-15',
	hour_visit: '10:00',
	municipality: '5',
	sidewalk: 'El Aguila',
	monitor: '1',
	sports_scene: 'Cancha Principal Punta Brava',
	observations: 'Mejorar dominio de grupo',
	disciplines: '7',
	evaluation: '1',
	beneficiary: '9',

	file: [],

	swich_plans_r: true,
	swich_plans_sc_1: true,
	swich_plans_sc_2: false,
	swich_plans_sc_3: false,
	swich_plans_sc_4: true,
	swich_plans_gm_1: false,
	swich_plans_gm_2: false,
	swich_plans_gm_3: true,
	swich_plans_gm_4: false,
	swich_plans_gm_5: true,
	swich_plans_gm_6: true,
	swich_plans_mp_1: false,
	swich_plans_mp_2: false,
	swich_plans_mp_3: false,
	swich_plans_mp_4: false,
	swich_plans_mp_5: true,
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
							router.push('').finally(() => {
								setLoading(false);
							});
						} else {
							router.push('').finally(() => {
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
				:to="'subdirector_methodologist.list'"
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
				v-model="form.municipality"
				:options="municipalities"
				disabled />
			<CommonInput
				type="text"
				placeholder="Corregimiento / Vereda"
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
				v-model="form.disciplines"
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
				v-model="form.beneficiary"
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
				v-model="form.evaluation"
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
				name="swich_plans"
				id="swich_plans"
				type="checkbox"
				v-model="form.swich_plans_r"
				disabled />
			<FormSwitch.Label htmlFor="swich_plans">
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
						name="swich_plans_sc_1"
						id="swich_plans_sc_1"
						type="checkbox"
						v-model="form.swich_plans_sc_1"
						disabled />
					<FormSwitch.Label htmlFor="swich_plans_sc_1">
						Plantea actividades congruentes para el cumplimiento de los
						objetivos de la sesión de clase
					</FormSwitch.Label>
				</FormSwitch>

				<FormSwitch>
					<FormSwitch.Input
						name="swich_plans_sc_2"
						id="swich_plans_sc_2"
						type="checkbox"
						v-model="form.swich_plans_sc_2"
						disabled />
					<FormSwitch.Label htmlFor="swich_plans_sc_2">
						Desarrolla el componente técnico deportivo del mes
					</FormSwitch.Label>
				</FormSwitch>
				<FormSwitch>
					<FormSwitch.Input
					name="swich_plans_sc_3"
					id="swich_plans_sc_3"
					type="checkbox"
					v-model="form.swich_plans_sc_3"
					disabled />
					<FormSwitch.Label htmlFor="swich_plans_sc_3">
						Desarrolla el componente funcional del mes
					</FormSwitch.Label>
				</FormSwitch>
				<FormSwitch>
					<FormSwitch.Input
						name="swich_plans_sc_4"
						id="swich_plans_sc_4"
						type="checkbox"
						v-model="form.swich_plans_sc_4"
						disabled />
					<FormSwitch.Label htmlFor="swich_plans_sc_4">
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
						name="swich_plans_gm_1"
						id="swich_plans_gm_1"
						type="checkbox"
						v-model="form.swich_plans_gm_1"
						disabled />
					<FormSwitch.Label htmlFor="swich_plans_gm_1">
						Puntualidad
					</FormSwitch.Label>
				</FormSwitch>

				<FormSwitch>
					<FormSwitch.Input
						name="swich_plans_gm_2"
						id="swich_plans_gm_2"
						type="checkbox"
						v-model="form.swich_plans_gm_2"
						disabled />
					<FormSwitch.Label htmlFor="swich_plans_gm_2">
						Presentacion personal - uniforme del Proyecto
					</FormSwitch.Label>
				</FormSwitch>

				<FormSwitch>
					<FormSwitch.Input
						name="swich_plans_gm_3"
						id="swich_plans_gm_3"
						type="checkbox"
						v-model="form.swich_plans_gm_3"
						disabled />
					<FormSwitch.Label htmlFor="swich_plans_gm_3">
						Paciente
					</FormSwitch.Label>
				</FormSwitch>

				<FormSwitch>
					<FormSwitch.Input
						name="swich_plans_gm_4"
						id="swich_plans_gm_4"
						type="checkbox"
						v-model="form.swich_plans_gm_4"
						disabled />
					<FormSwitch.Label htmlFor="swich_plans_gm_4">
						Disciplina
					</FormSwitch.Label>
				</FormSwitch>
				<FormSwitch>
					<FormSwitch.Input
						name="swich_plans_gm_5"
						id="swich_plans_gm_5"
						type="checkbox"
						v-model="form.swich_plans_gm_5"
						disabled />
					<FormSwitch.Label htmlFor="swich_plans_gm_5">
						Comunicación alumnos y padres
					</FormSwitch.Label>
				</FormSwitch>
				<FormSwitch>
					<FormSwitch.Input
						name="swich_plans_gm_6"
						id="swich_plans_gm_6"
						type="checkbox"
						v-model="form.swich_plans_gm_6"
						disabled />
					<FormSwitch.Label htmlFor="swich_plans_gm_6">
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
						name="swich_plans_mp_1"
						id="swich_plans_mp_1"
						type="checkbox"
						v-model="form.swich_plans_mp_1"
						disabled />
					<FormSwitch.Label htmlFor="swich_plans_mp_1">
						Modelo pedagógico del monitor
					</FormSwitch.Label>
				</FormSwitch>

				<FormSwitch>
					<FormSwitch.Input
						name="swich_plans_mp_2"
						id="swich_plans_mp_2"
						type="checkbox"
						v-model="form.swich_plans_mp_2"
						disabled />
					<FormSwitch.Label htmlFor="swich_plans_mp_2">
						Conductual
					</FormSwitch.Label>
				</FormSwitch>

				<FormSwitch>
					<FormSwitch.Input
						name="swich_plans_mp_3"
						id="swich_plans_mp_3"
						type="checkbox"
						v-model="form.swich_plans_mp_3"
						disabled />
					<FormSwitch.Label htmlFor="swich_plans_mp_3">
						Romantico
					</FormSwitch.Label>
				</FormSwitch>

				<FormSwitch>
					<FormSwitch.Input
						name="swich_plans_mp_4"
						id="swich_plans_mp_4"
						type="checkbox"
						v-model="form.swich_plans_mp_4"
						disabled />
					<FormSwitch.Label htmlFor="swich_plans_mp_4">
						Constructivista
					</FormSwitch.Label>
				</FormSwitch>

				<FormSwitch>
					<FormSwitch.Input
						name="swich_plans_mp_5"
						id="swich_plans_mp_5"
						type="checkbox"
						v-model="form.swich_plans_mp_5"
						disabled />
					<FormSwitch.Label htmlFor="swich_plans_mp_5">
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
			<img :alt="`Evidencia del metodologo ${form.name_methodologist}`"
				class="m-auto border rounded-lg"
				src="/semilleros.png"
				width="400" />
		</div>
	</div>
</template>
