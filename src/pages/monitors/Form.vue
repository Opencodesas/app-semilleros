<script setup lang="ts">
import { onboardingStore } from '@/stores/onboardingStore';
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const props = defineProps<{
	id_review: number;
	closeModal: Function;
}>();
const store = onboardingStore();
const route = useRoute();
const router = useRouter();

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
		rechazo: {}
    },
    { id: 5, name: 'Peter', last_name: 'Parker', status: {
			name: 'Rechazado',
			slug: 'REC',
		},
        rechazo: {resp_id: 1, desc: "Hace falta un documento"}
    },
])
//trae el primer monitor [0] del filtrado de monitores por id==props.id_review
const currentMonitor = monitors.value.filter((tmonitor) => {return tmonitor.id.toString()==props.id_review?.toString()})[0];

const form = reactive({...currentMonitor,
		selectid: (currentMonitor.status.slug==='SIN'?1:
		currentMonitor.status.slug==='APR'?2:3),
		motive: currentMonitor.rechazo?.desc||'',
})

const form_rules = computed(() => ({
    id: { required },
    name: { required },
    last_name: { required },
    status: { required },
}))

const v$ = useVuelidate(form_rules, form);

const evaluationList = [
	{ label: 'Sin Revisar', value: 1 },
	{ label: 'Aprobada', value: 2 },
	{ label: 'Rechazada', value: 3 },
];

const AceptFicha = () =>{
    const cId = currentMonitor.id;
    const index = monitors.value.findIndex(obj => obj.id === cId);
    if (index !== -1) { // Si encontramos el objeto
    // Clonamos el objeto para no modificar el original directamente
    const obj = { ...monitors.value[index] };
    
    // Modificamos la propiedad value con el nuevo valor
    obj.status.name="Aprobado";
    obj.status.slug = 'APR';
    
    // Reemplazamos el objeto modificado en el arreglo original
    monitors.value.splice(index, 1, obj);
  }
  alerts.custom('', 'Se ha aprobado correctamente', 'success')
  form.motive='';
  setLoading(false);
  props.closeModal();
  router.push(route.path);
  return;
}
const RejectFicha = () =>{
    if(form.motive!='')
    {
        const cId = currentMonitor.id;
        const index = monitors.value.findIndex(obj => obj.id === cId);
        if (index !== -1) // Si encontramos el objeto
        { 
            // Clonamos el objeto para no modificar el original directamente
            const obj = { ...monitors.value[index] };
            
            // Modificamos la propiedad value con el nuevo valor
            obj.rechazo = {resp_id: store.get_user.id as number, desc: form.motive};
            obj.status.name="Rechazado";
            obj.status.slug = 'REC';
            
            // Reemplazamos el objeto modificado en el arreglo original
            monitors.value.splice(index, 1, obj);
        }
		alerts.custom('', 'Se ha rechazado correctamente', 'warning')
		form.motive='';
		setLoading(false);
		props.closeModal();
		router.push(route.path);
		return;
    }else{
		alerts.custom('', 'Debes escribir un comentario de rechazo', 'error')
		setLoading(false);
		return;
	}

}

const RevertFicha = () =>{
    const cId = currentMonitor.id;
    const index = monitors.value.findIndex(obj => obj.id === cId);
    if (index !== -1) { // Si encontramos el objeto
    // Clonamos el objeto para no modificar el original directamente
    const obj = { ...monitors.value[index] };
    
    // Modificamos la propiedad value con el nuevo valor
    obj.rechazo={};
    obj.status.name="En revisión";
    obj.status.slug = 'SIN';
    
    // Reemplazamos el objeto modificado en el arreglo original
    monitors.value.splice(index, 1, obj);
  }
  setLoading(false);
  alerts.custom('', 'Se ha restablecido la revisión', 'warning')
  form.motive='';
  setLoading(false);
  props.closeModal();
  router.push(route.path);
  return;
}

const onSubmit = async () => {
	console.log(currentMonitor.status.slug+" "+form.selectid)
	
	setLoading(true);
	if((currentMonitor.status.slug === 'REC' && form.selectid==3) && !(form.motive===currentMonitor.rechazo?.desc))
		{RejectFicha(); return;}


	if((currentMonitor.status.slug === 'SIN' && form.selectid==1)||
	   (currentMonitor.status.slug === 'APR' && form.selectid==2)||
	   (currentMonitor.status.slug === 'REC' && form.selectid==3))
	{

		alerts.custom('', 'Se ha abortado la operación', 'info')
		setLoading(false);
		props.closeModal();
	}else if(currentMonitor.status.slug === 'SIN')
	{
		if(form.selectid==2){
			AceptFicha();
		}else{
			RejectFicha();
		}
	}else if(currentMonitor.status.slug === 'APR' || currentMonitor.status.slug === 'REC')
	{
		if(form.selectid==1){
		RevertFicha();
		}else if(form.selectid==2){
			AceptFicha();
		}else{
			RejectFicha();
		}
	}	
	
	
	/*
	const valid = await v$.value.$validate();
	if (valid) {
		await 'Service'
			.update(props.id_review as string, formdataParser(form))
			.then((response) => {
				if (response?.status == 200 || response?.status == 201) {
					props.closeModal
                    alerts.custom('', 'Revisión exitosa!', 'success');
					setLoading(true);
					router.push('PONER RUTA').finally(() => {
						setLoading(false);
					});
				} else {
					alerts.custom('', 'Error al revisar!', 'error')
				}
			});
	}*/
};
</script>

<template>
	<div class="flex items-center justify-between mt-5 mb-2 intro-y">
			<h1 class="mr-auto text-lg font-medium">Revisar fichas de inscripción de los monitores</h1>
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

    <div class="space-y-2 box px-5 py-4">
        <h2 class="font-bold">Revisión</h2>
        <CommonSelect :allow-empty="false" label=""
		name="name" v-model="form.selectid"
        :validator="v$" :options="evaluationList" />
        <div v-if="form.selectid == 3" class="pt-4">
			<CommonTextarea name="name" class=""
				label="Comentario *" placeholder="Escriba..." rows="5"
                v-model="form.motive" :validator="v$" />
        </div>
        <div class="mt-6 flex justify-end col-span-1 md:col-span-2 border-none gap-1" tabindex="1">
            <Button variant="danger" @click="props.closeModal">Cerrar</Button>
            <Button variant="primary" class="btn btn-primary" @click="onSubmit">
                Enviar
            </Button>
        </div>
    </div>

    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Ficha del Monitor </h2>
        
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

	<!--<div class="p-5 mt-5 intro-y box">
        <div class="grid grid-cols-2 gap-6 justify-evenly">            
				<template v-if="currentMonitor.status.slug == 'SIN'">
							<Button variant="soft-success" @click="() => {
								router.push({ name: 'fichas_inscripcion.index', query: { id: currentMonitor.id, slug: currentMonitor.status.slug, acc: 'APR'} })
							}">									
								<Lucide icon="ClipboardCheck" class="mr-2" />
								<span class="text-sm">
									Aprobar
								</span>
							</Button>
								<Button variant="soft-danger" @click="() => {
								router.push({ name: 'fichas_inscripcion.index', query: { id: currentMonitor.id,  slug: currentMonitor.status.slug, acc: 'REC'} })
							}">
								<Lucide icon="ClipboardX" class="mr-2" />
								<span class="text-sm">
									Rechazar
								</span>
							</Button>
						</template>
						<template v-else>
							<Button variant="soft-secondary" @click="() => {
								router.push({ name: 'fichas_inscripcion.index', query: { id: currentMonitor.id,  slug: currentMonitor.status.slug, acc: 'SIN'} })
							}">
								<Lucide icon="ClipboardCopy" class="mr-2" />
								<span class="text-sm">
									Revertir
								</span>
							</Button>
						</template>
			
        </div>
    </div>-->
</template>