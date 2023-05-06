<script setup lang="ts">
import FormSwitch from '@/base-components/Form/FormSwitch';
import { required } from '@/utils/validators';
import useVuelidate from '@vuelidate/core';
import Swal from 'sweetalert2';

const urlStorage = `${import.meta.env.VITE_BASE_URL}/storage/`;
const file = ref([]);
const dataLoaded = ref(false);
const router = useRouter();
const route = useRoute();

const props = defineProps<{
	closeModal: Function;
	item: any;
}>();

const form = reactive({
	id: '',
	status_id: '',
	reject_message: '',
	observations: '',
	user_id: '',
	municipalitie_id: '',
	event_support_id: '',
	hour_visit: '',
	discipline_id: '',
	sidewalk: '',
	sports_scene: '',
	beneficiary_coverage: '',
	evaluation_id: '',
	date_visit: '',
	created_by: '',

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
	status_id: { required },
	reject_message: { required: parseInt(form.status_id) == 2 },
}));

const evaluationList = [
	{ label: 'Aprobado', value: 1 },
	{ label: 'Denegado', value: 2 },
];
const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);
// Consulta todas las disciplinas
const disciplines = asyncComputed(async () => {
    return await getDisciplinesByMonitor(form.user_id)
}, null)

const monitorList = asyncComputed(async () => {
	return await getMonitorByMunicipality(form.municipalitie_id);
}, null);
const statusList = [
	{ label: 'Aprobado', value: 1 },
	{ label: 'Rechazado', value: 4 },
];
const v$ = useVuelidate(form_rules, form);
const getData = () => {
				form.id = props.item.id;
				form.observations = props.item.observations;
				form.municipalitie_id = props.item.municipalities.id;
				form.user_id = props.item.monitor?.id;
				form.event_support_id = props.item.event_supports.id;
				form.hour_visit = props.item.hour_visit;
				form.discipline_id = props.item.disciplines.id;
				form.sidewalk = props.item.sidewalk;
				form.sports_scene = props.item.sports_scene;
				form.beneficiary_coverage = props.item.beneficiary_coverage;
				form.evaluation_id = props.item.evaluations.id;
				form.date_visit = props.item.date_visit;
				form.created_by =
					props.item.creator.name + ' ' + props.item.creator.lastname;
				form.file = props.item.file;
				form.swich_plans_r =
					props.item?.swich_plans_r == '0' ? false : true;
				form.swich_plans_gm_1 =
					props.item?.swich_plans_gm_1 == '0' ? false : true;
				form.swich_plans_gm_2 =
					props.item?.swich_plans_gm_2 == '0' ? false : true;
				form.swich_plans_gm_3 =
					props.item?.swich_plans_gm_3 == '0' ? false : true;
				form.swich_plans_gm_4 =
					props.item?.swich_plans_gm_4 == '0' ? false : true;
				form.swich_plans_gm_5 =
					props.item?.swich_plans_gm_5 == '0' ? false : true;
				form.swich_plans_gm_6 =
					props.item?.swich_plans_gm_6 == '0' ? false : true;
				form.swich_plans_sc_1 =
					props.item?.swich_plans_sc_1 == '0' ? false : true;
				form.swich_plans_sc_2 =
					props.item?.swich_plans_sc_2 == '0' ? false : true;
				form.swich_plans_sc_3 =
					props.item?.swich_plans_sc_3 == '0' ? false : true;
				form.swich_plans_sc_4 =
					props.item?.swich_plans_sc_4 == '0' ? false : true;
				form.swich_plans_mp_1 =
					props.item?.swich_plans_mp_1 == '0' ? false : true;
				form.swich_plans_mp_2 =
					props.item?.swich_plans_mp_2 == '0' ? false : true;
				form.swich_plans_mp_3 =
					props.item?.swich_plans_mp_3 == '0' ? false : true;
				form.swich_plans_mp_4 =
					props.item?.swich_plans_mp_4 == '0' ? false : true;
				form.swich_plans_mp_5 =
					props.item?.swich_plans_mp_5 == '0' ? false : true;
				file.value = props.item.file;
				dataLoaded.value = true;
				console.log(props.item)
				console.log(form);
};

onMounted(() => {
	getData();
});

const event_supportList = [
	{ label: 'Si', value: 1 },
	{ label: 'No', value: 2 },
];
const onSubmit = async () => {
	const valid = await v$.value.$validate();
	console.log(form.status_id);
	if (valid) {
		await methodologistVisitServices
			.update(form.id.toString(), formdataParser(form))
			.then((response) => {
				if (response) {
					if (response.status >= 200 && response.status <= 300) {
						alerts.update();
						setLoading(true);
						props.closeModal();
						setLoading(false);
						window.location.reload();
					}
				}
			});
	} else {
		alerts.validation();
	}
};
const disableElements = true;
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
			name="reject_message"
			class="intro-x box"
			v-model="form.reject_message"
			:validator="v$"
			rows="4"
			v-if="parseInt(form.status_id) == 4" />
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

	<div class="content" v-if="dataLoaded">
		<div class="p-5 mt-5 intro-y box">
		<h3 class="text-lg font-medium leading-6 text-gray-900">Revision</h3>
		<p class="mt-3">
			<span class="font-bold">Metodologo: </span>
			{{ form.created_by }}
		</p>
		<div class="p-5 mt-5 intro-y box">
			<div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
				<CommonInput
					type="date"
					label="Fecha  *"
					name="date_visit"
					v-model="form.date_visit"
					:disabled="disableElements" />
				<CommonInput
					type="time"
					label="Hora  *"
					name="hour_visit"
					v-model="form.hour_visit"
					:disabled="disableElements" />
				<CommonSelect
					label="Municipio *"
					name="municipalitie_id"
					v-model="form.municipalitie_id"
					:options="municipalities"
					:disabled="disableElements" />

				<CommonInput
					label="Corregimiento / Vereda *"
					name="sidewalk"
					placeholder="Ingrese el corregimiento o vereda"
					v-model="form.sidewalk"
					:disabled="disableElements" />

				<CommonSelect
					label="Monitor *"
					name="user_id"
					v-model="form.user_id"
					:options="monitorList"
					:disabled="disableElements" />
				<CommonSelect
					label="Diciplinas *"
					name="discipline_id"
					v-model="form.discipline_id"
					:options="disciplines"
					:disabled="disableElements" />
				<CommonInput
					type="text"
					placeholder="Ingrese el escenario deportivo"
					label="Escenario deportivo *"
					name="sports_scene"
					v-model="form.sports_scene"
					:disabled="disableElements" />
				<CommonInput
					type="number"
					min="0"
					placeholder="Ingrese un numero de beneficiarios"
					label="Cobertura de benificiario *"
					name="beneficiary_coverage"
					v-model="form.beneficiary_coverage"
					:disabled="disableElements" />
				<CommonSelect
					label="Evaluacion *"
					name="evaluation_id"
					v-model="form.evaluation_id"
					:options="evaluationList"
					:disabled="disableElements" />
				<CommonSelect
					label="Apoyo a eventos *"
					name="event_support_id"
					v-model="form.event_support_id"
					:options="event_supportList"
					:disabled="disableElements" />
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
				:checked="form.swich_plans_r"
				:disabled="disableElements" />
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
						:checked="form.swich_plans_sc_1"
						:disabled="disableElements" />
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
						:checked="form.swich_plans_sc_2"
						:disabled="disableElements" />
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
						:checked="form.swich_plans_sc_3"
						:disabled="disableElements" />
					<FormSwitch.Label htmlFor="swich_plans_sc_3">
						Tiene buen manejo de grupo en el desarrollo de las actividades
					</FormSwitch.Label>
				</FormSwitch>

				<FormSwitch>
					<FormSwitch.Input
						name="swich_plans_sc_4"
						id="swich_plans_sc_4"
						type="checkbox"
						v-model="form.swich_plans_sc_4"
						:checked="form.swich_plans_sc_4"
						:disabled="disableElements" />
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
						v-model="form.swich_plans_gm_1"
						:checked="form.swich_plans_gm_1"
						:disabled="disableElements" />
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
						:checked="form.swich_plans_gm_2"
						:disabled="disableElements" />
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
						:checked="form.swich_plans_gm_3"
						:disabled="disableElements" />
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
						:checked="form.swich_plans_gm_4"
						:disabled="disableElements" />
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
						:checked="form.swich_plans_gm_5"
						:disabled="disableElements" />
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
						:checked="form.swich_plans_gm_6"
						:disabled="disableElements" />
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
						:checked="form.swich_plans_mp_1"
						:disabled="disableElements" />
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
						:checked="form.swich_plans_mp_2"
						:disabled="disableElements" />
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
						:checked="form.swich_plans_mp_3"
						:disabled="disableElements" />
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
						:checked="form.swich_plans_mp_4"
						:disabled="disableElements" />
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
						:checked="form.swich_plans_mp_5"
						:disabled="disableElements" />
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
				:disabled="disableElements" />
		</div>
		<div class="p-5 mt-6 intro-y">
			<FormLabel
				for="evidencia"
				class="flex flex-col w-full sm:flex-row">
				Evidencia *
			</FormLabel>
			<img
				:alt="`Evidencia de la visita del metodologo ${form.created_by}`"
				class="m-auto border rounded-lg"
				:src="`${urlStorage}${file}`"
				width="400" />
		</div>
	</div>
	</div>
</template>
