<script setup lang="ts">
import CommonFile from '@/components/CommonFile.vue';
import { filePondValue } from '@/composables/useFilepondEvents';
import { onboardingStore } from '@/stores/onboardingStore';
import { datetime } from '@intlify/core-base';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { fromPairs } from 'lodash';
import Swal from 'sweetalert2';

const { multiple } = useFilepondEvents();
const store = onboardingStore();
const router = useRouter();
const route = useRoute();
const { id } = route.params;

const form = reactive({
	status: '',
	reason: '',
	date_visit: '2023-02-27',
	hour_visit: '09:30',
	observations: 'a pesar de la fuerte lluvia se vivencio buena población.',
	monitor: '',
	municipalities: '',
	event_support: '',
	disciplines: '',
	sidewalk: 'Jamundi',
	sports_scene: 'Cancha Marcella',
	beneficiary_coverage: '8',
	technical: '',
	description: 'se encontró en el escenario, confunde los componentes se le deben reforzar.',
	file: [],
});

const form_rules = computed(() => ({
	status: { required },
	reason: { required: parseInt(form.status) == 2 },
	date_visit: { required },
	hour_visit: { required },
	municipalities: { required },
	sidewalk: { required },
	monitor: { required },
	disciplines: { required },
	sports_scene: { required },
	beneficiary_coverage: { required },
	event_support: { required },
	technical: { required },
	observations: { required },
	description: { required },
	file: { required },
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
	await subdirectorVisitServices.get(id as string).then((response) => {
		if (response?.status == 200) {
			form.observations = response.data.observations;
			form.monitor = response.data.monitor;
			form.municipalities = response.data.municipalities;
			form.event_support = response.data.event_support;
			form.hour_visit = response.data.hour_visit;
			form.disciplines = response.data.disciplines;
			form.sidewalk = response.data.sidewalk;
			form.sports_scene = response.data.sports_scene;
			form.beneficiary_coverage = response.data.beneficiary_coverage;
			form.technical = response.data.technical;
			form.date_visit = response.data.date_visit;
			form.description = response.data.description;
			form.file = response.data.file;
			form.status = response.data.status;
			form.reason = response.data.reason;
			setLoading(false);
		} else {
			setLoading(false);
		}
		return;
	});
};

onMounted(() => {
	form.status = '2';
	form.reason = 'La foto no es una evidencia de la visita';
	form.hour_visit = '9:30'
	form.municipalities = '39';
	form.monitor = '2';
	form.disciplines = '8';
	form.technical = '1';
	form.event_support = '1';
});

const onSubmit = async () => {
	console.log(form.hour_visit);
	form.status = '3';
	form.reason = '';
	const valid = await v$.value.$validate();

	if (valid) {
		await subdirectorVisitServices
			.update(id as string, formdataParser(form))
			.then((response) => {
				if (response?.status == 200 || response?.status == 201) {
					Swal.fire('', 'Modificacion exitosa!', 'success');
					setLoading(true);
					router.push('index').finally(() => {
						setLoading(false);
					});
				} else {
					Swal.fire('', 'No se pudieron obtener los datos', 'error');
				}
			});
		Swal.fire('', 'Modificacion exitosa!', 'success');
		setLoading(true);
		router.push('index').finally(() => {
			setLoading(false);
		});
	} else {
		alerts.validation();
	}
};

function formatDate(arg0: string): string {
throw new Error('Function not implemented.');
}
</script>

<template>
	<div class="flex items-center mt-8 intro-y">
		<div class="flex items-center space-x-4">
			<CommonBackButton
				:to="'subdirector_visit.index'"
				title="Listado" />
			<h2 class="mr-auto text-lg font-medium">Editar visita</h2>
		</div>
	</div>

	<div class="p-5 mt-5 intro-y box">
		<div
			class="mb-6"
			v-if="parseInt(form.status) == 2">
			<p class="text-danger font-bold">Razon de rechazo</p>
			<p>{{ form.reason }}</p>
		</div>

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
				name="municipalities"
				class="cursor-pointer"
				v-model="form.municipalities"
				:validator="v$"
				:options="municipalities" />

			<CommonInput
				type="text"
				placeholder="Ingrese"
				label="Corregimiento / Vereda *"
				name="sidewalk"
				v-model="form.sidewalk"
				:validator="v$" />
			<CommonSelect
				label="Monitor *"
				name="monitor"
				class="cursor-pointer"
				v-model="form.monitor"
				:validator="v$"
				:options="monitorList" />
			<CommonSelect
				label="Disciplinas *"
				name="disciplines"
				class="cursor-pointer"
				v-model="form.disciplines"
				:validator="v$"
				:options="disciplines" />
			<CommonInput
				type="text"
				placeholder="Ingrese"
				label="Escenario deportivo *"
				name="sports_scene"
				v-model="form.sports_scene"
				:validator="v$" />
			<CommonInput
				type="text"
				placeholder="Ingrese"
				label="Cobertura de benificiario *"
				name="beneficiary_coverage"
				v-model="form.beneficiary_coverage"
				:validator="v$" />
			<CommonSelect
				label="Cumple con el desarrollo tecnico del mes *"
				name="technical"
				class="cursor-pointer"
				v-model="form.technical"
				:validator="v$"
				:options="evaluationList" />
			<CommonSelect
				label="Apoyo a eventos *"
				name="event_support"
				class="cursor-pointer"
				v-model="form.event_support"
				:validator="v$"
				:options="event_supportList" />
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
			<FormLabel
				for="evidencia"
				class="flex flex-col w-full sm:flex-row">
				Evidencia *
			</FormLabel>
			<img
				:alt="`Evidencia de la visita del subdirector`"
				class="m-auto border rounded-lg"
				src="/semilleros.png"
				width="400" />
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

	<div class="mt-6 flex justify-end col-span-1 md:col-span-2">
		<Button
			variant="primary"
			class="btn btn-primary"
			@click="onSubmit">
			Actualizar
		</Button>
	</div>
</template>
