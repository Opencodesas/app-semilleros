<script setup lang="ts">
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue';
import useVuelidate from '@vuelidate/core';
import dayjs from 'dayjs';
import { Header } from 'vue3-easy-data-table';

interface ReportItem {
	id: number;
	name: string;
	type: string;
	pdf: boolean;
	excel: boolean;
	zip: boolean;
}

const router = useRouter();
// const services = exportsService();

/**
 * 1 = Monitors
 * 2 = Managers
 * 3 = Psychosocial's
 * 4 = Others
 */
const tab = ref(1);

const tabOptions = [
	{
		name: 'Otros',
		value: 1,
	},
];

const headers: Header[] = [
	{ text: '#', value: 'id' },
	{ text: 'NOMBRE', value: 'name' },
	{ text: 'ACCIONES', value: 'actions' },
];

// const items = computed((): ReportItem[] => {
const items = computed((): ReportItem[] => {
	switch (tab.value) {
		case 1:
			return [
				{
					id: 1,
					name: 'Informe de Usuarios',
					type: 'users',
					pdf: false,
					excel: true,
					zip: false,
				},
				{
					id: 2,
					name: 'Informe de Información Usuarios',
					type: 'infoUsers',
					pdf: false,
					excel: true,
					zip: false,
				},
				{
					id: 3,
					name: 'Informe Visitas SubDirector',
					type: 'visitSubDirector',
					pdf: false,
					excel: true,
					zip: false,
				},
				{
					id: 4,
					name: 'Informe Actividades Transversales',
					type: 'transversalActivity',
					pdf: false,
					excel: true,
					zip: false,
				},
				{
					id: 5,
					name: 'Informe Visitas Coordinador Regional',
					type: 'coordinatorVisit',
					pdf: false,
					excel: true,
					zip: false,
				},
				{
					id: 6,
					name: 'Informe Visitas Personalizas Psicosocial',
					type: 'customVisit',
					pdf: false,
					excel: true,
					zip: false,
				},
				{
					id: 7,
					name: 'Informe Fichas de Inscripción',
					type: 'inscriptions',
					pdf: false,
					excel: true,
					zip: false,
				},
			];
		default:
			return [
				{
					id: 1,
					name: 'Informe de Default',
					type: 'default',
					pdf: false,
					excel: true,
					zip: false,
				},
			];
	}
});

const form = reactive({
	nac_id: '',
	date_start: '',
	date_end: '',
	status: '',
	type: '',
	user_id: '',
	rol_id: '',
	data: false,
});

const filters_rules = computed(() => ({
	nac_id: {},
	date_start: {},
	date_end: {},
	status: {},
	type: {},
	user_id: {},
	rol_id: {},
	data: {},
}));

const exportExcel = async (type: string) => {
	await reportServices.exportExcel(type, formdataParser(form));
};

const exportPdf = async (type: string) => {
	await reportServices.exportPdf(type, formdataParser(form));
};

const exportZip = async (type: string) => {
	await reportServices.exportZIP(type, formdataParser(form));
};

const searchInfoReport = async () => {
	form.data = true;
	return await reportServices.searchInfoReport(formdataParser(form));
};

const v$ = useVuelidate(filters_rules, form, { $autoDirty: true });

const cleanFilter = () => {
	form.nac_id = '';
	form.date_start = '';
	form.date_end = '';
	form.status = '';
	form.type = '';
	form.user_id = '';
	form.rol_id = '';
	form.data = false;
	v$.value.$reset();
};

const maxDate = computed(() => dayjs().format('YYYY-MM-DD'));

const onExport = (type: string, format: string) => {
	const { data, type: formType, ...rest } = form;

	let routeData = router.resolve({
		name: 'reports.download',
		query: {
			format,
			type,
			...rest,
		},
	});

	window.open(routeData.href, '_blank', 'menubar=no');
};
</script>

<template>
	<div class="intro-y flex items-center mt-8">
		<h2 class="text-lg font-medium mr-auto">Reportes</h2>
	</div>
	<!-- <div class="intro-y box p-5 mt-5">
		<section
			class="flex flex-col lg:grid lg:grid-cols-6 xl:grid xl:grid-cols-6 gap-6 justify-evenly">
			<div
				class="flex flex-col justify-start h-ful lg:col-span-2 xl:col-span-2">
				<label
					for="regular-form-2"
					class="form-label font-bold min-w-max mr-4 mb-2"
					>FECHA RANGO</label
				>
				<div class="grid grid-cols-2 gap-6 w-full intro-x">
					<CommonInput
						type="date"
						tooltip_left="Desde"
						name="date_start"
						:max="maxDate"
						v-model="form.date_start"
						:validator="v$" />
					<CommonInput
						type="date"
						tooltip_left="Hasta"
						name="date_end"
						:max="maxDate"
						v-model="form.date_end"
						:validator="v$" />
				</div>
			</div>
			<div class="flex flex-col justify-start h-full">
				<label
					for="regular-form-2"
					class="form-label font-bold min-w-max mb-2"
					>ACCIONES</label
				>
				<div class="grid grid-cols-2 gap-6 w-full intro-x">
					<Button
						variant="outline-secondary"
						class="w-[4.3rem] text-[#1e293b]"
						type="button"
						@click="cleanFilter">
						Limpiar
					</Button>
				</div>
			</div>
		</section>
	</div> -->
	<div class="intro-y box p-5 mt-5">
		<div class="flex justify-center">
			<RadioGroup
				v-model="tab"
				class="mt-2 w-full">
				<RadioGroupLabel class="sr-only">
					Elige un tipo de Reporte
				</RadioGroupLabel>
				<div class="grid grid-cols-1 gap-3 sm:grid-cols-6">
					<RadioGroupOption
						as="template"
						v-for="option in tabOptions"
						:key="option.name"
						:value="option.value"
						v-slot="{ checked }">
						<div
							:class="[
								checked
									? 'bg-primary border-transparent text-white hover:bg-primary/90'
									: 'border-slate-200 hover:bg-slate-50',
								'btn items-center justify-center text-sm uppercase sm:flex-1 transition duration-200 border shadow-sm inline-flex py-2 px-3 rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none',
							]">
							<RadioGroupLabel as="span">
								{{ option.name }}
							</RadioGroupLabel>
						</div>
					</RadioGroupOption>
				</div>
			</RadioGroup>
		</div>
		<div class="mt-6">
			<DataTable
				:headers="headers"
				:items="items"
				hide-footer>
				<template #header-actions="{ text }">
					<div
						class="flex justify-end"
						v-html="text" />
				</template>
				<template #item-actions="item">
					<div class="flex justify-end gap-x-4">
						<template>
							<Button
								class="btn"
								@click="(_$event) => onExport(item.type, 'pdf')">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="32"
									height="32"
									viewBox="0 0 256 256">
									<path
										fill="currentColor"
										d="M48 136a8 8 0 0 0 8-8V40h88v48a8 8 0 0 0 8 8h48v32a8 8 0 0 0 16 0V88a7.7 7.7 0 0 0-2.4-5.7l-55.9-56A8.1 8.1 0 0 0 152 24H56a16 16 0 0 0-16 16v88a8 8 0 0 0 8 8Zm112-84.7L188.7 80H160ZM64 160H48a8 8 0 0 0-8 8v48a8 8 0 0 0 16 0v-8h8a24 24 0 0 0 0-48Zm0 32h-8v-16h8a8 8 0 0 1 0 16Zm132-16v12h16a8 8 0 0 1 0 16h-16v12a8 8 0 0 1-16 0v-48a8 8 0 0 1 8-8h28a8 8 0 0 1 0 16Zm-68-16h-14a8 8 0 0 0-8 8v48a8 8 0 0 0 8 8h14a32 32 0 0 0 0-64Zm0 48h-6v-32h6a16 16 0 0 1 0 32Z" />
								</svg>
								<span class="ml-2"> Pdf </span>
							</Button>
						</template>
						<template v-if="item.zip">
							<Button
								class="btn"
								@click="(_$event) => onExport(item.type, 'zip')">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="32"
									height="32"
									viewBox="0 0 100 100">
									<path
										fill="currentColor"
										d="M89.148 32.927c.001-.037.011-.07.011-.107a3.972 3.972 0 0 0-1.016-2.642l.02-.011l-7.87-13.627a2.53 2.53 0 0 0-2.468-1.914c-.083 0-.161.016-.242.024v-.024H22.219v.004c-.013 0-.026-.004-.039-.004a2.42 2.42 0 0 0-2.17 1.315l-.008-.005l-8.212 14.231l.015.008a4.068 4.068 0 0 0-.963 2.642c0 .047.012.091.014.138v48.211c-.002.048-.014.093-.014.142c0 2.284 1.817 4.069 4.095 4.066c.043 0 .083-.011.125-.012h69.87c.043.001.083.012.126.012c2.283 0 4.1-1.782 4.1-4.062c0-.036-.01-.068-.011-.104V32.927zM63.413 57.492l-12.391 17.43c-.226.318-.59.505-.98.507h-.004c-.386 0-.751-.187-.977-.503L36.59 57.494a1.201 1.201 0 0 1-.091-1.251c.208-.401.62-.654 1.071-.654h5.833l.001-15.654c0-.667.538-1.205 1.203-1.205h10.789c.665 0 1.204.539 1.204 1.204v15.655h5.83a1.206 1.206 0 0 1 .983 1.903zM18.376 28.733l5.263-9.119h52.67l5.266 9.119H18.376z" />
								</svg>
								<span class="ml-2"> Zip </span>
							</Button>
						</template>
						<template v-if="item.excel">
							<Button
								class="btn"
								@click="(_$event) => onExport(item.type, 'excel')">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="32"
									height="32"
									viewBox="0 0 256 256">
									<path
										fill="currentColor"
										d="M200 24H72a16 16 0 0 0-16 16v24H40a16 16 0 0 0-16 16v96a16 16 0 0 0 16 16h16v24a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V40a16 16 0 0 0-16-16Zm-40 80h40v48h-40Zm40-16h-40v-8a16 16 0 0 0-16-16V40h56ZM72 40h56v24H72ZM40 80h104v96H40Zm32 112h56v24H72Zm72 24v-24a16 16 0 0 0 16-16v-8h40v48Zm-76.4-68.8L82 128l-14.4-19.2a8 8 0 1 1 12.8-9.6L92 114.7l11.6-15.5a8 8 0 0 1 12.8 9.6L102 128l14.4 19.2a8 8 0 0 1-1.6 11.2a7.7 7.7 0 0 1-4.8 1.6a8 8 0 0 1-6.4-3.2L92 141.3l-11.6 15.5A8 8 0 0 1 74 160a7.7 7.7 0 0 1-4.8-1.6a8 8 0 0 1-1.6-11.2Z" />
								</svg>
								<span class="ml-2"> Excel </span>
							</Button>
						</template>
					</div>
				</template>
			</DataTable>
		</div>
	</div>
</template>
