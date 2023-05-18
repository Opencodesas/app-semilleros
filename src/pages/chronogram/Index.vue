<script setup lang="ts">
import Crud from '@/components/Crud.vue';
import { Header, Item } from 'vue3-easy-data-table';

import { chronogramServices } from '@/services/chronogramService';  // 1. Llamar el servicio

const search = ref('');

const router = useRouter()
const route = useRoute()
const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

const create = () => {
    setLoading(true)
    router.replace(routeName.value+'/create').finally(() => {
        setLoading(false)
    })
}

const headers: Header[] = [
    { text: 'ID', value: 'id' },
    { text: 'FECHA CREACIÓN', value: 'created_at' },
    { text: 'MES', value: 'month' },
    { text: 'MUNICIPIO', value: 'municipio' },
    { text: 'ETAPA', value: 'reviewed' },
    { text: 'ESTADO', value: 'status' },
    { text: 'ACCIONES', value: 'actions' },
]
const items = ref<Item[]>([])// 3. Definir una variable,para guardar los los datos que llega tipo  ref<Item[]>([])
onBeforeMount(async () => {
    await chronogramServices.getAll().then((response) => {  //4 . Llamar el metodo a consumir
        items.value = response?.data.items// .map((all: any) => ({ ...all, status: 'ENREV' })) //5.  Asignar los a la variable los datos que llegan
    })
})

const searchData = (items: Item[], search: String) => {
	if (items) {
		const searchValue = search.toLowerCase();
		return items.filter(
			(item) =>
				item.month?.toLowerCase().includes(searchValue) ||
				item.municipio?.toLowerCase().includes(searchValue) ||
				item.start_date?.toLowerCase().includes(searchValue) ||
				item.status.name?.toLowerCase().includes(searchValue)
		);
	}
	return items
};

const dataSearch = computed(() => searchData(items.value, search.value));

</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Listado Cronogramas</h2>
        <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <Button variant="primary" class="btn btn-primary" @click="create">
                Crear Cronograma
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
		
        <Crud :headers="headers" :items="dataSearch" />
    </div>
    <!-- END: Page Layout -->
</template>
