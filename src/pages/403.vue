<script setup lang="ts">
import errorIllustration from "../assets/images/error-illustration.svg";
</script>

<template>
  <div class="py-2 bg-primary">
    <div class="container">
      <!-- BEGIN: Error Page -->
      <div class="flex flex-col items-center justify-center h-screen text-center error-page lg:flex-row lg:text-left">
        <div class="-intro-x lg:mr-20">
          <img alt="Semilleros" class="w-[450px] h-48 lg:h-auto" :src="errorIllustration" />
        </div>
        <div class="mt-10 text-white lg:mt-0">
          <div class="font-medium intro-x text-8xl">403</div>
          <div class="mt-5 text-xl font-medium intro-x lg:text-3xl">
            No tienes acceso.
          </div>
          <div class="mt-3 text-lg intro-x">
            Tal vez escribiste mal la URL o no tienes permisos para entrar a esta ruta.
          </div>
          <Button as="router-link" to="/dashboard"
            class="px-4 py-3 mt-10 text-white border-white intro-x">
            Ir al Dashboard
          </Button>
        </div>
      </div>
      <!-- END: Error Page -->
    </div>
  </div>
</template>