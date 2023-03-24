<script lang="ts">
    import { ref, onMounted, defineComponent, Ref} from 'vue';
    import { storeToRefs } from 'pinia'
    import { addFile } from '@/types/filepond'
    import { email, required } from '@vuelidate/validators'
    import CommonFile from '@/components/CommonFile.vue'
    //import { useUser } from '@/stores/user'
    import { useVuelidate } from '@vuelidate/core'
    import { useRoute, RouteLocationNormalizedLoaded, RouteLocationNormalized } from 'vue-router'
    import { inject } from 'vue';
    import Swal, { SweetAlertIcon } from "sweetalert2"

    //const user_store = useUser();
    
        const router = useRouter()
        const route  = useRoute()

        const form =  reactive({
        address: '',
        document_number: '',
        document_type: '',
        email: '',
        gender: '',
        lastname: '',
        municipalities: '',
        name: '',
        period: '',
        phone: '',
        roles: '',
        zones: '',
        password: '',
        })

        const form_rules = computed(() => ({
            name:{required},
            address: { required },
            document_number: { required },
            document_type: { required },
            email: { required, email },
            gender: { required },
            lastname: { required },
            municipalities: { required },
            period: {},
            phone: { required },
            roles: { required },
            zones: { required },
            password: {},
        }))
        const v$ = useVuelidate(form_rules, form);
    export default defineComponent ({
        
        methods: {
            sendUpdate : async () => {
            const valid = await v$.value.$validate()
                if (valid) {
                    await userServices.update(route.params.id as string,formdataParser(form)).then((response) => {
                        if (response) {
                            if (response.status >= 200 && response.status <= 300) {
                                alerts.update()
                                setLoading(true)
                                router.push('beneficiaries.index').finally(() => {
                                    setLoading(false)
                                })
                            }
                        }
                    })
                }
                else {
                    alerts.validation()
                }
        }
        },
        setup() {
            const types = [
                {
                    label: 'Cédula de ciudadanía',
                    value: 'Cédula de ciudadanía'
                },
                {
                    label: 'Cédula de extranjeria',
                    value: 'Cédula de extranjeria'
                },
                {
                    label: 'Pasaporte',
                    value: 'Pasaporte'
                },
                {
                    label: 'NIT',
                    value: 'NIT'
                },
            ]
            const genders = [
                {
                    label: 'Masculino',
                    value: 'Masculino'
                },
                {
                    label: 'Femenino',
                    value: 'Femenino'
                },
            ]

            const towns = [
                {
                    label: 'Tulua',
                    value: 'Tulua'
                },
                {
                    label: 'Cali',
                    value: 'Cali'
                },
                {
                    label: 'Palmira',
                    value: 'Palmira'
                },
                {
                    label: 'Dagua',
                    value: 'Dagua'
                },
                {
                    label: 'El Cerrito',
                    value: 'El Cerrito'
                },
                {
                    label: 'Florida',
                    value: 'Florida'
                },
                {
                    label: 'Jamundí',
                    value: 'Jamundí'
                },
                {
                    label: 'Vijes ',
                    value: 'Vijes '
                },
                {
                    label: 'Yumbo',
                    value: 'Yumbo'
                }
            ]
            const zones = asyncComputed(async () => {
                return await getSelect(['zones'])
            }, null)

            const zone_id = computed(() => form.zones)

            const cities = asyncComputed(async () => {
                return zone_id.value ? await getCitiesByDepartment(zone_id.value) : []
            }, null)
            const roles = asyncComputed(async () => {
                const roles_data = await getSelect(['roles'])
                return roles_data.filter(({ value }) => value != '1')
            }, null)

            const municipalities = asyncComputed(async () => {
                return await getSelect(['municipalities'])
            }, null)
            const v$ = useVuelidate(form_rules, form);

            //Variable necesaria para mostrar el formulario solo despues del llamado a la Api
            const dataLoaded = ref(false);
            // Mostrar los valores de las variables reactivas después del montaje del componente

            const fetch = async () => {
                //console.log(3);
                await userServices.get(route.params.id as string).then((response) => {
                    console.log(response?.data.items);
                if (response?.status == 200 || response?.status == 201) {
                    Swal.fire('', response?.data.message, 'info').finally(() => {
                    });
                } else {
                    Swal.fire("", "No se pudieron obtener los datos", "error");
                }
                console.log(form);
            });
            };

            onMounted(async() => {
                console.log(route);
                await  fetch();
                dataLoaded.value = true;
            });
            // Retornar los datos que se utilizarán en el componente
            return {
                router,
                route,
                form,
                v$,
                types,
                genders,
                towns,
                roles,
                cities,
                municipalities,
                zones,
                dataLoaded
                
            };
        }
    })
</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <div class="flex items-center space-x-4">
            <CommonBackButton :to="'users.index'" title="Listado" />
            <h2 class="mr-auto text-lg font-medium">Editar Usuario</h2>
        </div>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly" v-if="dataLoaded">
            <CommonSelect class="col-span-1 md:col-span-2" label="Seleccione el Rol *" name="roles" v-model="form.roles"
                :validator="v$" :options="roles" />
            <CommonInput placeholder="Ingrese" type="text" label="Nombres *" name="name" v-model="form.name"
                :validator="v$" />
            <CommonInput placeholder="Ingrese" type="text" label="Apellidos *" name="lastname" v-model="form.lastname"
                :validator="v$" />
            <CommonInput placeholder="Ingrese" type="text" label="Dirección *" name="address" v-model="form.address"
                :validator="v$" />
            <CommonInput placeholder="Ingrese" type="number" label="Número de teléfono *" name="phone"
                v-model="form.phone" :validator="v$" />
            <CommonSelect label="Seleccione tipo documento *" name="document_type" v-model="form.document_type"
                :validator="v$" :options="types" />
            <CommonInput placeholder="Ingrese" type="number" label="Número de documento *" name="document_number"
                v-model="form.document_number" :validator="v$" />
            <CommonSelect label="Seleccione el genero *" name="gender" v-model="form.gender" :validator="v$"
                :options="genders" />
            <CommonInput type="email" label="Correo *" placeholder="Ingrese el correo" name="email" v-model="form.email"
                :validator="v$" />

            <CommonSelect label="Selecciona regiones *" name="zones" v-model="form.zones" :validator="v$" :options="zones" />
            <CommonSelect label="Seleccione la ciudad *" name="municipalities" v-model="form.municipalities" :validator="v$"
                :options="cities" />
            <br>
            <!-- <CommonInput type="hidden" name="password" :value="form.document_number" v-model="form.password" :validator="v$" />-->
        </div>
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly" v-else>
        Cargando datos...
        </div>

        <!-- <CommonInput type="date" label="Fecha nacimiento *" name="date_birth" v-model="form.date_birth" :validator="v$" /> -->
        <div class="flex justify-end col-span-1 md:col-span-2">
            <Button variant="warning" class="btn btn-primary" @click="sendUpdate">
                Actualizar registro
            </Button>
        </div>
        <!-- </div> -->
    </div>
</template>