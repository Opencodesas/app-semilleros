<script setup lang="ts">
import Crud from '@/components/Crud.vue';
import { Header, Item } from 'vue3-easy-data-table';
import View from '@/pages/forms/View.vue'

import { beneficiaryServices } from '@/services/beneficiaryServices';  // 1. Llamar el servicio
const router = useRouter()
const route = useRoute()
const beneficiary_Services = beneficiaryServices; // 2. Guardar el servicio en un variable
const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

const search = ref('');

const create = () => {
    setLoading(true)
    router.replace('create').finally(() => {
        setLoading(false)
    })
}

const headers: Header[] = [
    { text: 'ID', value: 'id' },
    { text: 'NOMBRE COMPLETO', value: 'full_name' },
    { text: 'MUNICIPIO', value: 'municipality.name' },
    { text: 'ESTADO', value: 'statusBene' },
    { text: 'FECHA CREADO', value: 'created_at' },
    { text: 'ACCIONES', value: 'actionsBene' },
]
const items = ref<Item[]>([])// 3. Definir una variable,para guardar los los datos que llega tipo  ref<Item[]>([])

onBeforeMount(async () => {
    await beneficiary_Services.getAll().then((response) => {  //4 . Llamar el metodo a consumir
        items.value = response?.data.items
    }).catch()
})

const searchData = (items: Item[], search: String) => {
	if (items) {
		const searchValue = search.toLowerCase();
		return items.filter(
			(item) =>
				item.full_name?.toLowerCase().includes(searchValue) ||
				item.municipality?.toLowerCase().includes(searchValue) ||
				item.status.name?.toLowerCase().includes(searchValue)
		);
	}
	return items
};

const dataSearch = computed(() => searchData(items.value, search.value));


</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Listado Beneficarios</h2>
        <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <Button variant="primary" class="btn btn-primary" @click="create">
                Crear Beneficario
            </Button>
        </div>
    </div>
    <!-- BEGIN: Page Layout -->
    <div class="p-5 mt-5 intro-y box">
        <CommonInput
			type="search"
			name="search"
			v-model="search"
			placeholder="Buscar" />

        <Crud :headers="headers" :items="dataSearch" :Form="{...View}" />
    </div>
    <!-- END: Page Layout -->
</template>
