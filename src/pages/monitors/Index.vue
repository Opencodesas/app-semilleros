<script setup lang="ts">
import Vue from 'vue'
import Crud from '@/components/Crud.vue'
import { Header, Item } from 'vue3-easy-data-table';
import { onboardingStore } from "@/stores/onboardingStore";
import Form from './Form.vue'

const route = useRoute();
const router = useRouter();
const store = onboardingStore();
//ver el provider - usado en CRUD para definir los botones de actions, leyendo status. fichasViewer si es único para esta tabla
//console.log(route.meta.provider)

const headers: Header[] = [
    {text: 'No.', value: 'id', sortable: true},
    { text: 'Nombre', value: 'name' },
    { text: 'Apellido', value: 'last_name' },
    { text: 'Estado', value: 'status'},
    { text: 'Ver Ficha', value: 'fichasViewer' },
    //{ text: 'Acciones', value: 'actions' },
]

//traer el listado de fichas de inscripción de monitores filtrado para este rol, ordenado con status.name = 'En revision' primero
const data = ref([
    { id: 1, name: 'Peter', last_name: 'Parker', status: {
			name: 'En revisión',
			slug: 'SIN',
		},
        rechazo: {},
    },
    { id: 2, name: 'Peter', last_name: 'Parker', status: {
			name: 'En revisión',
			slug: 'SIN',
		},
        rechazo: {},
    },
    { id: 3, name: 'Peter', last_name: 'Parker', status: {
			name: 'En revisión',
			slug: 'SIN',
		},
        rechazo: {},
    },
    { id: 4, name: 'Peter', last_name: 'Parker', status: {
			name: 'Aprobado',
			slug: 'APR',
		},
        rechazo: {},
    },
    { id: 5, name: 'Peter', last_name: 'Parker', status: {
			name: 'Rechazado',
			slug: 'REC',
		},
        rechazo: {},
    },]);
const items: Item[] = [...data.value];

//#region ocultar
const currentMonitor = () => {
   if(route.query.id){      
    const currentMonitor = data.value.filter((tmonitor) => {return tmonitor.id.toString()==route.query.id?.toString()})[0];
    return currentMonitor;
   }else{
    return null;
   }
}
//#endregion
</script>
<template>

    <template v-if="!route.query.id">
        <div class="flex items-center mt-8 intro-y">
            <h2 class="mr-auto text-lg font-medium">Fichas de Inscripción de Monitores</h2>
        </div>

        <div class="p-5 mt-5 intro-y box">
            <Crud :headers="headers" :items="items" :Form="{...Form}" :on-delete-fnc="undefined" :label="''"/>
        </div>
    </template>
    <template v-else>
        <div class="flex items-center mt-8 intro-y">
            <h2 class="mr-auto text-lg font-medium">Fichas de Inscripción de Monitores 2</h2>
        </div>
        <!--<Crud
			:headers="headers"
			:items="items" />-->
    </template>

    <!--<template v-else-if="(route.query.slug=='APR' || route.query.slug=='REC') && route.query.acc=='SIN'">
        <div class="flex items-center mt-8 intro-y">
            <CommonBackButton class="mr-4" :title="'Volver'" :to="route.hash"/>
            <h2 class="mr-auto text-lg font-medium">Revertir el estado {{ currentMonitor()?.status.name }} de {{ currentMonitor()?.name }}</h2>
        </div>

        <div class="p-5 mt-5 intro-y box">
            <div class="col-span-2 mb-3">
                Esta acción no podrá revertirse. ¿Quiere continuar?
            </div>
            <Button :variant="'outline-success'" v-on:click="RevertFicha">Revertir</Button>
            <CommonButtonLink class="ml-2" :to="route.hash" :variant="'outline-secondary'">Cancelar</CommonButtonLink>
        </div>
    </template>

    <template v-else-if="route.query.slug=='SIN' && route.query.acc=='APR'">
        <div class="flex items-center mt-8 intro-y">
            <CommonBackButton class="mr-4" :title="'Volver'" :to="route.hash"/>
            <h2 class="mr-auto text-lg font-medium">Aprobar la ficha de {{ currentMonitor()?.name }}</h2>
        </div>

        <div class="p-5 mt-5 intro-y box">
            <div class="col-span-2 mb-3">
                Se aceptará la ficha de este monitor.
            </div>
            <Button :variant="'outline-success'" v-on:click="AceptFicha">Aceptar</Button>
            <CommonButtonLink class="ml-2" :to="route.hash" :variant="'outline-secondary'">Cancelar</CommonButtonLink>
        </div>
    </template>

    <template v-else-if="route.query.slug=='SIN' && route.query.acc=='REC'">
        <div class="flex items-center mt-8 intro-y">
            <CommonBackButton class="mr-4" :title="'Volver'" :to="route.hash"/>
            <h2 class="mr-auto text-lg font-medium">Rechazar la ficha de {{ currentMonitor()?.name }}</h2>
        </div>

        <div class="p-5 mt-5 intro-y box">
            Se rechazará la ficha de este monitor.
            <div class="col-span-2 mb-3 mt-3">
                    <CommonTextarea :label="'Escribe el motivo del rechazo'" name="motive" v-model="motive"/>
                    <span v-if="error" class="text-sm text-danger">Este campo es obligatorio</span>
            </div>
            <Button :variant="'outline-danger'" v-on:click="RejectFicha">Rechazar</Button>
            <CommonButtonLink class="ml-2" :to="route.hash" :variant="'outline-secondary'">Cancelar</CommonButtonLink>
        </div>
    </template>-->

</template>

