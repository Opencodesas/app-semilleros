<script setup lang="ts">
import Crud from "@/components/Crud.vue";
import { Header, Item } from "vue3-easy-data-table";

const router = useRouter();

const create = () => {
  setLoading(true);
  router.push({ name: "event_supports.create" }).finally(() => {
    setLoading(false);
  });
};
const items = ref<Item[]>([]);
const search = ref("");

onMounted(async () => {
  const res = await eventSupportsService.getAll();
  items.value = await res?.data.items;
  // for (let i = 0; i < items.value.length; i++) {
  // 	items.value[i].evaluations = await items.value[i].evaluations.id == '1' ? 'Aprobado' : 'Rechazado';
  // }
});

const headers: Header[] = [
  //{ text: 'Nro.', value: 'id' },
  { text: "ID", value: "id", sortable: true },
  { text: "Fecha", value: "date_visit", sortable: true },
  { text: "Hora", value: "hour_visit", sortable: true },
  { text: "Evento", value: "event", sortable: true },
  { text: "Departamento", value: "municipalitie_id", sortable: true },
  { text: "Corrregimiento", value: "correct", sortable: true },

  // { text: "Hora", value: "hour_visit", sortable: true },
  // { text: "Municipio", value: "municipalitie_id", sortable: true },
  { text: "Acciones", value: "actions_event_supports" },
];
const dataSearch = computed(() => searchData(items.value, search.value));
</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Listado de apoyo de eventos</h2>
    <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
      <Button variant="primary" class="btn btn-primary" @click="create">
        Crear apoyo de evento
      </Button>
    </div>
  </div>
  <!-- BEGIN: Page Layout -->
  <div class="p-5 mt-5 intro-y box">
    <!-- {{items}}
  {{dataSearch}} -->
    <CommonInput
      type="search"
      name="search"
      v-model="search"
      placeholder="Buscar"
    />
    <Crud :headers="headers" :items="dataSearch" />
  </div>
  <!-- END: Page Layout -->
</template>