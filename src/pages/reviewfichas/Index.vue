<script setup lang="ts">
import Vue from "vue"
import Crud from "@/components/Crud.vue"
import { Header, Item } from "vue3-easy-data-table"
import { onboardingStore } from "@/stores/onboardingStore"
//import Form from "./Form.vue"
import View from '@/pages/forms/View.vue'
import beneficiary from "@/services/beneficiary/beneficiary"
import { Roles } from "@/utils/roles.enums"

let currentUser = {
   id: onboardingStore().get_user.id,
   name: onboardingStore().get_user.name,
   rol: onboardingStore().get_user_role?.slug,
}

const headers: Header[] =
   currentUser.rol === "metodologo"
      ? [
           { text: "No.", value: "id", sortable: true },
           { text: "Monitor", value: "created_by.full_name", sortable: true },
           {
              text: "CC del Monitor",
              value: "created_by.document_number",
              sortable: true,
           },
           { text: "Beneficiario", value: "full_name", sortable: true },
           { text: "Municipio", value: "municipality.name" },
           { text: "Estado", value: "fichaStatus" },
           { text: "Acciones", value: "fichasViewer" },
        ]
      : currentUser.rol === "coordinador_regional"
      ? [
           { text: "No.", value: "id", sortable: true },
           {
              text: "Metodólogo",
              value: "reviewed_by.full_name",
              sortable: true,
           },
           { text: "Monitor", value: "created_by.full_name", sortable: true },
           {
              text: "CC del Monitor",
              value: "created_by.document_number",
              sortable: true,
           },
           { text: "Beneficiario", value: "full_name", sortable: true },
           { text: "Municipio", value: "municipality.name" },
           { text: "Estado", value: "status" },
           { text: "Acciones", value: "fichasViewer" },
        ]
      : currentUser.rol === "coordinador_maritimo"
      ? [
           { text: "No.", value: "id", sortable: true },
           {
              text: "Metodólogo",
              value: "reviewed_by.full_name",
              sortable: true,
           },
           { text: "Monitor", value: "created_by.full_name", sortable: true },
           {
              text: "CC del Monitor",
              value: "created_by.document_number",
              sortable: true,
           },
           { text: "Beneficiario", value: "full_name", sortable: true },
           { text: "Municipio", value: "municipality.name" },
           { text: "Estado", value: "status" },
           { text: "Acciones", value: "fichasViewer" },
        ]
      : [
           { text: "No.", value: "id", sortable: true },
         //   {
         //      text: "Revisado por",
         //      value: "reviewed_by.full_name",
         //      sortable: true,
         //   },
           { text: "Monitor", value: "created_by.full_name", sortable: true },
           {
              text: "CC del Monitor",
              value: "created_by.document_number",
              sortable: true,
           },
           { text: "Beneficiario", value: "full_name", sortable: true },
           { text: "Municipio", value: "municipality.name" },
           { text: "Estado", value: "status" },
           { text: "Acciones", value: "fichasViewer" },
        ]
const data = ref([])

const items = ref<Item[]>([])

const getData = async () => {
   const res = await beneficiaryServices.getAll()
   data.value = res?.data
   items.value = await res?.data.items
}

//traer el listado de fichas de inscripción de monitores filtrado para este rol
onMounted(async () => {
   await getData()
})

const getFichaData = () => data.value

const updateFichaData = (id: any, data: any) => {
   let ficha = data.value.find((o: any) => o.id === id)
   if (ficha) {
      ficha.status = data.status
      ficha.reviewed_by = data.reviewed_by
   }
}

const loadmethods = {
   DATA: getFichaData,
   UPDATE: updateFichaData,
   RELOAD: getData,
}

const search = ref("")

const cruddata = computed(() => searchData(items.value, search.value))
</script>
<template>
   <div
      class="flex items-center mt-8 intro-y"
      v-if="currentUser.rol !== Roles.SubdirectorTecnico"
   >
      <h2 class="mr-auto text-lg font-medium">Revisión de fichas</h2>
   </div>

   <div
      v-if="
         currentUser.rol === 'asistente_administrativo' ||
         currentUser.rol === 'metodologo' ||
         currentUser.rol === 'super.root'
      "
      class="p-5 mt-5 intro-y box"
   >
      <CommonInput
         type="search"
         name="search"
         v-model="search"
         placeholder="Buscar"
      />
      <Crud
         :headers="headers"
         :items="cruddata"
         :Form="{ ...View }"
         :payloadFunctions="loadmethods"
      />
   </div>

   <div v-else class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">
         No tienes permisos para ver esta información
      </h2>
   </div>
</template>
