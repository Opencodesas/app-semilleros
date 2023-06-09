<script setup lang="ts">
import CommonFile from '@/components/CommonFile.vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import Swal from 'sweetalert2';


const router = useRouter();

const form = reactive({
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
});

const form_rules = computed(() => ({
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
}));

//consulta todos los monitores por la region del usuario autenticado
const monitor = asyncComputed(async () => {
	return await getMonitorByAuth();
}, null);
// Consulta todos los municipios	
const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities'], true);
}, null);
// Consulta todas las disciplinas
const disciplines = asyncComputed(async () => {
    return await getDisciplinesByMonitor(form.user_id)
}, null)

watch(() => form.municipalitie_id, () => {
    form.user_id = '';  
})

watch(() => form.user_id, () => {
    form.discipline_id = '';
})
// Consulta todos los monitores por municipio
// const monitor = asyncComputed(async () => {
// 	return await getMonitorByMunicipality(form.municipalitie_id)
// }, null);

const v$ = useVuelidate(form_rules, form);


const selectFile = (event: any) => {
	form.file = event.target.files[0];
}

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
		await coordinatorVisitServices
			.create(formdataParser(form))
			.then((response) => {
				if (response) {
					if (response.status >= 200 && response.status <= 300) {
						alerts.create();
						setLoading(true);
						router.push({ name: 'coordinator.index' }).finally(() => {
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
				:options="monitor" />
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
				@change="selectFile"
				@removefile="form.file = []"
				/>
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
