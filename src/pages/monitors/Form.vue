<script setup lang="ts">
import router from '@/router';
import { onboardingStore } from '@/stores/onboardingStore';
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { isDataView } from 'util/types';




const props = defineProps<{
  //items?: [];
	id_review: number;
	closeModal: Function;
  payloadFunctions?: any;
}>();

//const route = useRoute();
//const router = useRouter();
let currentUser = {id: onboardingStore().get_user.id, name: onboardingStore().get_user.name, rol: onboardingStore().get_user_role?.slug};

const data = ref(props?.payloadFunctions?.DATA());

//buscar y traer solo la ficha correspondiente al props.id_review, haciendo copia profunda de varios objetos y reemplazando nulos por cadenas vacias
const currentFicha = JSON.parse(JSON.stringify( 
    Object.keys(data.value.items[props.id_review-1]).map((key) => {
  return { [key]: data.value.items[props.id_review-1][key] === null ? 'n/a' : data.value.items[props.id_review-1][key] };
}).reduce((acc, cur) => Object.assign(acc, cur), {})
));
const currentmotive = ref(currentFicha.rejection_message||"");
const form = reactive(
  {...currentFicha,
    currentmotive: currentmotive.value,
    tempDesc: currentFicha.rejection_message,

		selectid: (currentFicha.status.slug==='ENR'?1:
		currentFicha.status.slug==='APR'?2:3),

		rejection_message: currentFicha.rejection_message||"",
    temp:"",
  }
);
const form_rules = computed(() => ({
  rejection_message:{},
  selectid: { required },
  currentmotive: { },
  temp: {},
}))
const v$ = useVuelidate(form_rules, form);

currentUser = {...currentUser, rol : 'metodologo'};
const evaluationList =
currentUser.rol == 'metodologo'?
[
	{ label: 'En Revisión', value: 1, slug:'ENR' },
	{ label: 'En proceso', value: 2, slug: 'ENP' },
	{ label: 'Rechazado', value: 3, slug: 'REC' },
]: currentUser.rol == 'coordinador_regional'?
[
	{ label: 'En Revisión', value: 1, slug:'ENR' },
	{ label: 'Aprobada', value: 4, slug: 'APR' },
	{ label: 'Rechazada', value: 3, slug: 'REC' },
]:
[
	{ label: 'Aprobada', value: 4, slug: 'APR'  },
	{ label: 'Rechazada', value: 3  , slug: 'REC' },
];
const error = ref(false);

const onSubmit = async (evt: any) => {
  evt.preventDefault();

  //validar
  /*const valid = await v$.value.$validate()
  .then((response)=>{

  }).catch((error)=>{

  });
  if (valid) {
		await service
			.update()
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
/*
  //verificar error
  if (form.selectid===3&&form.currentmotive===""){error.value=true;}
  setLoading(true);

  //verifica algun cambio de estado
	if((currentFicha.status.slug === 'ENR' && form.selectid==1)||
	   (currentFicha.status.slug === 'APR' && form.selectid==2)||
	   (currentFicha.status.slug === 'REC' && form.selectid==3)){
    //si conserva el slug y la intención, verificar que no sea una actualización
    //console.log(form.currentmotive+" | "+currentFicha.calif.reject_motive+": "+(form.currentmotive===currentFicha.calif.reject_motive).toString())
    if(!(form.currentmotive===currentFicha.rejection_message))
		{
      props.payloadFunctions?.REC();

      setLoading(false);
      props.closeModal();    
      return;
    }
		alerts.custom('', 'Se ha abortado la operación', 'info');
    setLoading(false);
    props.closeModal();
  }else{
    if(form.selectid===1){        
        props.payloadFunctions?.ENR(props.id_review, currentUser);
        data.value = props.payloadFunctions?.DATA();
    }
    if(form.selectid===2){
        props.payloadFunctions?.APR(props.id_review, currentUser);
        data.value = props.payloadFunctions?.DATA();
    }
    if(form.selectid===3){
        props.payloadFunctions?.REC(props.id_review, currentUser, form.currentmotive);
        data.value = props.payloadFunctions?.DATA();
    }
    setLoading(false);
    props.closeModal();    
  }*/

  console.log(form.selectid)

  const solicitud = {data: "", id: ""}
	//const res = await beneficiaryServices.changeStatus(solicitud.data, solicitud.id);
}

</script>

<template>
  <!--HEADER--> 
	<div class="flex items-center justify-between mt-5 mb-2 intro-y">
    <a href="#"></a>
    
			<h1 class="mr-auto text-lg font-medium">Revisar ficha de Inscripción</h1>
			<span class="ml-auto text-base font-medium">
				Estado: 
				<span :class="
							currentFicha.status.slug == 'REC' ?
							' bg-danger/10 text-danger' :
							currentFicha.status.slug == 'APR' ?
							' bg-success/10 text-success' :
							' bg-primary/10 text-primary' 
						" class="ml-2 inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium whitespace-nowrap">
						{{ currentFicha.status.name }}
				</span>
			</span>
	</div>

  <!--REVISION -->
    <div class="space-y-2 box px-5 py-4">
      <h2 class="font-bold">Revisión</h2>
        <CommonSelect :allow-empty="false" label="Estado de la ficha*"
		      name="selectid" v-model="form.selectid"
          :validator="v$" :options="evaluationList" />
      <div v-if="form.selectid == 3" class="pt-4">
			  <CommonTextarea name="rejection_message" class=""
				  label="Comentario *" :placeholder="(form.rejection_message===''?'Comentario...':form.rejection_message)" rows="5"
          v-model="form.currentmotive" :validator="v$" />
        <span v-if="error" :class="'text-red-600 text-sm'">Este campo es obligatorio *</span>
      </div>
      
      <div class="mt-6 flex justify-end col-span-1 md:col-span-2 gap-1">
        <Button variant="danger" @click="props.closeModal">Cerrar</Button>
        <Button variant="primary" class="btn btn-primary" @click="onSubmit">Enviar</Button>
      </div>
    </div>
    

<!--FICHA-->
  <div class="grid grid-cols-2 gap-6 justify-evenly">
    <div class="p-5 mt-5 col-span-2 intro-y box">

    <!--DATOS RESPONSABLES-->
    <div class="mt-2 mb-5 col-span-2"> 
      <h3 v-if="currentFicha.revised_by"><span class="font-bold">Revisado por:</span> {{ currentFicha.revised_by.name }} el {{ currentFicha.revised_by.created_at }}</h3>
      <h3><span class="font-bold">Monitor:</span> {{ currentFicha.created_by.name + ' '+currentFicha.created_by.lastname }}</h3>
    </div>

    <div class="my-4 text-lg bold text-left text-gray-800">
        Datos del beneficiario
    </div>

      <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
        <div class="col-span-2">
        <CommonInput
          label="Fecha de inscripción"
          name="temp"
          v-model="currentFicha.created_at"
          :validator="v$"
          type="text"
          :disabled="true"
        />
        </div>

          <CommonInput
            label="Municipio"
            name="temp"
            v-model="currentFicha.municipality.name"
            :validator="v$"
            type="text"
            :disabled="true"
          />

       
          <CommonInput
            label="Disciplinas"
            name="temp"
            v-model="currentFicha.created_by.name"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          
          <CommonInput
            label="Nombres"
            name="temp"
            v-model="(currentFicha.full_name).toString().split(' ')[0]"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          
          <CommonInput
            label="Apellidos"
            name="temp"
            v-model="(currentFicha.full_name).toString().split(' ')[1]"
            :validator="v$"
            type="text"
            :disabled="true"
          />
           
          <CommonInput
            label="Fecha de nacimiento"
            name="temp"
            v-model="currentFicha.birth_date"
            :validator="v$"
            type="text"
            :disabled="true"
          />
 
          <CommonInput
            label="Lugar de nacimiento"
            name="temp"
            v-model="currentFicha.registration_date"
            :validator="v$"
            type="text"
            :disabled="true"
          />
        
          <CommonInput
            label="Tipo de Identificación"
            name="temp"
            v-model="currentFicha.type_document"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Número de documento"
            name="temp"
            v-model="currentFicha.document_number"
            :validator="v$"
            type="text"
            :disabled="true"
          />
        </div>

        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-3 gap-6 justify-evenly">
         
          <CommonInput
            label="Direccion de residencia"
            name="temp"
            v-model="currentFicha.home_address"
            :validator="v$"
            type="text"
            :disabled="true"
          />
           
          <CommonInput
            label="Numero de celular"
            name="temp"
            v-model="currentFicha.phone"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Estrato"
            name="temp"
            v-model="currentFicha.stratum"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          
          <CommonInput
            label="Zona"
            name="temp"
            v-model="currentFicha.zone"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Victima de conflicto"
            name="temp"
            v-model="currentFicha.conflict_victim"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Corregimiento/Barrio/Vereda"
            name="temp"
            v-model="currentFicha.distric"
            :validator="v$"
            type="text"
            :disabled="true"
          />  
        </div>

        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
          <CommonInput
            label="Genero"
            name="temp"
            v-model="currentFicha.gender"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Etnia"
            name="temp"
            v-model="currentFicha.ethnicities_id"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          
          <CommonInput
            label="Discapacidad"
            name="temp"
            v-model="currentFicha.disability"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="¿Cual?"
            name="temp"
            v-model="currentFicha.other_disability"
            :validator="v$"
            type="text"
            :disabled="true"
          />

          <CommonInput
            label="Patologia"
            name="temp"
            v-model="currentFicha.pathology"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="¿Cual?"
            name="temp"
            v-model="currentFicha.what_pathology"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          
          <CommonInput
            label="Tipo de sangre"
            name="temp"
            v-model="currentFicha.blood_type"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Escolaridad"
            name="temp"
            v-model="currentFicha.scholarship"
            :validator="v$"
            type="text"
            :disabled="true"
          />

        <CommonInput
          label="Vivo con"
          name="temp"
          v-model="currentFicha.live_with"
          :validator="v$"
          type="text"
          :disabled="true"
        />

        <CommonInput
          label="Tipo afiliacion(EPS)"
          name="temp"
          v-model="currentFicha.affiliation_type"
          :validator="v$"
          type="text"
          :disabled="true"
        />
      </div> 
    </div>


    <div class="p-5 mt-5 col-span-2 intro-y box">
      <div class="my-5 text-lg bold text-left text-gray-800">
        Datos del acudiente
      </div>


      <!--<div v-show="accordion[1].shown">-->

        
        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-3 gap-6 justify-evenly">
          <CommonInput
            label="Nombres"
            name="temp"
            v-model="currentFicha.acudiente.firts_name"
            :validator="v$"
            type="text"
            :disabled="true"
          />
        
          <CommonInput
            label="Apellidos"
            name="temp"
            v-model="currentFicha.acudiente.last_name"
            :validator="v$"
            type="text"
            :disabled="true"
          />
        
          <CommonInput
            label="Numero de documento"
            name="temp"
            v-model="currentFicha.acudiente.cedula"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Parentesco"
            name="temp"
            v-model="currentFicha.know_guardian.relationship"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput 
            label="Email"
            name="temp"
            v-model="currentFicha.acudiente.email"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Numero de celular"
            name="temp"
            v-model="currentFicha.acudiente.phone_number"
            :validator="v$"
            type="text"
            :disabled="true"
          />
        </div>
       
        <div class="mt-5 mb-3 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
          <CommonInput
            label="Redes sociales"
            name="temp"
            v-model="currentFicha.acudiente.social_media"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="¿Como se entero del proyecto?"
            name="temp"
            v-model="currentFicha.find_out"
            :validator="v$"
            type="text"
            :disabled="true"
          />
        </div>

  </div>
</div>
  <!--FIN FICHA-->  
</template>