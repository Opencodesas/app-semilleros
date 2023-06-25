<script setup lang="ts">
import Crud from "@/components/Crud.vue";
import { Header, Item } from "vue3-easy-data-table";
import { onboardingStore } from "@/stores/onboardingStore";

const router = useRouter();
const route = useRoute();

const routeName = computed(() => {
  return String(route.name).split(".")[0];
});

const create = () => {
  setLoading(true);
  router.replace("create").finally(() => {
    setLoading(false);
  });
};

onBeforeMount(async () => {
  await userServices.getAll().then((response) => {
    items.value = [...response?.data.items].map((objeto) => ({
      ...objeto,
      profile: JSON.parse(JSON.stringify({ ...objeto.profile })), //copia profuda de copia profunda del objeto
      role: objeto.roles[0],
    }));
    //console.log(response?.data.items)
    //console.log(items.value)
  });
});

// const headers: Header[] = [
//   { text: "No.", value: "id" },
//   { text: "Correo", value: "email", sortable: true },
//   { text: "Nombre", value: "name", sortable: true },
//   { text: "Apellido", value: "lastname", sortable: true },
//   { text: "Documento", value: "document_number", sortable: true },
//   { text: "Roles", value: "role.name", sortable: true },
//   { text: "Acciones", value: "actionsUsersViewer" },
// ];

const isDirectorAdministrator = computed(() => {
  return onboardingStore().get_user_role?.slug === "director_administrator";
});

const headers: Header[] = computed(() => {
  const baseHeaders = [
    { text: "No.", value: "id" },
    { text: "Correo", value: "email", sortable: true },
    { text: "Nombre", value: "name", sortable: true },
    { text: "Apellido", value: "lastname", sortable: true },
    { text: "Documento", value: "document_number", sortable: true },
    { text: "Roles", value: "role.name", sortable: true },
  ];

  if (isDirectorAdministrator.value) {
    return [...baseHeaders, { text: "Acciones", value: "actionsUsersViewer" }];
  }

  return baseHeaders;
});
const search = ref("");
const items = ref<Item[]>([]);

const data = computed(() => searchData(items.value, search.value));
</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Listado Usuarios</h2>
    <!-- <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <Button variant="primary" class="btn btn-primary" @click="create">
                Crear Usuario
            </Button>
        </div> -->
  </div>
  <div class="p-5 mt-5 intro-y box">
    <CommonInput
      type="search"
      name="search"
      v-model="search"
      placeholder="Buscar"
    />
    <Crud :headers="headers" :items="data" />
  </div>
</template>
