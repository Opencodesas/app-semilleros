<script setup lang="ts">
import FormSwitch from '@/base-components/Form/FormSwitch';
import { onboardingStore } from '@/stores/onboardingStore';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const store = onboardingStore();
const { multiple } = useFilepondEvents();

const form = reactive({
	observations: '',
	monitor_id: '',
	municipalitie_id: '',
	event_support_id: '',
	hour_visit: '',
	discipline_id: '',
	sidewalk: '',
	sports_scene: '',
	beneficiary_coverage: '',
	evaluation_id: '',
	date_visit: '',

	file: [],

	swich_plans_r: false,
	swich_plans_sc_1: false,
	swich_plans_sc_2: false,
	swich_plans_sc_3: false,
	swich_plans_sc_4: false,
	swich_plans_gm_1: false,
	swich_plans_gm_2: false,
	swich_plans_gm_3: false,
	swich_plans_gm_4: false,
	swich_plans_gm_5: false,
	swich_plans_gm_6: false,
	swich_plans_mp_1: false,
	swich_plans_mp_2: false,
	swich_plans_mp_3: false,
	swich_plans_mp_4: false,
	swich_plans_mp_5: false,
});

const form_rules = computed(() => ({
	observations: { required },
	monitor_id: { required },
	municipalitie_id: { required },
	event_support_id: { required },
	hour_visit: { required },
	discipline_id: { required },
	sidewalk: { required },
	sports_scene: { required },
	beneficiary_coverage: { required },
	evaluation_id: { required },
	date_visit: { required },

	file: [],

	swich_plans_r: { required },
	swich_plans_sc_1: { required },
	swich_plans_sc_2: { required },
	swich_plans_sc_3: { required },
	swich_plans_sc_4: { required },
	swich_plans_gm_1: { required },
	swich_plans_gm_2: { required },
	swich_plans_gm_3: { required },
	swich_plans_gm_4: { required },
	swich_plans_gm_5: { required },
	swich_plans_gm_6: { required },
	swich_plans_mp_1: { required },
	swich_plans_mp_2: { required },
	swich_plans_mp_3: { required },
	swich_plans_mp_4: { required },
	swich_plans_mp_5: { required },
}));

const event_supportList = [
	{ label: 'Si', value: 1 },
	{ label: 'No', value: 2 },
];
const evaluationList = [
	{ label: 'Aceptada', value: 1 },
	{ label: 'Rechazada', value: 2 },
];
const v$ = useVuelidate(form_rules, form);

const router = useRouter();

// Consulta todos los municipios
const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);
// Consulta todos los monitores por municipio
const monitor = asyncComputed(async () => {
	return await getMonitorByMunicipality(form.municipalitie_id);
}, null);
// Consulta todas las disciplinas
const disciplines = asyncComputed(async () => {
	return await getDisciplinesByMonitor(form.monitor_id);
}, null);
const selectFile = (event: any) => {
	form.file = event.target.files[0];
};

/**
 * Para los archivos, vas a desestructurar el objeto form
 *      { file, ...rest } = form
 *      let fd = formdataParser(rest)
 *
 *      for (let i = 0; i < files.length; i++) {
 *          fd.append('files[]', files[i])
 *      }
 *
 *      servicios.create(fd)
 */
watch(
	() => form.municipalitie_id,
	() => {
		form.monitor_id = '';
	}
);
watch(
	() => form.monitor_id,
	() => {
		form.discipline_id = '';
	}
);
const formdataParser = (form: any) => {
	const formData = new FormData();
	Object.keys(form).forEach((key) => {
		formData.append(key, form[key]);
	});
	return formData;
};
const onSubmit = async () => {
	const valid = await v$.value.$validate();

	if (valid) {
		await methodologistVisitServices
			.create(formdataParser(form))
			.then((response) => {
				if (response) {
					if (response.status >= 200 && response.status <= 300) {
						alerts.create();
						setLoading(true);
						router.push({ name: 'methodologist_visits.index' }).finally(() => {
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
	<div class="flex items-center mt-8 intro-y">
		<div class="flex items-center space-x-4">
			<CommonBackButton
				to="methodologist_visits.index"
				title="Listado" />
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
				name="municipalitie_id"
				v-model="form.municipalitie_id"
				:validator="v$"
				:options="municipalities" />

			<CommonInput
				label="Corregimiento / Vereda *"
				name="sidewalk"
				placeholder="Ingrese el corregimiento o vereda"
				v-model="form.sidewalk"
				:validator="v$" />

			<CommonSelect
				label="Monitor *"
				name="monitor_id"
				v-model="form.monitor_id"
				:validator="v$"
				:options="monitor" />
			<CommonSelect
				label="Diciplinas *"
				name="discipline_id"
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
			<CommonSelect
				label="Evaluacion *"
				name="evaluation_id"
				v-model="form.evaluation_id"
				:validator="v$"
				:options="evaluationList" />
			<CommonSelect
				label="Apoyo a eventos *"
				name="event_support_id"
				v-model="form.event_support_id"
				:validator="v$"
				:options="event_supportList" />

			<!--  -->
		</div>
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
			:validator="v$" />
		<FormSwitch.Label htmlFor="swich_plans"> Plan de clases </FormSwitch.Label>
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
					v-model="form.swich_plans_sc_1" />
				<FormSwitch.Label htmlFor="swich_plans_sc_1">
					Plantea actividades congruentes para el cumplimiento de los objetivos
					de la sesión de clase
				</FormSwitch.Label>
			</FormSwitch>

			<FormSwitch>
				<FormSwitch.Input
					name="swich_plans_sc_2"
					id="swich_plans_sc_2"
					type="checkbox"
					v-model="form.swich_plans_sc_2" />
				<FormSwitch.Label htmlFor="swich_plans_sc_2">
					Desarrolla el componente técnico deportivo del mes
				</FormSwitch.Label>
			</FormSwitch>

			<FormSwitch>
				<FormSwitch.Input
					name="swich_plans_sc_3"
					id="swich_plans_sc_3"
					type="checkbox"
					v-model="form.swich_plans_sc_3" />
				<FormSwitch.Label htmlFor="swich_plans_sc_3">
					Tiene buen manejo de grupo en el desarrollo de las actividades
				</FormSwitch.Label>
			</FormSwitch>

			<FormSwitch>
				<FormSwitch.Input
					name="swich_plans_sc_4"
					id="swich_plans_sc_4"
					type="checkbox"
					v-model="form.swich_plans_sc_4" />
				<FormSwitch.Label htmlFor="swich_plans_sc_4">
					Desarrolla el componente funcional del mes
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
					v-model="form.swich_plans_gm_1" />
				<FormSwitch.Label htmlFor="swich_plans_gm_1">
					Puntualidad
				</FormSwitch.Label>
			</FormSwitch>

			<FormSwitch>
				<FormSwitch.Input
					name="swich_plans_gm_2"
					id="swich_plans_gm_2"
					type="checkbox"
					v-model="form.swich_plans_gm_2" />
				<FormSwitch.Label htmlFor="swich_plans_gm_2">
					Presentacion personal - uniforme del Proyecto
				</FormSwitch.Label>
			</FormSwitch>

			<FormSwitch>
				<FormSwitch.Input
					name="swich_plans_gm_3"
					id="swich_plans_gm_3"
					type="checkbox"
					v-model="form.swich_plans_gm_3" />
				<FormSwitch.Label htmlFor="swich_plans_gm_3">
					Paciente
				</FormSwitch.Label>
			</FormSwitch>

			<FormSwitch>
				<FormSwitch.Input
					name="swich_plans_gm_4"
					id="swich_plans_gm_4"
					type="checkbox"
					v-model="form.swich_plans_gm_4" />
				<FormSwitch.Label htmlFor="swich_plans_gm_4">
					Disciplina
				</FormSwitch.Label>
			</FormSwitch>
			<FormSwitch>
				<FormSwitch.Input
					name="swich_plans_gm_5"
					id="swich_plans_gm_5"
					type="checkbox"
					v-model="form.swich_plans_gm_5" />
				<FormSwitch.Label htmlFor="swich_plans_gm_5">
					Comunicación alumnos y padres
				</FormSwitch.Label>
			</FormSwitch>
			<FormSwitch>
				<FormSwitch.Input
					name="swich_plans_gm_6"
					id="swich_plans_gm_6"
					type="checkbox"
					v-model="form.swich_plans_gm_6" />
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
					v-model="form.swich_plans_mp_1" />
				<FormSwitch.Label htmlFor="swich_plans_mp_1">
					Modelo pedagógico del monitor
				</FormSwitch.Label>
			</FormSwitch>

			<FormSwitch>
				<FormSwitch.Input
					name="swich_plans_mp_2"
					id="swich_plans_mp_2"
					type="checkbox"
					v-model="form.swich_plans_mp_2" />
				<FormSwitch.Label htmlFor="swich_plans_mp_2">
					Conductual
				</FormSwitch.Label>
			</FormSwitch>

			<FormSwitch>
				<FormSwitch.Input
					name="swich_plans_mp_3"
					id="swich_plans_mp_3"
					type="checkbox"
					v-model="form.swich_plans_mp_3" />
				<FormSwitch.Label htmlFor="swich_plans_mp_3">
					Romantico
				</FormSwitch.Label>
			</FormSwitch>

			<FormSwitch>
				<FormSwitch.Input
					name="swich_plans_mp_4"
					id="swich_plans_mp_4"
					type="checkbox"
					v-model="form.swich_plans_mp_4" />
				<FormSwitch.Label htmlFor="swich_plans_mp_4">
					Constructivista
				</FormSwitch.Label>
			</FormSwitch>

			<FormSwitch>
				<FormSwitch.Input
					name="swich_plans_mp_5"
					id="swich_plans_mp_5"
					type="checkbox"
					v-model="form.swich_plans_mp_5" />
				<FormSwitch.Label htmlFor="swich_plans_mp_5">
					Integrador – globalizador
				</FormSwitch.Label>
			</FormSwitch>
		</div>
	</div>
	<div class="p-5 mt-6 intro-y box">
		<CommonTextarea
			label="Observaciones *"
			rows="5"
			placeholder="Ingrese las observaciones"
			name="observations"
			v-model="form.observations"
			:validator="v$" />
	</div>
	<div class="p-5 mt-6 intro-y box">
		<CommonFile
			:validator="v$"
			v-model="form.file"
			name="file"
			class="w-11/12 sm:w-8/12 m-auto cursor-pointer"
			@change="selectFile"
			@removefile="form.file = []" />
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
