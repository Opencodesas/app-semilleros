<script setup lang="ts">
import { onboardingStore } from '@/stores/onboardingStore';
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { isDataView } from 'util/types';

const props = defineProps<{
	id_review: number;
	closeModal: Function;
  payloadFunctions?: any;
}>();
const store = onboardingStore();
const route = useRoute();
const router = useRouter();

const data = ref(props?.payloadFunctions?.DATA());

//buscar y traer solo la ficha correspondiente al props.id_review
const currentFicha = data.value.filter((ficha: any) => {return ficha.id.toString()==props.id_review?.toString()})[0];
const currentmotive = ref(currentFicha.calif.reject_motive.toString());
const error = ref(false);
const form = reactive(
  {...currentFicha,
    currentmotive: currentmotive.value,
    tempDesc: currentFicha.calif.reject_motive,
		selectid: (currentFicha.status.slug==='ENR'?1:
		currentFicha.status.slug==='APR'?2:3),
		motive: currentFicha.calif.reject_motive||'',

  }
);

const form_rules = computed(() => ({
  selectid: { required },
  calif: {
    resp_id: {},
    resp_name: {},
    reject_motive: {},
    fecha: {},
  },
  ficha_data: {
    fechaInscripcion: {},
    municipio: {},
    disciplinas: {},
    nombres: {},
    apellidos: {},
    fechaNacimiento: {},
    lugarNacimiento: {},
    tipoIdentificacion: {},
    numeroDocumento: {},
    direccionRes: {},
    numeroCel: {},
    estrato: {},
    zona: {},
    victimaConf: {},
    pueblo: {},
    genero: {},
    etnia: {},
    discapacidad: {},
    otroDiscapacidad: {},
    patologia: {},
    otroPatologia: {},
    sangre: {},
    escolaridad: {},
    vivoCon: {},
    afiliacion: {},
    nombresAcudiente: {},
    apellidosAcudiente:{},
    nDocuAcudiente: {},
    parentesco: {},
    email: {},
    nCelularAcudiente: {},
    redesAcudiente: {},
    enterado: {},
  },
  currentmotive: { },
}))

const v$ = useVuelidate(form_rules, form);

const evaluationList = [
	{ label: 'Selecciona valor', value: 1 },
	{ label: 'Aprobada', value: 2 },
	{ label: 'Rechazada', value: 3 },
];
const currentUser = {id: onboardingStore().get_user.id, name: onboardingStore().get_user.name};

const onSubmit = async (evt: any) => {
  evt.preventDefault();

  //validar
  /*const valid = await v$.value.$validate()
  .then((response)=>{

  }).catch((error)=>{

  });*/
  /*if (valid) {
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

  //verificar error
  if (form.selectid===3&&form.currentmotive===""){error.value=true;}
  setLoading(true);

  //verifica algun cambio de estado
	if((currentFicha.status.slug === 'ENR' && form.selectid==1)||
	   (currentFicha.status.slug === 'APR' && form.selectid==2)||
	   (currentFicha.status.slug === 'REC' && form.selectid==3)){
    //si conserva el slug y la intención, verificar que no sea una actualización
    //console.log(form.currentmotive+" | "+currentFicha.calif.reject_motive+": "+(form.currentmotive===currentFicha.calif.reject_motive).toString())
    if(!(form.currentmotive===currentFicha.calif.reject_motive))
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
  }
}

</script>

<template>
  {{ '' }}
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

  <!--REVISION-->
    <div class="space-y-2 box px-5 py-4">
      <h2 class="font-bold">Revisión</h2>
        <CommonSelect :allow-empty="false" label="Estado de la ficha*"
		      name="selectid" v-model="form.selectid"
          :validator="v$" :options="evaluationList" />
      <div v-if="form.selectid == 3" class="pt-4">
			  <CommonTextarea name="calif" class=""
				  label="Comentario *" :placeholder="(form.calif.reject_motive===''?'Comentario...':form.calif.reject_motive)" rows="5"
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
      <!--<h3 v-if="currentFicha.calif.resp_name"><span class="font-bold">Revisado por:</span> {{ currentFicha.calif.resp_name }} el {{ currentFicha.calif.fecha }}</h3>-->
      <h3><span class="font-bold">Monitor:</span> {{ currentFicha.mon.name }}</h3>
    </div>
    
    <div class="my-4 text-lg bold text-left text-gray-800">
        Datos del beneficiario
    </div>

      <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
        <div class="col-span-2">
        <CommonInput
          label="Fecha de inscripción"
          name="ficha_data"
          v-model="currentFicha.ficha_data.fechaInscripcion"
          :validator="v$"
          type="text"
          :disabled="true"
        />
        </div>
        
          <CommonInput
            label="Municipio"
            name="ficha_data"
            v-model="currentFicha.ficha_data.municipio"
            :validator="v$"
            type="text"
            :disabled="true"
          />

          
          <CommonInput
            label="Disciplinas"
            name="ficha_data"
            v-model="currentFicha.ficha_data.disciplinas"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          
          <CommonInput
            label="Nombres"
            name="ficha_data"
            v-model="currentFicha.ficha_data.nombres"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          
          <CommonInput
            label="Apellidos"
            name="ficha_data"
            v-model="currentFicha.ficha_data.apellidos"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          
          <CommonInput
            label="Fecha de nacimiento"
            name="ficha_data"
            v-model="currentFicha.ficha_data.fechaNacimiento"
            :validator="v$"
            type="text"
            :disabled="true"
          />

          <CommonInput
            label="Lugar de nacimiento"
            name="ficha_data"
            v-model="currentFicha.ficha_data.lugarNacimiento"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          
          <CommonInput
            label="Tipo de Identificación"
            name="ficha_data"
            v-model="currentFicha.ficha_data.tipoIdentificacion"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Número de documento"
            name="ficha_data"
            v-model="currentFicha.ficha_data.numeroDocumento"
            :validator="v$"
            type="text"
            :disabled="true"
          />
        </div>

        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-3 gap-6 justify-evenly">
         
          <CommonInput
            label="Direccion de residencia"
            name="ficha_data"
            v-model="currentFicha.ficha_data.direccionRes"
            :validator="v$"
            type="text"
            :disabled="true"
          />
           
          <CommonInput
            label="Numero de celular"
            name="ficha_data"
            v-model="currentFicha.ficha_data.numeroCel"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Estrato"
            name="ficha_data"
            v-model="currentFicha.ficha_data.estrato"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          
          <CommonInput
            label="Zona"
            name="ficha_data"
            v-model="currentFicha.ficha_data.zona"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Victima de conflicto"
            name="ficha_data"
            v-model="currentFicha.ficha_data.victimaConf"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Corregimiento/Barrio/Vereda"
            name="ficha_data"
            v-model="currentFicha.ficha_data.pueblo"
            :validator="v$"
            type="text"
            :disabled="true"
          />  
        </div>

        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
          <CommonInput
            label="Genero"
            name="ficha_data"
            v-model="currentFicha.ficha_data.genero"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Etnia"
            name="ficha_data"
            v-model="currentFicha.ficha_data.etnia"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          
          <CommonInput
            label="Discapacidad"
            name="ficha_data"
            v-model="currentFicha.ficha_data.discapacidad"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="¿Cual?"
            name="ficha_data"
            v-model="currentFicha.ficha_data.otroDiscapacidad"
            :validator="v$"
            type="text"
            :disabled="true"
          />

          <CommonInput
            label="Patologia"
            name="ficha_data"
            v-model="currentFicha.ficha_data.patologia"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="¿Cual?"
            name="ficha_data"
            v-model="currentFicha.ficha_data.otroPatologia"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          
          <CommonInput
            label="Tipo de sangre"
            name="ficha_data"
            v-model="currentFicha.ficha_data.sangre"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Escolaridad"
            name="ficha_data"
            v-model="currentFicha.ficha_data.escolaridad"
            :validator="v$"
            type="text"
            :disabled="true"
          />

        <CommonInput
          label="Vivo con"
          name="ficha_data"
          v-model="currentFicha.ficha_data.vivoCon"
          :validator="v$"
          type="text"
          :disabled="true"
        />

        <CommonInput
          label="Tipo afiliacion(EPS)"
          name="ficha_data"
          v-model="currentFicha.ficha_data.afiliacion"
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
            name="ficha_data"
            v-model="currentFicha.ficha_data.nombresAcudiente"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Apellidos"
            name="ficha_data"
            v-model="currentFicha.ficha_data.apellidosAcudiente"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Numero de documento"
            name="ficha_data"
            v-model="currentFicha.ficha_data.nDocuAcudiente"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Parentesco"
            name="ficha_data"
            v-model="currentFicha.ficha_data.parentesco"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput 
            label="Email"
            name="ficha_data"
            v-model="currentFicha.ficha_data.email"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Numero de celular"
            name="ficha_data"
            v-model="currentFicha.ficha_data.nCelularAcudiente"
            :validator="v$"
            type="text"
            :disabled="true"
          />
        </div>
        
        <div class="mt-5 mb-3 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
          <CommonInput
            label="Redes sociales"
            name="ficha_data"
            v-model="currentFicha.ficha_data.redesAcudiente"
            :validator="v$"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="¿Como se entero del proyecto?"
            name="ficha_data"
            v-model="currentFicha.ficha_data.enterado"
            :validator="v$"
            type="text"
            :disabled="true"
          />
        </div>
    </div>
  </div>
  <!--FIN FICHA-->  
</template>