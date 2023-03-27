<script setup lang="ts">
import Lucide from '@/base-components/Lucide';
import ContractorDocumentsType from '@/types/contractorDocumentsTypes';
import dayjs from 'dayjs';
import type { Header, Item } from 'vue3-easy-data-table';
import CommonButtonLink from './CommonButtonLink.vue';
import ContractCancellation from './ContractCancellation.vue';
import Modal from './Modal.vue';

const storagePath = import.meta.env.VITE_BASE_URL;

const router = useRouter();
const route = useRoute();
const { isProvider } = useProvider();

/*
|--------------------------------------------------------------------------
| Props
|--------------------------------------------------------------------------
|
|   headers for table headers
|
|   items for table items (only refered headers will rendered)
|
|   label for delete modal
|
|   onDeleteFnc for button of delete modal
|
*/
const props = withDefaults(
	defineProps<{
		edit_gestor?: boolean;
		headers: Header[];
		items: Item[];
		item_see_fnc?: Function | boolean;
		item_see_fullview?: boolean;
		label: string;
		Form?: Object;
		management_permissions?: boolean;
		onDeleteFnc: Function;
        show_exports?: boolean;
        onEditFnc: Function;
	}>(),
	{
		edit_gestor: false,
		item_see_fnc: () => false,
		item_see_fullview: false,

		label: '',
		management_permissions: false,
		onDeleteFnc: () => false,
        show_exports: false,
        onEditFnc: () => false,
	}
);
// Spliting route.name >>> example >>> pecs.index = pecs
const routeName = computed(() => {
	return String(route.name).split('.')[0];
});

// const searchOptions = computed(() => {
//     const filter = props.headers
//         .filter((item: itemT) => item.value !== "actions")
//         .filter((item: itemT) => item.value !== "created_at")
//         .filter((item: itemT) => item.value !== "status")
//         .map((item: itemT) => {
//             return {
//                 value: item.value,
//                 label: item.text
//             }
//         }).sort((a, b) => {
//             const label_a = a.label.toLowerCase()
//             const label_b = b.label.toLowerCase()

//             if (label_a < label_b) {
//                 return -1;
//             }
//             if (label_a > label_b) {
//                 return 1;
//             }

//             // names must be equal
//             return 0;
//         })

//     return filter
// })

// const status_options = computed(() => {
//     let arr = options.status

//     arr.push({
//         label: 'TODOS',
//         value: 'all'
//     })

//     return arr
// })

// const conditions_role_admin = computed(() => {
//     return (mixins.computed.is_role('super.root') || mixins.computed.is_role('root')) ? true : false
// })

// const sorts = reactive({
//     by: '',
//     type: ''
// })

// const filters = reactive({
//     search_field: '',
//     search_value: '',
//     status_criteria: 'all',
//     user_status_criteria: '',
//     date_criteria_start: '',
//     date_criteria_end: ''
// })

// const filters_rules = computed(() => ({
//     search_field: {},
//     search_value: {},
//     status_criteria: {},
//     user_status_criteria: {},
//     date_criteria_start: {},
//     date_criteria_end: {}
// }))

// const v$ = useVuelidate(filters_rules, filters, { $autoDirty: true })

// const filter_options = computed((): FilterOption[] => {
//     const filter_options_arr: FilterOption[] = [];
//     if (filters.status_criteria != 'all') {
//         filter_options_arr.push({
//             field: 'status',
//             comparison: '=',
//             criteria: filters.status_criteria,
//         });
//     }
//     if (filters.user_status_criteria !== '') {
//         filter_options_arr.push({
//             field: 'status',
//             comparison: '=',
//             criteria: filters.user_status_criteria,
//         });
//     }
//     if (filters.date_criteria_start !== '') {
//         filter_options_arr.push({
//             field: 'created_at',
//             criteria: filters.date_criteria_start,
//             comparison: (value, criteria) => {
//                 const format_value = moment(value).format("YYYY-MM-DD")
//                 const date = new Date(format_value).getTime()
//                 const start_date = new Date(criteria).getTime()
//                 const end_date = computed(() => {
//                     if (filters.date_criteria_end !== '') {
//                         return new Date(filters.date_criteria_end).getTime()
//                     }
//                     else {
//                         return new Date().getTime()
//                     }
//                 })

//                 return (date >= start_date && date <= end_date.value)
//             },
//         });
//     }
//     return filter_options_arr;
// });

// const show_status = ref(false)
// const show_user_status = ref(false)
// const show_date = ref(false)

// Function for Edit
const editAction = (id: string | number) => {
	if (props.edit_gestor) {
		router.push({ name: `${routeName.value}.edit`, params: { id: id } });
	} else {
		router.push({ name: `${routeName.value}.edit`, params: { id: id } });
	}
};

const provider = computed(() => route.meta.provider);


// const computedActions = computed(() => {
//     const provider = route.meta.provider
//     if (provider == 'assistants') {
//         return 'assistants'
//     }
//     else {
//         return 'actions'
//     }
// })

const viewAction = (itemId: string) => {
	let routeData = router.resolve({
		name: 'documents.signature',
		query: {
			contract: itemId,
		},
	});
	window.open(routeData.href, '_blank', 'menubar=no');
};

const signatureAction = (itemId: string) => {
	let routeData = router.resolve({
		name: 'documents.signature',
		query: {
			contract: itemId,
		},
	});
	window.open(routeData.href, '_blank', 'menubar=no');
};

/*const editAction = () => {
    setLoading(true)
    router.replace('edit').finally(() => {
        setLoading(false)
    })
}
*/
const managementAction = (id: string | number) => {
	setLoading(true);
	router
		.push({ name: 'documents.management', query: { contractor: id } })
		.finally(() => {
			setLoading(false);
		});
	// router.replace('management').finally(() => {
	//     setLoading(false)
	// })
};

const contractorHandler = (name: string, id: string | number) => ({
	name,
	query: { contractor: id },
});

// const managementAction = (id: string | number) => {
//     if (props.edit_gestor) {
//         router.push({ name: `${routeName.value}.editManagers`, params: { id: id } })
//     }
//     else {
//         router.push({ name: `${routeName.value}.edit`, params: { id: id } })
//     }
// }

// const seeAction = (id: string | number) => {
//     if (props.edit_gestor) {
//         router.push({ name: `${routeName.value}.editManagers`, params: { id: id } })
//     }
//     else {
//         router.push({ name: `${routeName.value}.edit`, params: { id: id } })
//     }
// }

// const changePasswordAction = (id: string | number) => {
//     router.push({ name: `${routeName.value}.changePassword`, params: { id: id } })
// }

// const get_edit = (item: { user_id: string | number, created_by: string | number, status: statuses }) => {
//     const logged_id = onboarding_store.get_user.id as string | number
//     const { user_id, created_by, status } = item
//     const is_equals = created_by == logged_id || user_id == logged_id

//     if (status == 'REC' && is_equals) {
//         return true
//     }
//     else {
//         return false
//     }
// }

// onUpdated(() => {
//     const last_id = props.items.at(0).id

//     const doc = document.getElementById(`see_${last_id}`)
//     const btn = doc.firstElementChild as HTMLButtonElement

//     if (route.hash == '#after_created') {
//         btn.click()
//     }
// })

const sort = reactive({
	by: '',
	type: '',
});

const { find } = useApiV1();

const hasDocumentsHeader = computed(() =>
	props.headers.some(
		(header) =>
			header.value == 'documents' || header.value == 'contractor_documents'
	)
);

const contractorDocuments = computedAsync(async () => {
	if (hasDocumentsHeader.value) {
		const documents = await find<ContractorDocumentsType[]>('documents');
		return documents.data.map((document) => ({
			id: document.contractor_id,
			status: document.status.slug,
		}));
	}
}, null);

const contractorDocumentsCount = (id: number) =>
	contractorDocuments.value != null
		? contractorDocuments.value.filter((doc) => doc.id == id).length
		: 0;

const documentsCount = (id: number) => {
	if (contractorDocuments.value != null) {
		const count = contractorDocuments.value.filter((doc) => doc.id == id);
		const countAPR = count.filter((doc) => doc.status == 'APR');

		return `${countAPR.length} de ${count.length}`;
	}
};

const _getStatus = (status: any) => getStatus(status);

/*
|--------------------------------------------------------------------------
| Headers example
|--------------------------------------------------------------------------
|
|   const headers: Header[] = [
|      { text: "#", value: "id" },
|      { text: "NAC", value: "nac_id" },
|      { text: "ACCIONES", value: "actions"}
|   ];
|
|   Any question: pezedev
*/

/*
|--------------------------------------------------------------------------
| Items example
|--------------------------------------------------------------------------
|
|   const items = ref<Item[]>([])
|   items.value.map((item) => {
|        return {
|            ...item,
|            actions: 'Acciones'
|        }
|    })
|
|   const items: Item[] = [
|       {
|           id: 1,
|           nac_id: '12312',
|           actions: 'Acciones'
|       },
|   ];
|
|   Any question: pezedev
*/

/*
|--------------------------------------------------------------------------
| Label example
|--------------------------------------------------------------------------
|
|   label: la mesa de dialogo
|
*/

/*
|--------------------------------------------------------------------------
| onDeleteFnc example
|--------------------------------------------------------------------------
|
|    function deleteAction (id: string | number): any {
|        router.push({ name: 'pecs.delete', params: { id: id } })
|    }
|
*/
</script>

<template>
	<div class="intro-y flex flex-col gap-2">
		<section class="flex flex-col gap-3 lg:grid lg:grid-cols-4 lg:items-center">
			<!-- <div class="grid grid-cols-2 gap-3">
                                    <div class="w-full">
                                        <BaseSelect label="BUSCAR EN" tooltip="Seleccione en que campo quiere buscar"
                                            placeholder="Seleccione" name="search_field" v-model="filters.search_field"
                                            :options="searchOptions" :validator="v$" />
                                    </div>
                                    <div class="w-full">
                                        <BaseInput type="text" label="VALOR" tooltip="Ingrese el valor a buscar" placeholder="Valor"
                                            name="search_value" v-model="filters.search_value" :validator="v$" />
                                    </div>
                                </div> -->
			<!-- <div v-if="show_date" class="flex flex-col justify-start h-full">
                                    <label for="regular-form-2" class="form-label font-bold min-w-max mr-2">FECHA RANGO</label>
                                    <div class="grid grid-cols-2 gap-1.5 w-full intro-x">
                                        <BaseInput class="" type="date" tooltip="Desde" name="date_criteria_start"
                                            v-model="filters.date_criteria_start" :validator="v$" />
                                        <BaseInput class="" type="date" tooltip="Hasta" name="date_criteria_end"
                                            v-model="filters.date_criteria_end" :validator="v$" />
                                    </div>
                                </div>
                                <div v-if="show_status" class="flex items-start gap-6 h-full">
                                    <div class="w-full intro-x">
                                        <BaseSelect label="ESTADO" tooltip="" placeholder="Seleccione" name="status_criteria"
                                            v-model="filters.status_criteria" :options="status_options" :validator="v$"
                                            :allowEmpty="true" />
                                    </div>
                                </div>
                                <div v-if="show_user_status" class="flex items-start gap-6 h-full">
                                    <div class="w-full intro-x">
                                        <BaseSelect label="ESTADO" tooltip="" placeholder="Seleccione" name="user_status_criteria"
                                            v-model="filters.user_status_criteria" :options="[
                                                { label: 'ACTIVO', value: '1' },
                                                { label: 'INACTIVO', value: '0' }
                                            ]" :validator="v$" :allowEmpty="false" />
                                    </div>
                                </div> -->
		</section>
		<!-- :sort-by="sorts.by"
                            :filter-options="filter_options"
                            :search-field="filters.search_field"
                            :search-value="filters.search_value"
                            :sort-type="sorts.type" -->
		<DataTable
			:headers="headers"
			:items="items"
			buttons-pagination
			:sort-by="sort.by"
			:sort-type="sort.type"
			table-class-name="customize-table">
			<!-- <template #header-status="{ text }">
                                    <div class="flex gap-1 relative">
                                        <p>{{ text }}</p>
                                        <button @click="show_status = !show_status" :class="(show_status) ? 'opacity-100' : 'opacity-50'"
                                            class="hover:opacity-100 text-primary transition">
                                            <FilterIcon size="20" />
                                        </button>
                                    </div>
                                </template>
                                <template #header-user_status="{ text }">
                                    <div class="flex gap-1 relative">
                                        <p>{{ text }}</p>
                                        <button @click="show_user_status = !show_user_status"
                                            :class="(show_user_status) ? 'opacity-100' : 'opacity-50'"
                                            class="hover:opacity-100 text-primary transition">
                                            <FilterIcon size="20" />
                                        </button>
                                    </div>
                                </template>
                                <template #header-created_at="{ text }">
                                    <div class="flex gap-1 relative">
                                        <p>{{ text }}</p>
                                        <button @click="show_date = !show_date" :class="(show_date) ? 'opacity-100' : 'opacity-50'"
                                            class="hover:opacity-100 text-primary transition">
                                            <FilterIcon size="20" />
                                        </button>
                                    </div>
                                </template> -->
			<template #header-actions="{ text }">
				<div class="flex justify-end">
					{{ text }}
				</div>
			</template>
			<template #header-actionsDocuments="{ text }">
				<div class="flex justify-end">
					{{ text }}
				</div>
			</template>
			<template #header-actionsContracts="{ text }">
				<div class="flex justify-end">
					{{ text }}
				</div>
			</template>
			<template #item-full_name="item">
				<p>{{ `${item.name} ${item.lastname ? item.lastname : ''}` }}</p>
			</template>
			<template #item-contractor_fullname="item">
				<p>
					{{
						`${item.contractor.name} ${
							item.contractor.lastname ? item.contractor.lastname : ''
						}`
					}}
				</p>
			</template>
			<template #item-created_at="{ created_at }">
				<p>
					{{
						created_at != null && created_at != ''
							? dayjs(created_at).format('MM/DD/YYYY')
							: ''
					}}
				</p>
			</template>
			<template #item-documents="item">
				{{ documentsCount(item.id) }}
			</template>
			<template #item-contractor_documents="item">
				{{ documentsCount(item.contractor.id) }}
			</template>
			<template #item-status="item">
				<span
					:class="
						item.status.slug == 'REC' || item.status.slug == 'NUL'
							? ' bg-danger/10 text-danger'
							: item.status.slug == 'COM' || item.status.slug == 'APR'
							? 'bg-success/10 text-success'
							: 'bg-primary/10 text-primary'
					"
					class="inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium whitespace-nowrap">
					{{ _getStatus(item.status) }}
				</span>
			</template>
			<template #item-actions="item">
				<div class="flex gap-2 justify-end">
					<template v-if="isProvider('assistants')">
						<template v-if="hasDocumentsHeader && contractorDocuments != null">
							<template v-if="contractorDocumentsCount(item.id) < 21">
								<CommonButtonLink
									:to="{
										name: 'assistants.contractorsUpload',
										query: { contractor: item.id },
									}"
									variant="outline-secondary">
									<Lucide
										icon="FileUp"
										class="mr-2" />
									<span class="text-sm"> Cargar </span>
								</CommonButtonLink>
							</template>
							<template
								v-else-if="
									contractorDocumentsCount(item.id) >= 18 &&
									item.status.slug == 'REC'
								">
								<CommonButtonLink
									:to="{
										name: 'assistants.contractorsControl',
										query: { contractor: item.id },
									}"
									variant="outline-secondary">
									<Lucide
										icon="FileEdit"
										class="mr-2" />
									<span class="text-sm"> Revisar </span>
								</CommonButtonLink>
							</template>
						</template>
					</template>
					<!-- <template v-else-if="isProvider('subdirector_methodologist')">
						<template
							v-if="item.status.slug !== 'APR' && item.status.slug !== 'REC'">
							<Modal :Form="props.Form" />

							<CommonButtonLink
								:to="{
									name: 'subdirector_methodologist.reviewControl',
									params: { id: item.id },
								}"
								variant="outline-secondary">
								<Lucide
									icon="Eye"
									class="mr-2" />
								<span class="text-sm"> Revisar </span>
							</CommonButtonLink>
						</template>
					</template>
					<template v-else-if="isProvider('subdirector_coordinator')">
						<template
							v-if="item.status.slug !== 'APR' && item.status.slug !== 'REC'">
                            
							<CommonButtonLink
								:to="{
									name: 'subdirector_coordinator.reviewControl',
									params: { id: item.id },
								}"
								variant="outline-secondary">
								<Lucide
									icon="Eye"
									class="mr-2" />
								<span class="text-sm"> Revisar </span>
							</CommonButtonLink>
						</template>
					</template> -->
					<template v-else-if="isProvider('subdirector')">
						<template v-if="item.status.slug === 'REC' || item.status.slug === 'APR' && route.name 
						!== 'review.index'">
							<Button
								variant="outline-secondary"
								@click="editAction(item.id)">
								<Lucide
									icon="FileEdit"
									class="mr-2" />
								<span class="text-sm"> Editar </span>
							</Button>
							<Button variant="outline-danger"
                            @click="onDeleteFnc(item.id)">
								<Lucide
									icon="Delete"
									class="mr-2" />
								<span class="text-sm"> Eliminar </span>
							</Button>
						</template>
						<template
						v-else-if="item.status.slug === 'ENR' && route.name === 'review.index'">
						<template v-if="props.Form!">
							<Modal :Form="props.Form" :id_review="item.id" />
						</template>
					</template>
					</template>
					<template v-else-if="isProvider('subdirector')">
						<template v-if="item.status.slug === 'REC'">
							<Button
								variant="outline-secondary"
								@click="editAction(item.id)">
								<Lucide
									icon="FileEdit"
									class="mr-2" />
								<span class="text-sm"> Editar </span>
							</Button>
							<Button v-if="onDeleteFnc" variant="outline-secondary"
                            @click="onDeleteFnc(item.id)">
								<Lucide
									icon="Delete"
									class="mr-2" />
								<span class="text-sm"> Eliminar </span>
							</Button>
						</template>
					</template>
					<template v-else-if="isProvider('psychosocial')">
						<template v-if="item.status.slug == 'REC'">
							<Button
								variant="outline-secondary"
								@click="
									() => {
										router.push({
											name: 'psychosocial.custom-update',
											params: { status: 'REC' },
										});
									}
								">
								<Lucide
									icon="FileEdit"
									class="mr-2" />
								<span class="text-sm"> Editar </span>
							</Button>
						</template>
						<template v-else>
							<Button
								variant="outline-secondary"
								@click="
									() => {
										if (item.status.slug == 'APR') {
											router.push({
												name: 'psychosocial.custom-update',
												params: { status: 'APR' },
											});
										} else {
											router.push({
												name: 'psychosocial.custom-update',
												params: { status: 'ENR' },
											});
										}
									}
								">
								<Lucide
									icon="FileArchive"
									class="mr-2" />
								<span class="text-sm"> Visualizar </span>
							</Button>
						</template>
					</template>
					<template v-else>
						<Button
							variant="outline-secondary"
							@click="editAction(item.id)">
							<Lucide
								icon="FileEdit"
								class="mr-2" />
							<span class="text-sm"> Editar </span>
						</Button>
						<template v-if="item.status == 'PRO'">
							<!-- @click="editAction(item.id)" -->
							<Button
								variant="outline-pending"
								@click="signatureAction(item.consecutive)">
								<Lucide
									icon="FileSignature"
									class="mr-2" />
								<span class="text-sm"> Firmar </span>
							</Button>
						</template>
						<template v-if="item.status == 'APRO'">
							<!-- @click="editAction(item.id)" -->
							<Button variant="outline-success">
								<Lucide
									icon="FileCheck"
									class="mr-2" />
								<a
									class="text-sm"
									href="/Contrato.pdf"
									target="_blank">
									Contrato
								</a>
							</Button>
						</template>
					</template>
				</div>
			</template>
			<template #item-actionsDocuments="item">
				<div class="flex gap-2 justify-end">
					<template v-if="isProvider('legal')">
						<template v-if="item.status.slug == 'ENR'">
							<template v-if="item.contract.cap_date == null">
								<CommonButtonLink
									:to="contractorHandler('legal.documentsManagement', item.id)"
									variant="outline-secondary">
									<Lucide
										icon="FileDiff"
										class="mr-2" />
									<span class="text-sm"> Revision </span>
								</CommonButtonLink>
							</template>
							<template v-else> </template>
						</template>
						<template v-if="item.status.slug == 'COM'">
							<CommonButtonLink
								:to="contractorHandler('legal.contractsClauses', item.id)"
								variant="outline-secondary">
								<Lucide
									icon="FileSpreadsheet"
									class="mr-2" />
								<span class="text-sm"> Clausulas - CAP </span>
							</CommonButtonLink>
						</template>
					</template>
					<template v-else-if="isProvider('legalMaster')">
						<template v-if="item.status.slug == 'ENR'">
							<CommonButtonLink
								:to="
									contractorHandler('legalMaster.contractsManagement', item.id)
								"
								variant="outline-secondary">
								<Lucide
									icon="FileDiff"
									class="mr-2" />
								<span class="text-sm"> Revision </span>
							</CommonButtonLink>
						</template>
					</template>
					<template v-else> </template>
				</div>
			</template>
			<template #item-actionsContracts="item">
				<div class="flex gap-2 justify-end">
					<template v-if="isProvider('legal')">
						<template v-if="item.status.slug == 'APR'">
							<Button
								variant="outline-pending"
								@click="signatureAction(item.id)">
								<Lucide
									icon="FileSignature"
									class="mr-2" />
								<span class="text-sm"> Firmar </span>
							</Button>
						</template>
						<template v-if="item.status.slug == 'REC'">
							<CommonButtonLink
								:to="{
									name: 'legal.contractsClausesControl',
									query: { contractor: item.contractor_id },
								}"
								variant="outline-secondary">
								<Lucide
									icon="FileEdit"
									class="mr-2" />
								<span class="text-sm"> Revisar </span>
							</CommonButtonLink>
						</template>
					</template>
					<template v-else-if="isProvider('legalMaster')">
						<template v-if="item.status.slug == 'ENR'">
							<CommonButtonLink
								:to="{
									name: 'legalMaster.contractsManagement',
									query: { contractor: item.id },
								}"
								variant="outline-secondary">
								<Lucide
									icon="FileDiff"
									class="mr-2" />
								<span class="text-sm"> Revision </span>
							</CommonButtonLink>
						</template>
						<template v-if="item.status.slug == 'APR'">
							<ContractCancellation :contract="item" />
							<CommonButtonLink
								:to="{
									name: 'legalMaster.contractsViewer',
									query: { id: item.id },
								}"
								variant="outline-secondary">
								<Lucide
									icon="Eye"
									class="mr-2" />
								<span class="text-sm"> Ver </span>
							</CommonButtonLink>
						</template>
					</template>
					<template v-else-if="isProvider('manager')">
						<CommonButtonLink
							:to="{ name: 'manager.contractsViewer', query: { id: item.id } }"
							variant="outline-secondary">
							<Lucide
								icon="Eye"
								class="mr-2" />
							<span class="text-sm"> Ver </span>
						</CommonButtonLink>
					</template>
					<template v-else-if="isProvider('director')">
						<CommonButtonLink
							:to="{ name: 'director.contractsViewer', query: { id: item.id } }"
							variant="outline-secondary">
							<Lucide
								icon="Eye"
								class="mr-2" />
							<span class="text-sm"> Ver </span>
						</CommonButtonLink>
						<template v-if="item.status.slug == 'APR'">
							<CommonButtonLink
								:to="{
									name: 'director.contractsManagement',
									query: { id: item.id },
								}"
								variant="outline-secondary">
								<Lucide
									icon="FileDiff"
									class="mr-2" />
								<span class="text-sm"> Revision </span>
							</CommonButtonLink>
						</template>
					</template>
					<!-- <template v-if="isProvider('legal')">
                                            <template v-if="item.status.slug == 'ENR'">
                                                <template v-if="item.contract.cap_date == null">
                                                    <CommonButtonLink :to="contractorHandler('legal.documentsManagement', item.id)"
                                                        variant="outline-secondary">
                                                        <Lucide icon="FileDiff" class="mr-2" />
                                                        <span class="text-sm">
                                                            Revision
                                                        </span>
                                                    </CommonButtonLink>
                                                </template>
                                                <template v-else>
                                                </template>
                                            </template>
                                            <template v-if="item.status.slug == 'COM'">
                                                <CommonButtonLink :to="contractorHandler('legal.contractsClauses', item.id)"
                                                    variant="outline-secondary">
                                                    <Lucide icon="FileSpreadsheet" class="mr-2" />
                                                    <span class="text-sm">
                                                        Clausulas - CAP
                                                    </span>
                                                </CommonButtonLink>
                                            </template>
                                        </template>
                                        <template v-else>
                                        </template> -->
				</div>
			</template>
			<!-- 
                                <template #item-user_status="item">
                                    <div class="flex items-center">
                                        <ToggleStatus @toggle="emit('change_status')" :id="item.id" :actual_status="item.status" />
                                    </div>
                                </template>
                                <template #item-change_password="item">
                                    <div class="flex gap-2 justify-end">
                                        <button @click="changePasswordAction(item.id)"
                                            class="btn btn-success text-white flex flex-nowrap gap-1 items-center"
                                            v-if="conditions_role_admin">
                                            <ExternalLinkIcon icon="Password" class="w-5 h-5" />
                                            <span class="text-sm whitespace-nowrap">
                                                Cambiar contraseña
                                            </span>
                                        </button>
                                    </div>
                                </template> -->
		</DataTable>
	</div>
</template>
<style>
.customize-table {
	--easy-table-body-row-height: 60px;
	--easy-table-header-height: 60px;
	--easy-table-header-background-color: rgb(
		var(--color-slate-100) / var(--tw-bg-opacity)
	);
}
</style>
