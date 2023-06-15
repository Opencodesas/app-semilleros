<script setup lang="ts">
import { onboardingStore } from "@/stores/onboardingStore";

const props = defineProps<{
    item?: any;
	closeModal: Function;
}>();

const store = onboardingStore();

const optionsMunicipio = ref([
  { label: "cali", value: "1" },
  { label: "caicedonia", value: "2" },
  { label: "cartago", value: "3" },
  { label: "yumbo", value: "4" },
  { label: "alcala", value: "5" },
  { label: "florida", value: "6" },
  { label: "jamundi", value: "7" },
]) 

const optionsDisciplinas= asyncComputed(async () => {
  return await getSelect(['disciplines']);
});

const optionsIdentificacion= asyncComputed(async () => {
  return await getSelect(['identification_types']);
});

const optionsEstrato= ref([
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
])
const zonesList= ref([
  { label: "RURAL", value: "R" },
  { label: "URBANA", value: "U" },
])
const optionsVictima= ref([
  { label: "SI", value: "1" },
  { label: "NO", value: "0" },
])

const yesnoList= ref([
  { label: "SI", value: "1" },
  { label: "NO", value: "0" },
])

const optionsGenero= ref([
  { label: "Masculino", value: "M" },
  { label: "Femenino", value: "F" },
])
const optionsEtnia= ref([
  { label: "Indigena", value: "1" },
  { label: "Afro", value: "2" },
  { label: "Mestizo", value: "3" },
  { label: "Blanco", value: "4" },
])

const optionsSangre= ref([
  { label: "A+", value: "1" },
  { label: "A-", value: "2" },
  { label: "B+", value: "3" },
  { label: "B-", value: "4" },
  { label: "AB+", value: "5" },
  { label: "O+", value: "6" },
  { label: "O-", value: "7" },
])
const optionsEscolaridad= ref([
  { label: "Si", value: "1" },
  { label: "No", value: "0" },
])
const optionsNivelEscolaridad= ref([
  { label: "Primaria", value: "1" },
  { label: "Secundaria", value: "2" },
  { label: "Graduado", value: "3" },
])

const optionsAfiliacion= ref([
  { label: "Subsidiado", value: "SUB" },
  { label: "Contributivo", value: "CON" },
  { label: "No tiene", value: "NA" },
])
const optionsRedes= ref([
  { label: "Facebook", value: "Facebook" },
  { label: "Instagram", value: "Instagram" },
  { label: "Telegram", value: "Telegram" },
  { label: "Twitter", value: "Twitter" },
])
const optionsEnterado= ref([
  { label: "Ente municipal", value: "Ente municipal" },
  { label: "Contributivo", value: "Ente deportivo" },
  { label: "Redes sociales", value: "Redes sociales" },
  { label: "Radio", value: "Radio" },
  { label: "Television", value: "Television" },
  { label: "Monitor deportivo", value: "Monitor deportivo" },
])

const healthEntities = computedAsync( async () => {
  return await getHealthentities();
}, null)

const data = ref(props.item);
let currentFicha = {...data.value,
    created_at:data.value.created_at.split("T")[0],
    name: data.value.full_name.split(" "),
    disability: data.value.disability==='0'?'No presenta': 'Sí',
    pathology: data.value.pathology==='0'?'No presenta':'Sí',  
    know_guardian: {...data.value.know_guardian,
        social_media: JSON.parse(data.value.know_guardian.social_media).join(', '),
        find_out: JSON.parse(data.value.know_guardian.find_out).join(', ')
    }
};




const onDownload = async (evt: any) => {
  evt.preventDefault();
  alerts.custom('', 'Descargando archivo...', 'info');
  //descargar 
}
const ethniacityList = ref([]);

onMounted(async () => {
  console.log(currentFicha);
  //peticion a la api para las listas desplegables, by rick.
  store.getListSelect().then((response) => {
    if (response?.status == 200) {
      ethniacityList.value = JSON.parse(JSON.stringify(response.data['ethniacity']));
    } else {
      alerts.custom("", "No se pudieron obtener los datos", "error");
    }
  });
});

</script>

<template>
  <!--HEADER--> 
	<div class="flex items-center justify-between mt-5 mb-2 intro-y">
    <a href="#"></a>
    
			<h1 class="mr-auto text-lg font-medium">Viendo Beneficiario</h1>
			<span class="ml-auto text-base font-medium">
				Estado:
				<span :class="
							currentFicha.status.slug == 'REC'
							? ' bg-danger/10 text-danger'
							: currentFicha.status.slug == 'ENP'
							? 'bg-success/10 text-success'
							: 'bg-primary/10 text-primary'
						" class="ml-2 inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium whitespace-nowrap">
						{{ currentFicha.status.name }}
				</span>
        
			</span>
    </div>    

  <div class="grid grid-cols-2 gap-6 justify-evenly">
    
    <div class="p-5 mt-5 col-span-2 intro-y box">

    <div class="my-4 text-lg bold text-left text-gray-800">
        Datos del beneficiario
    </div>

      <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
        <div class="col-span-2">
        <CommonInput
          label="Fecha de inscripción"
          name="temp"
          v-model="currentFicha.created_at"
          type="text"
          :disabled="true"
        />
        </div>
   
        <CommonInput
            label="Municipio"
            name="temp"
            v-model="currentFicha.municipality.name"
            type="text"
            :disabled="true"
          />

          <CommonSelect
            label="Disciplinas"
            name="temp"
            v-model="currentFicha.disciplines_id"
            :allowEmpty="false"
            :options="optionsDisciplinas"
            disabled
          />
          
          <div class="col-span-2">
          <CommonInput
            label="Nombre completo"
            name="temp"
            v-model="currentFicha.full_name"
            type="text"
            :disabled="true"
          />
          
        </div>
           
          <CommonInput
            label="Fecha de nacimiento"
            name="temp"
            v-model="currentFicha.birth_date"
            type="text"
            :disabled="true"
          />
 
          <CommonInput
            label="Lugar de nacimiento"
            name="temp"
            v-model="currentFicha.origin_place"
            type="text"
            :disabled="true"
          />

          <CommonSelect
            label="Tipo de Identificación"
            name="tipoIdentificacion"
            v-model="currentFicha.type_document"
            :allowEmpty="false"
            :options="optionsIdentificacion"
            disabled
          />

          <CommonInput
            label="Número de documento"
            name="temp"
            v-model="currentFicha.document_number"
            type="text"
            :disabled="true"
          />
       </div>

        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-3 gap-6 justify-evenly">
         
          <CommonInput
            label="Direccion de residencia"
            name="temp"
            v-model="currentFicha.home_address"
            type="text"
            :disabled="true"
          />
           
          <CommonInput
            label="Numero de celular"
            name="temp"
            v-model="currentFicha.phone"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Estrato"
            name="temp"
            v-model="currentFicha.stratum"
            type="text"
            :disabled="true"
          />
        </div>
        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">

          <CommonSelect
            label="Zona"
            name="zona"
            v-model="currentFicha.zone"
            :allowEmpty="false"
            :options="zonesList"
            disabled
          />

          <CommonSelect
            label="Victima de conflicto"
            name="victimaConflicto"
            v-model="currentFicha.conflict_victim"
            :allowEmpty="false"
            :options="yesnoList"
            disabled
          />
          <div class="col-span-2">
            <CommonInput
                label="Corregimiento/Barrio/Vereda"
                name="temp"
                v-model="currentFicha.distric"
                type="text"
                :disabled="true"
            /> 
            </div>
        </div>

        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">

          <CommonSelect
            label="Género"
            name="genero"
            v-model="currentFicha.gender"
            :allowEmpty="false"
            :options="optionsGenero"
            disabled
          />

          <CommonSelect
            label="Etnia"
            name="etnia"
            v-model="currentFicha.ethnicities_id"
            :allowEmpty="false"
            :options="ethniacityList"
            disabled
          />
          
          <CommonInput
            label="Discapacidad"
            name="temp"
            v-model="currentFicha.disability"
            type="text"
            :disabled="true"
          />
          <CommonInput
          v-if="currentFicha.pathology!=='No presenta'"
            label="¿Cual?"
            name="temp"
            v-model="currentFicha.other_disability"
            type="text"
            :disabled="true"
          />

          <CommonInput
            label="Patologia"
            name="temp"
            v-model="currentFicha.pathology"
            type="text"
            :disabled="true"
          />
          <CommonInput
          v-if="currentFicha.pathology!=='No presenta'"
            label="¿Cual?"
            name="temp"
            v-model="currentFicha.what_pathology"
            type="text"
            :disabled="true"
          />
          
          <CommonSelect
            label="Tipo de sangre"
            name="sangre"
            v-model="currentFicha.blood_type"
            :allowEmpty="false"
            :options="optionsSangre"
            disabled
          />

          <CommonInput
          label="Vivo con"
          name="temp"
          v-model="currentFicha.live_with"
          type="text"
          :disabled="true"
        />

          <CommonSelect
            class="mt-5 col-span-2"
            label="Escolaridad"
            name="escolaridad"
            v-model="currentFicha.scholarship"
            :allowEmpty="false"
            :options="yesnoList"
            disabled
        />

        <div v-if="currentFicha.scholarship === '1'" class="col-span-2 grid grid-cols-2 space-x-2">
            
            <CommonSelect
                label="Nivel de Escolaridad"
                name="nivel_escolaridad"
                v-model="currentFicha.scholar_level"
                :allowEmpty="false"
                :options="optionsNivelEscolaridad"
                disabled
              />
              
            <CommonInput
                label="Institución Educativa"
                name="institucion"
                v-model="currentFicha.institution"
                disabled
              />
          </div>

        <CommonSelect
            label="Tipo afiliacion(EPS)"
            name="afiliacion"
            v-model="currentFicha.affiliation_type"
            :allowEmpty="false"
            :options="optionsAfiliacion"
            disabled
          />

          <CommonSelect v-if="currentFicha.affiliation_type && currentFicha.affiliation_type !== 'NA'"
            label="Entidad de Salud"
            name="health_entity"
            v-model="currentFicha.health_entity_id"
            :allowEmpty="false"
            :options="healthEntities"
            disabled
          />
    </div>
</div>


    <div class="p-5 mt-5 col-span-2 intro-y box">
      <div class="my-5 text-lg bold text-left text-gray-800">
        Datos del acudiente
      </div>

        
        <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-3 gap-6 justify-evenly">
          <CommonInput
            label="Nombres"
            name="temp"
            v-model="currentFicha.acudiente.firts_name"
            type="text"
            :disabled="true"
          />
        
          <CommonInput
            label="Apellidos"
            name="temp"
            v-model="currentFicha.acudiente.last_name"
            type="text"
            :disabled="true"
          />
        
          <CommonInput
            label="Numero de documento"
            name="temp"
            v-model="currentFicha.acudiente.cedula"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Parentesco"
            name="temp"
            v-model="currentFicha.know_guardian.relationship"
            type="text"
            :disabled="true"
          />
          <CommonInput 
            label="Email"
            name="temp"
            v-model="currentFicha.acudiente.email"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Numero de celular"
            name="temp"
            v-model="currentFicha.acudiente.phone_number"
            type="text"
            :disabled="true"
          />
        </div>

        <div class="mt-5 mb-3 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
          <CommonInput
            label="Redes sociales"
            name="temp"
            v-model="currentFicha.know_guardian.social_media"
            type="text"
            :disabled="true"
          />
          <div :title="currentFicha.know_guardian.find_out"><CommonInput
            label="¿Como se entero del proyecto?"
            name="temp"
            v-model="currentFicha.know_guardian.find_out"
            type="text"
            :disabled="true"
          /></div>
        </div>
        <div class="w-full mt-10 flex justify-center">
            <Button variant="primary" class="btn btn-primary text-sm" @click="onDownload" :title="'Descargar formulario'">
                <Lucide :class="'mr-2'" :icon="'Download'"/> Descargar
            </Button>
        </div>
  </div>
</div> 
</template>