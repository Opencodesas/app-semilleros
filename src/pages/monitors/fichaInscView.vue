<script setup lang="ts">
import CommonFile from '@/components/CommonFile.vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const route = useRoute();

//trae los monitores de base de datos
const monitors = ref([
{ id: 1, name: 'Peter', last_name: 'Parker', status: {
			name: 'En revisión',
			slug: 'SIN',
		},
    },
    { id: 2, name: 'Peter', last_name: 'Parker', status: {
			name: 'En revisión',
			slug: 'SIN',
		},
    },
    { id: 3, name: 'Peter', last_name: 'Parker', status: {
			name: 'En revisión',
			slug: 'SIN',
		},
    },
    { id: 4, name: 'Peter', last_name: 'Parker', status: {
			name: 'Aprobado',
			slug: 'APR',
		},
    },
    { id: 5, name: 'Peter', last_name: 'Parker', status: {
			name: 'Rechazado',
			slug: 'REC',
		},
        rechazo: {resp_id: 1, desc: "Hace falta un documento"}
    },
])
//trae el primer monitor [0] del filtrado de monitores por id==route.query.id
const currentMonitor = monitors.value.filter((tmonitor) => {return tmonitor.id.toString()==route.query.id?.toString()})[0];

const form = reactive({...currentMonitor})

const form_rules = computed(() => ({
    id: { required },
    name: { required },
    last_name: { required },
    status: { required },
}))

const v$ = useVuelidate(form_rules, form)

</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <CommonBackButton class="mr-4" :title="'Volver'" :to="'fichas_inscripcion.index'"/>
        <h2 class="mr-auto text-lg font-medium">Ficha del Monitor {{ currentMonitor.name }}</h2>
        <span class="ml-auto text-base font-medium">
            Estado: 
            <span :class="
                        currentMonitor.status.slug == 'REC' ?
                        ' bg-danger/10 text-danger' :
                        currentMonitor.status.slug == 'APR' ?
                        ' bg-success/10 text-success' :
                        ' bg-primary/10 text-primary' 
                    " class="ml-2 inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium whitespace-nowrap">
                    {{ currentMonitor.status.name }}
            </span>
        </span>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <div class="grid grid-cols-2 gap-6 justify-evenly">
            <CommonInput label="Nombre" name="name" v-model="form.name" :validator="v$" />
            <CommonInput label="Apellido" name="last_name" v-model="form.last_name" :validator="v$" />
            <CommonInput label="ID" name="id" v-model="form.id" :validator="v$" />
            <CommonInput label="Estado" name="status" v-model="form.status.name" :validator="v$" />
            <div v-if="form.rechazo" class="col-span-2">
                <CommonTextarea :label="'Comentario del rechazo'" name="form.rechazo.desc" v-model="form.rechazo.desc"/>
            </div>
        </div>
    </div>
</template>