<script setup lang="ts">
import { email, required, requiredIf } from '@vuelidate/validators';
import { onMounted, ref } from 'vue';
//import { useUser } from '@/stores/user'
import { useVuelidate } from '@vuelidate/core';
import Swal from 'sweetalert2';
import { useRoute } from 'vue-router';

//const user_store = useUser();

const router = useRouter();
const route = useRoute();

const form = reactive({
	address: '',
	document_number: '',
	document_type: '',
	email: '',
	gender: '',
	lastname: '',
	municipalities: '',
	name: '',
	period: '',
	phone: '',
	roles: '',
	zones: '',
	password: '',
	disciplines: '',
});

const form_rules = computed(() => ({
	name: { required },
	address: { required },
	document_number: { required },
	document_type: { required },
	email: { required, email },
	gender: { required },
	lastname: { required },
	municipalities: {},
	period: {},
	phone: { required },
	roles: { required },
	zones: {},
	password: {},
	disciplines: {},
}));

const sendUpdate = async () => {
	const valid = await v$.value.$validate();
	if (valid) {
		await userServices
			.update(route.params.id as string, formdataParser(form))
			.then((response) => {
				if (response) {
					if (response.status >= 200 && response.status <= 300) {
						alerts.update();
						setLoading(true);
						router.push('beneficiaries.index').finally(() => {
							setLoading(false);
						});
					}
				}
			});
	} else {
		alerts.validation();
	}
};

const types = [
	{
		label: 'Cédula de ciudadanía',
		value: 'Cédula de ciudadanía',
	},
	{
		label: 'Cédula de extranjeria',
		value: 'Cédula de extranjeria',
	},
	{
		label: 'Pasaporte',
		value: 'Pasaporte',
	},
	{
		label: 'NIT',
		value: 'NIT',
	},
];
const genders = [
	{
		label: 'Masculino',
		value: 'Masculino',
	},
	{
		label: 'Femenino',
		value: 'Femenino',
	},
];

const formdataParser = (form: any) => {
	const formData = new FormData();
	Object.keys(form).forEach((key) => {
		if (key == 'municipalities') {
			form[key].forEach((file: any) => {
				formData.append('municipalities[]', file);
			});
		} else if (key == 'disciplines') {
			form[key].forEach((file: any) => {
				formData.append('disciplines[]', file);
			});
		} else {
			formData.append(key, form[key]);
		}
	});
	return formData;
};

const zones = asyncComputed(async () => {
	return await getSelect(['zones']);
}, null);

const zone_id = computed(() => form.zones);

const roles = asyncComputed(async () => {
	const roles_data = await getSelect(['roles']);
	return roles_data.filter(({ value }) => value != '1');
}, null);

const municipalities = asyncComputed(async () => {
	return await getSelect(['municipalities']);
}, null);
const disciplines = asyncComputed(async () => {
	return await getSelect(['disciplines']);
}, null);

const v$ = useVuelidate(form_rules, form);

//Variable necesaria para mostrar el formulario solo despues del llamado a la Api
const dataLoaded = ref(false);
// Mostrar los valores de las variables reactivas después del montaje del componente

const fetch = async () => {
	//console.log(3);
	await userServices.get(route.params.id as string).then((response) => {
		console.log(response?.data.items);
		if (response?.status == 200 || response?.status == 201) {
			form.name = response.data.items.name;
			form.lastname = response.data.items.lastname;
			form.address = response.data.items.address;
			form.email = response.data.items.email;
			form.gender = response.data.items.gender;
			form.phone = response.data.items.phone;
			form.document_type = response.data.items.document_type;
			form.document_number = response.data.items.document_number;
			form.roles = response.data.items.roles[0].id;
			if(response.data.items.zone.length > 0){
				form.zones = response.data.items.zone[0].zones_id;
			};
			form.municipalities = response.data.items.municipalities.map((obj: any) => obj.id);
			form.disciplines = response.data.items.disciplines.map((obj: any) => obj.disciplines_id);
			Swal.fire('', response?.data.message, 'info').finally(() => {});
		} else {
			Swal.fire('', 'No se pudieron obtener los datos', 'error');
		}
		console.log(form);
	});
};

onMounted(async () => {
	console.log(route);
	await fetch();
	dataLoaded.value = true;
});
</script>

<template>
	<div class="flex items-center mt-8 intro-y">
		<div class="flex items-center space-x-4">
			<CommonBackButton
				:to="'users.index'"
				title="Listado" />
			<h2 class="mr-auto text-lg font-medium">Editar Usuario</h2>
		</div>
	</div>

	<div class="p-5 mt-5 intro-y box">
		<div
			class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly"
			v-if="dataLoaded">
			<CommonSelect
				class="col-span-1 md:col-span-2"
				label="Seleccione el Rol *"
				name="roles"
				v-model="form.roles"
				:validator="v$"
				:options="roles" />
			<CommonInput
				placeholder="Ingrese"
				type="text"
				label="Nombres *"
				name="name"
				v-model="form.name"
				:validator="v$" />
			<CommonInput
				placeholder="Ingrese"
				type="text"
				label="Apellidos *"
				name="lastname"
				v-model="form.lastname"
				:validator="v$" />
			<CommonInput
				placeholder="Ingrese"
				type="text"
				label="Dirección *"
				name="address"
				v-model="form.address"
				:validator="v$" />
			<CommonInput
				placeholder="Ingrese"
				type="number"
				label="Número de teléfono *"
				name="phone"
				v-model="form.phone"
				:validator="v$" />
			<CommonSelect
				label="Seleccione tipo documento *"
				name="document_type"
				v-model="form.document_type"
				:validator="v$"
				:options="types" />
			<CommonInput
				placeholder="Ingrese"
				type="number"
				label="Número de documento *"
				name="document_number"
				v-model="form.document_number"
				:validator="v$" />
			<CommonSelect
				label="Seleccione el genero *"
				name="gender"
				v-model="form.gender"
				:validator="v$"
				:options="genders" />
			<CommonInput
				type="email"
				label="Correo *"
				placeholder="Ingrese el correo"
				name="email"
				v-model="form.email"
				:validator="v$" />

			<CommonSelect
				label="Selecciona regiones *"
				multiple
				name="zones"
				v-model="form.zones"
				:validator="v$"
				:options="zones"
				v-if="form.roles == '1' || 
				form.roles == '2' || 
				form.roles == '4' || 
				form.roles == '8' || 
				form.roles == '9' || 
				form.roles == '10' || 
				form.roles == '11' || 
				form.roles == '12'"
			/>
			<!-- <CommonSelect
				label="Seleccione la ciudad *"
				name="municipalities"
				v-model="form.municipalities"
				:validator="v$"
				:options="cities" /> -->
			<CommonSelect
				label="Seleccione el municipio *"
				name="municipalities"
				v-model="form.municipalities"
				:validator="v$"
				:options="municipalities"
				multiple 
				v-if="form.roles == '1' || 
				form.roles == '2' || 
				form.roles == '4' || 
				form.roles == '8' || 
				form.roles == '9' || 
				form.roles == '10' || 
				form.roles == '11' || 
				form.roles == '12'"
			/>
			<CommonSelect
				class="h-30"
				label="Seleccione las disciplinas *"
				name="disciplines"
				v-model="form.disciplines"
				:validator="v$"
				:options="disciplines"
				multiple
				v-if="form.roles == '1' || 
				form.roles == '2' || 
				form.roles == '4' || 
				form.roles == '8' || 
				form.roles == '9' || 
				form.roles == '10' || 
				form.roles == '11' || 
				form.roles == '12'"
			/>
			<br />
			<!-- <CommonInput type="hidden" name="password" :value="form.document_number" v-model="form.password" :validator="v$" />-->
		</div>
		<div
			class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly"
			v-else>
			Cargando datos...
		</div>

		<!-- <CommonInput type="date" label="Fecha nacimiento *" name="date_birth" v-model="form.date_birth" :validator="v$" /> -->
		<div class="flex justify-end col-span-1 md:col-span-2">
			<Button
				variant="warning"
				class="btn btn-primary"
				@click="sendUpdate">
				Actualizar registro
			</Button>
		</div>
		<!-- </div> -->
	</div>
</template>
