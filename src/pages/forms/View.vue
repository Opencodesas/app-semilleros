<script setup lang="ts">

const props = defineProps<{
    item?: any;
	closeModal: Function;
}>();


const data = ref(props.item);
let currentFicha = {...data.value,
    created_at:data.value.created_at.split("T")[0],
    name: data.value.full_name.split(" "),
    disability: data.value.disability==='0'?'No presenta':data.value.disability,
    pathology: data.value.pathology==='0'?'No presenta':data.value.disability,  
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

       
          <CommonInput
            label="Disciplinas"
            name="temp"
            v-model="currentFicha.disciplines_id"
            type="text"
            :disabled="true"
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
            v-model="currentFicha.registration_date"
            type="text"
            :disabled="true"
          />
        
          <CommonInput
            label="Tipo de Identificación"
            name="temp"
            v-model="currentFicha.type_document"
            type="text"
            :disabled="true"
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
          <CommonInput
            label="Zona"
            name="temp"
            v-model="currentFicha.zone"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Victima de conflicto"
            name="temp"
            v-model="currentFicha.conflict_victim"
            type="text"
            :disabled="true"
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
          <CommonInput
            label="Genero"
            name="temp"
            v-model="currentFicha.gender"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Etnia"
            name="temp"
            v-model="currentFicha.ethnicities_id"
            type="text"
            :disabled="true"
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
          
          <CommonInput
            label="Tipo de sangre"
            name="temp"
            v-model="currentFicha.blood_type"
            type="text"
            :disabled="true"
          />
          <CommonInput
            label="Escolaridad"
            name="temp"
            v-model="currentFicha.scholarship"
            type="text"
            :disabled="true"
          />

        <CommonInput
          label="Vivo con"
          name="temp"
          v-model="currentFicha.live_with"
          type="text"
          :disabled="true"
        />

        <CommonInput
          label="Tipo afiliacion(EPS)"
          name="temp"
          v-model="currentFicha.affiliation_type"
          type="text"
          :disabled="true"
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
        <div class="w-full flex justify-center">
            <Button variant="primary" class="btn btn-primary text-sm" @click="onDownload" :title="'Descargar formulario'">
                <Lucide :class="'mr-2'" :icon="'Download'"/> Descargar
            </Button>
        </div>
  </div>
</div> 
</template>