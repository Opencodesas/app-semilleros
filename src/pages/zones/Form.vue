//by rick
<script setup lang="ts">
import { addFile } from '@/types/filepond';
import { email, required } from '@vuelidate/validators'
import CommonFile from '@/components/CommonFile.vue'
import useVuelidate from '@vuelidate/core'
import Swal, { SweetAlertIcon } from "sweetalert2"
import { onboardingStore } from '@/stores/onboardingStore';

const store = onboardingStore();

const form = reactive({
    zone_id: '',
    user_id: ''
})

const form_rules = computed(() => ({
    zone_id: { required },
    user_id: { required }
}))

const v$ = useVuelidate(form_rules, form)
const router = useRouter()
const route = useRoute()
const routeName = computed(() => {
    return String(route.name).split('.')[0]
})

const zones = ref([]);
const users = [{ label: 'Seleccione un usuario', value: '0' }];
const user = ref([]);
onBeforeMount(async () => {
    await store.getListSelect().then((response) => {
        if (response?.status == 200 || response?.status == 201) {
            zones.value = JSON.parse(JSON.stringify(response.data["zones"]));
        } else {
            Swal.fire("", "No se pudieron obtener los datos", "error");
        }
    });
    await zoneServices.getZones().then((response) => {
        console.log(JSON.stringify(response?.data[0].id));
        for (var i = 0; i < response?.data.length; i++) {
            users.push({ label: `${response?.data[i]['users'].name}`, value: `${response?.data[i]['users'].id}` })
            console.log(users);

        }
        user.value = JSON.parse(JSON.stringify(users));
    });
});
const onSubmit = async () => {
    const valid = await v$.value.$validate()
    if (valid) {
        console.log(form.user_id);
        console.log(form.zone_id);
        await zoneServices.updateZone(`${form.user_id}`, form.zone_id).then((response) => {
            if (response) {
                if (response.status >= 200 && response.status <= 300) {
                    alerts.update();
                    setLoading(true);
                    router.push('').finally(() => {
                        setLoading(false)
                    })
                }
            }
        });
    }
    else {
        alerts.validation()
    }
}
</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <div class="flex items-center space-x-4">
            <CommonBackButton :to="'users_of_zones.index'" title="Listado" />
            <h2 class="mr-auto text-lg font-medium">Editar Region de usuario</h2>
        </div>
    </div>

    <div class="p-5 mt-5 intro-y box">
        <div class="grid grid-cols-1 md:grid md:grid-cols-2 gap-6 justify-evenly">
            <CommonSelect label="Selecciona el usuario *" name="user_id" v-model="form.user_id" :validator="v$"
                :options="user" />
            <CommonSelect label="Selecciona la region *" name="zone_id" v-model="form.zone_id" :validator="v$"
                :options="zones" />
        </div>

        <!-- <CommonInput type="date" label="Fecha nacimiento *" name="date_birth" v-model="form.date_birth" :validator="v$" /> -->
        <div class="mt-5 flex justify-end col-span-1 md:col-span-2">
            <Button variant="primary" class="btn btn-primary" @click="onSubmit">
                Actualizar
            </Button>
        </div>
        <!-- </div> -->
    </div>
</template>