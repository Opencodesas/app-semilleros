<template>
    <div class="flex items-center mt-8 intro-y"> 
        <div class="flex items-center space-x-4">
            <CommonBackButton :to="'beneficiaries.index'" title="Listado" />
            <h2 class="mr-auto text-lg font-medium">BENEFICIARIOS</h2>
        </div>
    </div>
    <!-- BEGIN: Page Layout -->
    <div class="p-5 mt-5 intro-y box">
      <CommonInput
        label="Fecha de inscripcion"
        name="fechaInscripcion"
        v-model="fechaInscripcion"
        :validator="v$"
        type="date"
      />
      <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-3 justify-evenly">
        <CommonSelect
          label="Municipio"
          name="municipio"
          v-model="municipio"
          :validator="v$"
          :options="municipalitiesList"
        />
        <CommonSelect
          label="disciplinas"
          name="disciplinas"
          v-model="disciplinas"
          :validator="v$"
          :options="diciplinesList"
        />
        <CommonInput
          label="nombres"
          name="nombres"
          v-model="nombres"
          :validator="v$"
        />
        <CommonInput
          label="Apellidos"
          name="apellidos"
          v-model="apellidos"
          :validator="v$"
        />
        <CommonInput
          label="Fecha de nacimiento"
          name="fechaNacimiento"
          type="date"
          v-model="fechaNacimiento"
          :validator="v$"
        />
        <CommonInput
          label="Lugar de nacimiento"
          name="lugarNacimiento"
          v-model="lugarNacimiento"
          :validator="v$"
        />
        <CommonSelect
          label="identificacion"
          name="tipoIdentificacion"
          v-model="tipoIdentificacion"
          :validator="v$"
          :options="optionsIdentificacion"
        />
        <CommonInput
          label="Numero de documento"
          name="numeroDocumento"
          v-model="numeroDocumento"
          :validator="v$"
        />
      </div>
      <div class="grid grid-cols-1 md:grid md:grid-cols-3 gap-6 justify-evenly">
        <CommonInput
          label="Direccion de residencia"
          name="direccionResidencia"
          v-model="direccionRes"
          :validator="v$"
        />
        <CommonInput
          label="Numero de celular"
          name="numeroCel"
          v-model="numeroCel"
          :validator="v$"
        />
        <CommonSelect
          label="Estrato"
          name="estrato"
          v-model="estrato"
          :validator="v$"
          :options="optionsEstrato"
        />
        <CommonSelect
          label="Zona"
          name="zona"
          v-model="zona"
          :validator="v$"
          :options="zonesList"
        />
        <CommonSelect
          label="Victima de conflicto"
          name="victimaConflicto"
          v-model="victimaConf"
          :validator="v$"
          :options="optionsVictima"
        />
        <CommonInput
          label="Corregimiento/Barrio/Vereda"
          name="pueblo"
          v-model="pueblo"
          :validator="v$"
        />
      </div>
      <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
        <CommonSelect
          label="Genero"
          name="genero"
          v-model="genero"
          :validator="v$"
          :options="optionsGenero"
        />
        <CommonSelect
          label="Etnia"
          name="etnia"
          v-model="etnia"
          :validator="v$"
          :options="ethniacityList"
        />
        <CommonSelect
          label="Discapacidad"
          name="discapacidad"
          v-model="discapacidad"
          :validator="v$"
          :options="optionsDiscapacidad"
        />
        <CommonInput
          label="¿Cual?"
          name="otroDisc"
          v-model="otroDiscapacidad"
          :validator="v$"
        />
        <CommonSelect
          label="Patologia"
          name="patologia"
          v-model="patologia"
          :validator="v$"
          :options="optionsPatologia"
        />
        <CommonInput
          label="¿Cual?"
          name="otroPato"
          v-model="otroPatologia"
          :validator="v$"
        />
        <CommonSelect
          label="Tipo de sangre"
          name="sangre"
          v-model="sangre"
          :validator="v$"
          :options="optionsSangre"
        />
        <CommonSelect
          label="Escolaridad"
          name="escolaridad"
          v-model="escolaridad"
          :validator="v$"
          :options="optionsEscolaridad"
        />
      </div>
      <CommonSelect
        class="mt-5"
        label="Vivo con"
        name="vivoCon"
        v-model="vivoCon"
        :validator="v$"
        :options="optionsVivo"
      />
      <CommonSelect class="mt-5"
        label="Tipo afiliacion(EPS)"
        name="afiliacion"
        v-model="afiliacion"
        :validator="v$"
        :options="optionsAfiliacion"
      />
      <h1 class="m-4 text-xl bold text-left text-gray-800">
        Datos del acudiente
      </h1>
      <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-3 gap-6 justify-evenly">
        <CommonInput
          label="Nombres"
          name="nombresAcudiente"
          v-model="nombresAcudiente"
          :validator="v$"
        />
        <CommonInput
          label="Apellidos"
          name="apellidosAcudiente"
          v-model="apellidosAcudiente"
          :validator="v$"
        />
        <CommonInput
          label="Numero de documento"
          name="nDocuAcudiente"
          v-model="nDocuAcudiente"
          :validator="v$"
        />
        <CommonInput
          label="Parentesco"
          name="parentesco"
          v-model="parentesco"
          :validator="v$"
        />
        <CommonInput label="Email" name="email" v-model="email" :validator="v$" />
        <!-- <FormCheckInput label="No tiene" name="checkEmail" v-model="checkEmail" type="checkbox" @click="check"/> -->
        <CommonInput
          label="Numero de celular"
          name="nCelularAcudiente"
          v-model="nCelularAcudiente"
          :validator="v$"
        />
        <!-- <FormCheck label="No tiene" name="checkNCel" v-model="form.checkNCel" />  -->
      </div>
      <div class="mt-5 grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
        <CommonSelect
          label="Redes sociales"
          name="redesAcudiente"
          v-model="redesAcudiente"
          :validator="v$"
          :options="optionsRedes"
        />
        <CommonSelect
          label="¿Como se entero del proyecto?"
          name="enterado"
          v-model="enterado"
          :validator="v$"
          :options="optionsEnterado"
        />
      </div>
      <br>
      <div class="flex justify-end col-span-1 md:col-span-2">
            <Button variant="warning" class="btn btn-primary" @click="">
                Actualizar registro
            </Button>
        </div>
    </div>
    
  </template>
  
  <script setup lang="ts">
  // import interfaces from '../interfaces/beneficiary';
  import axios from "@/services/beneficiary/beneficiary";
  import useVuelidate from "@vuelidate/core";
  import { defineComponent } from "vue";
  import { required } from "@vuelidate/validators";
  import FormCheckInput from "@/base-components/Form/FormCheck/FormCheckInput.vue";
  import { onboardingStore } from "@/stores/onboardingStore";
  import { useRoute, RouteLocationNormalizedLoaded, RouteLocationNormalized } from 'vue-router'
  import Swal from "sweetalert2";
  const store = onboardingStore();
  const form = reactive({
    fechaInscripcion: "",
    municipio: "",
    disciplinas: "",
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    tipoIdentificacion: "",
    numeroDocumento: "",
    direccionRes: "",
    numeroCel: "",
    estrato: "",
    zona: "",
    victimaConf: "",
    pueblo: "",
    genero: "",
    etnia: "",
    discapacidad: "",
    otroDiscapacidad: "",
    patologia: "",
    otroPatologia: "",
    sangre: "",
    escolaridad: "",
    vivoCon: "",
    afiliacion: "",
    nombresAcudiente: "",
    apellidosAcudiente: "",
    nDocuAcudiente: "",
    parentesco: "",
    email: "",
    nCelularAcudiente: "",
    redesAcudiente: "",
    enterado: "",
  });
  
  const form_rules = computed(() => ({
    fechaInscripcion: {  },
    municipio: {  },
    disciplinas: {  },
    nombres: {  },
    apellidos: {  },
    fechaNacimiento: {  },
    lugarNacimiento: {  },
    tipoIdentificacion: {  },
    numeroDocumento: {  },
    direccionResidencia: {  },
    numeroCel: {  },
    estrato: {  },
    zona: {  },
    victimaConflicto: {  },
    pueblo: {  },
    genero: {  },
    etnia: {  },
    discapacidad: {  },
    otroDisc: {  },
    patologia: {  },
    otroPato: {  },
    sangre: {  },
    escolaridad: {  },
    vivoCon: {  },
    afiliacion: {  },
    nombresAcudiente: {  },
    apellidosAcudiente: {  },
    nDocuAcudiente: {  },
    parentesco: {  },
    email: {  },
    // checkEmail: {},
    nCelularAcudiente: {  },
    // checkNCel: {},
    redesAcudiente: {  },
    enterado: {  },
  }));
  
  const municipalitiesList = ref([]);
  const diciplinesList = ref([]);
  const ethniacityList = ref([]);
  const zonesList = ref([]);
  //---------------------------//
  onMounted(async () => {
    //peticion a la api para las listas desplegables, by rick.
    store.getListSelect().then((response) => {
      if (response?.status == 200) {
        municipalitiesList.value = JSON.parse(JSON.stringify(response.data['municipalities']));
        diciplinesList.value = JSON.parse(JSON.stringify(response.data['diciplines']));
        ethniacityList.value = JSON.parse(JSON.stringify(response.data['ethniacity']));
        zonesList.value = JSON.parse(JSON.stringify(response.data["zones"]));
      } else {
        Swal.fire("", "No se pudieron obtener los datos", "error");
      }
    });
  });
  const v$ = useVuelidate(form_rules, form);
  </script>
  
  <script lang="ts">
  export default defineComponent({
    data() {
      return {
        fechaInscripcion: "",
        municipio: "",
        disciplinas: "",
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        tipoIdentificacion: "",
        numeroDocumento: "",
        direccionRes: "",
        numeroCel: "",
        estrato: "",
        zona: "",
        victimaConf: "",
        pueblo: "",
        genero: "",
        etnia: "",
        discapacidad: "",
        otroDiscapacidad: "",
        patologia: "",
        otroPatologia: "",
        sangre: "",
        escolaridad: "",
        vivoCon: "",
        afiliacion: "",
        nombresAcudiente: "",
        apellidosAcudiente: "",
        nDocuAcudiente: "",
        parentesco: "",
        email: "",
        nCelularAcudiente: "",
        redesAcudiente: "",
        enterado: "",
        optionsMunicipio: [
          { label: "cali", value: "1" },
          { label: "caicedonia", value: "2" },
          { label: "cartago", value: "3" },
          { label: "yumbo", value: "4" },
          { label: "alcala", value: "5" },
          { label: "florida", value: "6" },
          { label: "jamundi", value: "7" },
        ],
        optionsDisciplinas: [
          { label: "futbol", value: "1" },
          { label: "baloncesto", value: "2" },
          { label: "ajedrez", value: "3" },
          { label: "atletismo", value: "4" },
          { label: "badminton", value: "5" },
          { label: "boxeo", value: "6" },
          { label: "hapkido", value: "7" },
        ],
        optionsIdentificacion: [
          { label: "cedula", value: "1" },
          { label: "nit", value: "2" },
          { label: "tarjeta de identidad", value: "3" },
          { label: "pasaporte", value: "4" },
        ],
        optionsEstrato: [
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
        ],
        optionsZona: [
          { label: "REGION 1", value: "1" },
          { label: "REGION 2", value: "2" },
          { label: "REGION 3", value: "3" },
          { label: "REGION 4", value: "4" },
          { label: "REGION 5", value: "5" },
          { label: "REGION 6", value: "6" },
          { label: "REGION 7", value: "7" },
          { label: "REGION 8", value: "8" },
        ],
        optionsVictima: [
          { label: "SI", value: "1" },
          { label: "NO", value: "0" },
        ],
        optionsGenero: [
          { label: "Masculino", value: "Masculino" },
          { label: "Femenino", value: "Femenino" },
        ],
        optionsEtnia: [
          { label: "Indigena", value: "1" },
          { label: "Afro", value: "2" },
          { label: "Mestizo", value: "3" },
          { label: "Blanco", value: "4" },
        ],
        optionsDiscapacidad: [
          { label: "Si", value: "1" },
          { label: "No", value: "0" },
        ],
        optionsPatologia: [
          { label: "Si", value: "1" },
          { label: "No", value: "0" },
        ],
        optionsSangre: [
          { label: "A+", value: "1" },
          { label: "A-", value: "2" },
          { label: "B+", value: "3" },
          { label: "B-", value: "4" },
          { label: "AB+", value: "5" },
        ],
        optionsEscolaridad: [
          { label: "Si", value: "1" },
          { label: "No", value: "0" },
        ],
        optionsVivo: [
          { label: "Padre", value: "Padre" },
          { label: "Madre", value: "Madre" },
          { label: "Abuela", value: "Abuela" },
          { label: "Hermanos", value: "Hermanos" },
          { label: "Tios", value: "Tios" },
          { label: "Otros", value: "Otros" },
        ],
        optionsAfiliacion: [
          { label: "Subsidiado", value: "Subsidiado" },
          { label: "Contributivo", value: "Contributivo" },
          { label: "No tiene", value: "No tiene" },
        ],
        optionsRedes: [
          { label: "Facebook", value: "Facebook" },
          { label: "Instagram", value: "Instagram" },
          { label: "Telegram", value: "Telegram" },
        ],
        optionsEnterado: [
          { label: "Ente municipal", value: "Ente municipal" },
          { label: "Contributivo", value: "Ente deportivo" },
          { label: "Redes sociales", value: "Redes sociales" },
          { label: "Radio", value: "Radio" },
          { label: "Television", value: "Television" },
          { label: "Monitor deportivo", value: "Monitor deportivo" },
        ],
        checkEmail: false,
        checkNCel: false,
      };
    },
    computed: {},
    methods: {
      ingreso() {
        const data = {
          registration_date: this.fechaInscripcion,
          beneficiary_name: this.nombres,
          beneficiary_last_name: this.apellidos,
          birth_date: this.fechaNacimiento,
          origin_place: this.lugarNacimiento,
          identification_type: this.tipoIdentificacion,
          number_document: this.numeroDocumento,
          home_address: this.direccionRes,
          beneficiary_phone: this.numeroCel,
          stratum: this.estrato,
          conflict_victim: this.victimaConf,
          distric: this.pueblo,
          gender: this.genero,
          disability: this.discapacidad,
          pathology: this.patologia,
          scholarship: this.escolaridad,
          live_with: this.vivoCon,
          affiliation_type: this.afiliacion,
          attendant_name: this.nombresAcudiente,
          attendant_last_name: this.apellidosAcudiente,
          attendant_number_document: this.nDocuAcudiente,
          parentesco: this.parentesco,
          email: this.email,
          phone_number: this.numeroCel,
          social_media: this.redesAcudiente,
          find_out: this.enterado,
          municipalities_id: this.municipio,
          disciplines_id: this.disciplinas,
          zones_id: this.zona,
          ethnicities_id: this.etnia,
          blood_types_id: this.sangre,
  
          // datos prueba para la base de datos que no pueden ser null
          created_by: 1,
          full_name: this.nombres,
          accept: 1,
          linkage_project:1,
         
          document_number: this.numeroDocumento,
          phone:this.numeroCel,
          status: "REC",
  
        };
        axios.addBeneficiary(data).then((res: any) => {
          console.log(res)
          if(res){
            Swal.fire('', res.data.message, 'success').finally(() => {
            })
            this.limpiar();
          }
  
          
        });
      },
      limpiar() {
        this.fechaInscripcion = "";
        this.municipio = "";
        this.disciplinas = "";
        this.nombres = "";
        this.apellidos = "";
        this.fechaNacimiento = "";
        this.lugarNacimiento = "";
        this.tipoIdentificacion = "";
        this.numeroDocumento = "";
        this.direccionRes = "";
        this.numeroCel = "";
        this.estrato = "";
        this.zona = "";
        this.victimaConf = "";
        this.pueblo = "";
        this.genero = "";
        this.etnia = "";
        this.discapacidad = "";
        this.otroDiscapacidad = "";
        this.patologia = "";
        this.otroPatologia = "";
        this.sangre = "";
        this.escolaridad = "";
        this.vivoCon = "";
        this.afiliacion = "";
        this.nombresAcudiente = "";
        this.apellidosAcudiente = "";
        this.nDocuAcudiente = "";
        this.parentesco = "";
        this.email = "";
        this.nCelularAcudiente = "";
        this.redesAcudiente = "";
        this.enterado = "";
      },
      regresar() {
        window.alert("Regresa");
      },
      check() {
        this.checkEmail = !this.checkEmail;
      },
    },
    components: { FormCheckInput },
  });
  </script>