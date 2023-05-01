<script setup lang="ts">
import FormSwitch from '@/base-components/Form/FormSwitch';

import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import Swal from 'sweetalert2';

const urlStorage = `${import.meta.env.VITE_BASE_URL}/storage/`;
const file = ref([]);
const dataLoaded = ref(false);
const route = useRoute();

const form = reactive({
	id: '',
	status_id: '',
	rejection_message: '',
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
	observations: { required },
	user_id: { required },
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

const selectFile = (event: any) => {
	if (event?.target.files.length > 0) {
		form.file = event.target.files[0];
		return;
	}
	form.file = file.value;
};
// Consulta todos los municipios
const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);
// Consulta todas las disciplinas
const monitorList = asyncComputed(async () => {
	return await getMonitorByMunicipality(form.municipalitie_id);
}, null);
// Consulta todas las disciplinas
const disciplines = asyncComputed(async () => {
	return await getDisciplinesByMonitor(form.user_id);
}, null);
const formdataParser = (form: any) => {
	const formData = new FormData();
	Object.keys(form).forEach((key) => {
		formData.append(key, form[key]);
	});
	return formData;
};
/**
 * Para los archivos, vas a desestructurar el objeto form
 *      { file, ...rest } = form
 *      let fd = formdataParser(rest)
 *
 *      for (let i = 0; i < file.length; i++) {
 *          fd.append('file[]', file[i])
 *      }
 *
 *      servicios.create(fd)
 */
const getData = async () => {
	await methodologistVisitServices
		.get(route.params.id as string)
		.then((res) => {
			if (res) {
				if (res?.status == 200 || res?.status == 201) {
					form.id = res.data.items.id;
					form.status_id = res.data.items.status.id;
					form.rejection_message = res.data.items.rejection_message;
					form.observations = res.data.items.observations;
					form.user_id = res.data.items.monitor?.id;
					form.municipalitie_id = res.data.items.municipalities.id;
					form.event_support_id = res.data.items.event_supports.id;
					form.hour_visit = res.data.items.hour_visit;
					form.discipline_id = res.data.items.disciplines.id;
					form.sidewalk = res.data.items.sidewalk;
					form.sports_scene = res.data.items.sports_scene;
					form.beneficiary_coverage = res.data.items.beneficiary_coverage;
					form.evaluation_id = res.data.items.evaluations.id;
					form.date_visit = res.data.items.date_visit;
					form.created_by = res.data.items.creator.name;
					form.file = res.data.items.file;
					form.swich_plans_r =
						res.data.items?.swich_plans_r == '0' ? false : true;
					form.swich_plans_gm_1 =
						res.data.items?.swich_plans_gm_1 == '0' ? false : true;
					form.swich_plans_gm_2 =
						res.data.items?.swich_plans_gm_2 == '0' ? false : true;
					form.swich_plans_gm_3 =
						res.data.items?.swich_plans_gm_3 == '0' ? false : true;
					form.swich_plans_gm_4 =
						res.data.items?.swich_plans_gm_4 == '0' ? false : true;
					form.swich_plans_gm_5 =
						res.data.items?.swich_plans_gm_5 == '0' ? false : true;
					form.swich_plans_gm_6 =
						res.data.items?.swich_plans_gm_6 == '0' ? false : true;
					form.swich_plans_sc_1 =
						res.data.items?.swich_plans_sc_1 == '0' ? false : true;
					form.swich_plans_sc_2 =
						res.data.items?.swich_plans_sc_2 == '0' ? false : true;
					form.swich_plans_sc_3 =
						res.data.items?.swich_plans_sc_3 == '0' ? false : true;
					form.swich_plans_sc_4 =
						res.data.items?.swich_plans_sc_4 == '0' ? false : true;
					form.swich_plans_mp_1 =
						res.data.items?.swich_plans_mp_1 == '0' ? false : true;
					form.swich_plans_mp_2 =
						res.data.items?.swich_plans_mp_2 == '0' ? false : true;
					form.swich_plans_mp_3 =
						res.data.items?.swich_plans_mp_3 == '0' ? false : true;
					form.swich_plans_mp_4 =
						res.data.items?.swich_plans_mp_4 == '0' ? false : true;
					form.swich_plans_mp_5 =
						res.data.items?.swich_plans_mp_5 == '0' ? false : true;
					file.value = res.data.items.file;
					
				} else {
					Swal.fire('', 'No se pudieron obtener los datos', 'error');
				}
			}
		});
};
watch(
	() => form.municipalitie_id,
	() => {
			if(dataLoaded.value){
				form.user_id = '';
			}
	}
);
watch(
	() => form.user_id,
	() => {
			if(dataLoaded.value){
				form.discipline_id = '';
			}
	}
);
onBeforeMount(async() => {
	await getData();
	dataLoaded.value = true;
});

const onSubmit = async () => {
	const valid = await v$.value.$validate();

	if (valid) {
		await methodologistVisitServices
			.update(form.id, formdataParser(form))
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
const disableElements = computed(() => {
	return form.status_id == '4' ? false : true; //id: 4 => Rechazado => REC
});
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

	<div
		class="content"
		v-if="dataLoaded">
		<div class="p-5 mt-5 intro-y box">
			<div
				class="mb-6"
				v-if="form.status_id == '4'">
				<p class="text-danger font-bold">Razon de rechazo</p>
				<p>{{ form.rejection_message }}</p>
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
					name="municipalitie_id"
					v-model="form.municipalitie_id"
					:validator="v$"
					:options="municipalities"
					:disabled="disableElements" />

				<CommonInput
					label="Corregimiento / Vereda *"
					name="sidewalk"
					placeholder="Ingrese el corregimiento o vereda"
					v-model="form.sidewalk"
					:validator="v$"
					:disabled="disableElements" />

				<CommonSelect
					label="Monitor *"
					name="user_id"
					v-model="form.user_id"
					:validator="v$"
					:options="monitorList"
					:disabled="disableElements" />
				<CommonSelect
					label="Diciplinas *"
					name="discipline_id"
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
				<CommonSelect
					label="Evaluacion *"
					name="evaluation_id"
					v-model="form.evaluation_id"
					:validator="v$"
					:options="evaluationList"
					:disabled="disableElements" />
				<CommonSelect
					label="Apoyo a eventos *"
					name="event_support_id"
					v-model="form.event_support_id"
					:validator="v$"
					:options="event_supportList"
					:disabled="disableElements" />
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
					:validator="v$"
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
					:alt="`Evidencia de la visita del metodologo ${form.created_by}`"
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
				variant="primary">
				Descargar visita
			</Button>
		</div>
	</div>
</template>
