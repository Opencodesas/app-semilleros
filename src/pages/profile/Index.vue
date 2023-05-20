<script setup lang="ts">
import { onboardingStore } from '@/stores/onboardingStore';

const store = onboardingStore();

const user: any = store.user


</script>

<template>
    <div class="flex flex-col items-center">
        <div class="flex h-64 lg:w-3/5 sm:w-5/6 overflow-hidden mt-5 items-center justify-center" style="background-color: #00408A;">
            <img src="../../assets/images/fondo2.jpeg" class="h-64 object-cover">
        </div>
        <div class="text-center font-bold text-lg my-5 underline underline-offset-8 decoration-4 decoration-primary">Información Personal</div>
        <div class="flex flex-row border-slate-200/60 p-5 bg-white rounded-lg shadow-2xl lg:w-3/5 sm:w-5/6 items-center">
            <div class="flex flex-col px-2 flex-1 space-y-5">
                <div class="flex items-center">
                    <div
                        class=" flex border-2 p-1 border-cyan-900 rounded-full mr-2 h-10 w-10 text-cyan-900 bg-cyan-900/30 justify-center items-center">
                        <Lucide icon="User" />
                    </div>
                    <div>
                        <div class="text-base font-medium truncate sm:whitespace-normal text-slate-700">
                            {{ `${user?.name} ${user?.lastname}`  }}
                        </div>
                        <div class="text-slate-500">Nombre</div>
                    </div>
                </div>
                <div class="flex items-center">
                    <div
                        class="flex border-2 p-1 border-cyan-900 rounded-full mr-2 h-10 w-10 text-cyan-900 bg-cyan-900/30 justify-center items-center">
                        <Lucide icon="FileText" />
                    </div>
                    <div>
                        <div class="text-base font-medium truncate sm:whitespace-normal text-slate-700">
                            {{ user.document_type}}
                        </div>
                        <div class="text-slate-500">Tipo de documento de identidad</div>
                    </div>
                </div>
                <div class="flex items-center">
                    <div
                        class="flex border-2 p-1 border-cyan-900 rounded-full mr-2 h-10 w-10 text-cyan-900 bg-cyan-900/30 justify-center items-center">
                        <Lucide icon="Phone" />
                    </div>
                    <div>
                        <div class="text-base font-medium truncate sm:whitespace-normal text-slate-700">
                            {{ user?.phone }}
                        </div>
                        <div class="text-slate-500">Teléfono</div>
                    </div>
                </div>
                <div class="flex items-center">
                    <div
                        class="flex border-2 p-1 border-cyan-900 rounded-full mr-2 h-10 w-10 text-cyan-900 bg-cyan-900/30 justify-center items-center">
                        <Lucide icon="Users" />
                    </div>
                    <div>
                        <div class="text-base font-medium truncate sm:whitespace-normal text-slate-700">
                            {{ user?.roles[0].name }}
                        </div>
                        <div class="text-slate-500">Rol</div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col px-2 flex-1 space-y-5">
                <div class="flex items-center">
                    <div
                        class=" flex border-2 p-1 border-cyan-900 rounded-full mr-2 h-10 w-10 text-cyan-900 bg-cyan-900/30 justify-center items-center">
                        <Lucide icon="Mail" />
                    </div>
                    <div>
                        <div class="text-base font-medium truncate sm:whitespace-normal text-slate-700">
                            {{ user?.email }}
                        </div>
                        <div class="text-slate-500">Email</div>
                    </div>
                </div>
                <div class="flex items-center">
                    <div
                        class="flex border-2 p-1 border-cyan-900 rounded-full mr-2 h-10 w-10 text-cyan-900 bg-cyan-900/30 justify-center items-center">
                        <Lucide icon="CreditCard" />
                    </div>
                    <div>
                        <div class="text-base font-medium truncate sm:whitespace-normal text-slate-700">
                            {{ user?.document_number }}
                        </div>
                        <div class="text-slate-500">Numero de documento de identidad</div>
                    </div>
                </div>
                <div class="flex items-center">
                    <div
                        class="flex border-2 p-1 border-cyan-900 rounded-full mr-2 h-10 w-10 text-cyan-900 bg-cyan-900/30 justify-center items-center">
                        <Lucide icon="MapPin" />
                    </div>
                    <div>
                        <div class="text-base font-medium truncate sm:whitespace-normal text-slate-700">
                            {{ user?.address != null ? user?.address : 'No definido' }}
                        </div>
                        <div class="text-slate-500">Dirección</div>
                    </div>
                </div>
                <div class="flex items-center">
                    <div
                        class="flex border-2 p-1 border-cyan-900 rounded-full mr-2 h-10 w-10 text-cyan-900 bg-cyan-900/30 justify-center items-center">
                        <Lucide icon="User" />
                    </div>
                    <div>
                        <div class="text-base font-medium truncate sm:whitespace-normal text-slate-700">
                            {{ user?.gender != null ? user?.gender : 'No definido' }}
                        </div>
                        <div class="text-slate-500">Genero</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
