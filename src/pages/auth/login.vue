<script setup lang="ts">
import CommonInput from "@/components/CommonInput.vue";
import { onboardingStore } from "@/stores/onboardingStore";
import { useVuelidate } from "@vuelidate/core"
import { required } from "@vuelidate/validators";
import { loading } from '@/composables/loading'

const store = onboardingStore() 
const router = useRouter()

const form = reactive({
  email: "5676797567",
  password: "root",
})

const form_rules = computed(() => ({
  email: { required },
  password: { required }
}))

const v$ = useVuelidate(form_rules, form)

const onSubmit = async () => {
  const valid = await v$.value.$validate()

  if (valid){
    const response = await store.login(form)

    if (response?.status == 200){
      alerts.custom('Autenticación', 'Ha iniciado sesión con éxito', 'success')
      //console.log('ingresó rol: '+ store.get_user_role?.slug);
      router.push('/dashboard')
    }
    else {
      alerts.custom('Oops!', `${response?.data.message===undefined?"No se recibió respuesta de ningun servidor":response?.data.message}`, 'warning')
    }
  }
  else {
    alerts.validation()
  }
}

onBeforeMount(() => {
  store.$reset()
})
</script>

<template>
  <div :class="[
    '-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600',
    'before:hidden before:xl:block before:content-[\'\'] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400',
    'after:hidden after:xl:block after:content-[\'\'] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700',
  ]">
    <div class="container relative z-10 sm:px-10">
      <div class="block grid-cols-2 gap-4 xl:grid">
        <!-- BEGIN: Login Info -->
        <div class="flex-col hidden min-h-screen xl:flex">
          <a href="" class="flex items-center pt-5 -intro-x">
            <img alt="Semilleros" class="w-6" src="/semilleros.png" />
            <span class="ml-3 text-lg text-white"> Semilleros </span>
          </a>
          <div class="my-auto">
            <img alt="Semilleros" class="w-1/2 -mt-16 -intro-x" src="/images/illustration.svg" />
            <div class="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
              Unos clics mas para <br />
              iniciar sesion en tu cuenta.
            </div>
            <!-- <div class="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
              Manage all your e-commerce accounts in one place
            </div> -->
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
          <div
            class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
            <h2 class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
              Iniciar Sesion
            </h2>
            <!-- <div class="mt-2 text-center intro-x text-slate-400 xl:hidden">
              A few more clicks to sign in to your account. Manage all your
              e-commerce accounts in one place
            </div> -->
            <form @submit.prevent="onSubmit">
              <fieldset :disabled="loading">
                <div class="mt-8 space-y-4 intro-x">
                  <CommonInput name="email" placeholder="Identificación" v-model="form.email"  :validator="v$" />
                  <CommonInput type="password" name="password" placeholder="*******" v-model="form.password"  :validator="v$" />
                </div>
                <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                  <Button type="submit" variant="primary" class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3">
                    Ingresar
                  </Button>
                </div>
              </fieldset>
            </form>
            <!-- <div class="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left">
              By signin up, you agree to our
              <a class="text-primary dark:text-slate-200" href="">
                Terms and Conditions
              </a>
              &
              <a class="text-primary dark:text-slate-200" href="">
                Privacy Policy
              </a>
            </div> -->
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>
