import { accessStore } from "@/stores/accessStore";
import { onboardingStore } from "@/stores/onboardingStore";
import { storeToRefs } from "pinia";
import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteMeta, RouteRecordRaw } from "vue-router";
// import SimpleMenu from "../layouts/SimpleMenu/SimpleMenu.vue";
// import TopMenu from "../layouts/TopMenu/TopMenu.vue";

const authGuard = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
	const { isAuth } = storeToRefs(onboardingStore())
	const storeAccess = accessStore()
	const canAccess = await storeAccess.canUserAccess(to.name as string)

	if (!isAuth && to.name != 'login')
		next({ name: 'login' })
	else {
		next()
		// if (!canAccess) {
		// 	if (from.name == '403' && !canAccess){
		// 		next({ name: 'login' })
		// 	}
		// 	else {
		// 		next({ name: '403' })
		// 	}
		// }
		// else {
		// 	next()
		// }
	}
}

const metaPropagation = (routes: RouteRecordRaw[], meta: RouteMeta) => {
	routes.forEach(route => {
		if (route.meta === undefined) {
			route.meta = meta
		}
		if (route.children !== undefined) {
			metaPropagation(route.children, route.meta)
		}
	});
}

const routes = [
	{
		path: '/',
		name: '/',
		component: () => import('@/pages/auth/login.vue'),
		beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
			next({ name: 'login' })
		}
	},
	{
		path: '/403',
		name: '403',
		component: () => import('@/pages/403.vue'),
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('@/pages/auth/login.vue')
	},
	{
		path: "/dashboard",
		name: 'dashboard',
		component: () => import('@/layouts/SideMenu/SideMenu.vue'),
		beforeEnter: authGuard,
		children: [
			{
				path: "",
				name: "side-menu-page-1",
				component: () => import('@/pages/Page1.vue'),
			},
			{
				path: "page-2",
				name: "side-menu-page-2",
				component: () => import('@/pages/Page2.vue'),
			},
			{
				path: "example-form",
				name: "example.create",
				component: () => import('@/pages/monitors/exampleForm.vue')
			},
			{
				path: "example-list",
				name: "example.index",
				component: () => import('@/pages/monitors/exampleCrud.vue')
			},
			{
				path: "assistants",
				name: "assistants",
				meta: { provider: 'assistants' },
				children: [
					{
						path: "contractors",
						children: [
							{
								path: "",
								name: "assistants.contractors",
								component: () => import('@/pages/contractor/Index.vue'),
							},
							{
								path: "create",
								name: "assistants.contractorsCreate",
								component: () => import('@/pages/contractor/Form.vue'),
							},
							{
								path: "upload",
								name: "assistants.contractorsUpload",
								component: () => import('@/pages/documents/Form.vue')
							},
							{
								path: "control",
								name: "assistants.contractorsControl",
								component: () => import('@/pages/documents/FormControl.vue')
							}
						],
					},
				]
			},
			{
				path: "contractors",
				name: "contractors",
				children: [
					{
						path: "",
						name: "contractors.index",
						meta: { provider: 'directors' },
						component: () => import('@/pages/contractor/Index.vue')
					},
					{
						path: "create",
						name: "contractors.store",
						component: () => import('@/pages/contractor/Form.vue')
					},
				]
			},
			{
				path: "chronograms",
				name: "chronograms",
				children: [
					{
						path: "",
						name: "chronograms.index",
						// meta: { provider: 'directors' },
						component: () => import('@/pages/chronogram/Index.vue')
					},
					{
						path: "create",
						name: "chronograms.store",
						component: () => import('@/pages/chronogram/Form.vue')
					},
				]
			},
			{
				path: "legal",
				name: "legal",
				meta: { provider: 'legal' },
				children: [
					{
						path: "documents",
						children: [
							{
								path: "",
								name: "legal.documents",
								component: () => import('@/pages/documents/Index.vue'),
							},
							{
								path: "management",
								name: "legal.documentsManagement",
								component: () => import('@/pages/documents/Management.vue'),
							}
						]
					},
					{
						path: "contracts",
						children: [
							{
								path: "",
								name: "legal.contracts",
								component: () => import('@/pages/contracts/Index.vue'),
							},
							{
								path: "clauses",
								name: "legal.contractsClauses",
								component: () => import('@/pages/contracts/Clauses.vue')
							},
							{
								path: "control",
								name: "legal.contractsClausesControl",
								component: () => import('@/pages/contracts/ClausesControl.vue')
							}
						]
					}
				],
			},
			{
				path: "legalMaster",
				name: "legalMaster",
				meta: { provider: 'legalMaster' },
				children: [
					{
						path: "contracts",
						children: [
							{
								path: "",
								name: "legalMaster.contracts",
								component: () => import('@/pages/contracts/Index.vue'),
							},
							{
								path: "viewer",
								name: "legalMaster.contractsViewer",
								component: () => import('@/pages/contracts/PDFViewer.vue'),
							},
							{
								path: "management",
								name: "legalMaster.contractsManagement",
								component: () => import('@/pages/contracts/Management.vue'),
							}
						]
					},
				],
			},
			{
				path: "manager",
				name: "manager",
				meta: { provider: 'manager' },
				children: [
					{
						path: "contracts",
						children: [
							{
								path: "",
								name: "manager.contracts",
								component: () => import('@/pages/manager/Contracts.vue'),
							},
							{
								path: "viewer",
								name: "manager.contractsViewer",
								component: () => import('@/pages/contracts/PDFViewer.vue'),
							},
						]
					},
				],
			},
			{
				path: "director",
				name: "director",
				meta: { provider: 'director' },
				children: [
					{
						path: "contracts",
						children: [
							{
								path: "",
								name: "director.contracts",
								component: () => import('@/pages/directors/Contracts.vue'),
							},
							{
								path: "viewer",
								name: "director.contractsViewer",
								component: () => import('@/pages/contracts/PDFViewer.vue'),
							},
							{
								path: "management",
								name: "director.contractsManagement",
								component: () => import('@/pages/directors/ContractsManagement.vue'),
							},
						]
					},
				],
			},
			{
				path: "documents",
				name: "documents",
				children: [
					{
						path: "",
						name: "documents.index",
						component: () => import('@/pages/documents/Index.vue'),
					},
					{
						path: "upload",
						name: "documents.store",
						component: () => import('@/pages/documents/Form.vue')
					},
					{
						path: "edit",
						name: "documents.update",
						component: () => import('@/pages/documents/Form.vue')
					},
					{
						path: "management",
						name: "documents.management",
						component: () => import('@/pages/documents/Management.vue')
					},
					{
						path: "signature",
						name: "documents.signature",
						meta: {
							hideMenu: true,
						},
						component: () => import('@/pages/documents/Signature.vue')
					}
				]
			},
			{
				path: "legal_reviews",
				name: "legal_reviews",
				children: [
					{
						path: "",
						name: "legal_reviews.index",
						component: () => import('@/pages/legal_reviews/Index.vue')
					},
					{
						path: "create",
						name: "legal_reviews.store",
						component: () => import('@/pages/legal_reviews/Form.vue')
					},
					{
						path: "edit",
						name: "legal_reviews.update",
						component: () => import('@/pages/legal_reviews/Form.vue')
					}
				]
			},
			{
				path: "beneficiaries",
				name: "beneficiaries",
				children: [
					{
						path: "index",
						name: "beneficiaries.index",
						component: () => import('@/pages/forms/Index.vue')
					},
					{
						path: "create",
						name: "beneficiaries.create",
						component: () => import('@/pages/forms/first_form.vue')
					},
					{
						path: ":id",
						name: "beneficiaries.edit",
						component: () => import('@/pages/forms/FormEdit.vue')
					}
				]
			},
			{
				path: "validity_periods",
				name: "validity-periods",
				children: [
					{
						path: "index",
						name: "validity_periods.index",
						component: () => import('@/pages/administrator/validity_period/Index.vue')
					},
					{
						path: "create",
						name: "validity_periods.store",
						component: () => import('@/pages/administrator/validity_period/Form.vue')
					},
					{
						path: "edit",
						name: "validity_periods.update",
						component: () => import('@/pages/administrator/validity_period/Form.vue')
					},
				]
			},
			{
				path: "methodologist_visits",
				name: "methodologist_visits",
				children: [
					{
						path: "",
						name: "methodologist_visits.index",
						component: () => import('@/pages/views/Index.vue')
					},
					{
						path: "create",
						name: "methodologist_visits.create",
						component: () => import('@/pages/views/Form.vue')
					},
					{
						path: "edit",
						name: "methodologist_visits.update",
						// component: () => import('@/pages/contractors/Form.vue')
					},
				]
			},


			{
				path: "subdirector_visit",
				name: "subdirector_visit",
				children: [
					{
						path: "index",
						name: "subdirector_visit.index",
						component: () => import('@/pages/visit/Index.vue')
					},
					{
						path: "create",
						name: "subdirector_visit.create",
						component: () => import('@/pages/subdirector/visit/Form.vue')
					},
					{
						path: "edit",
						name: "subdirector_visit.update",
						// component: () => import('@/pages/contractors/Form.vue')
					},
				]
			},	
			{
				path: "psychosocial",
				name: "psychosocial",
				meta: { provider: 'psychosocial' },
				children: [
					{
						path: "visit",
						name: "psychosocial.visit",
						component: () => import('@/pages/psychosocial/visit/Form.vue'),
					},
					{
						// {
						// 	path: "update/:id",
						// 	name: "psychosocial.update",
						// 	component: () => import('@/pages/...'),
						// },
						path: "custom-visit",
						name: "psychosocial.custom-visit",
						component: () => import('@/pages/psychosocial/custom-visit/Form.vue'),
					},
					{
						path: "custom-update/:id",
						name: "psychosocial.custom-update",
						component: () => import('@/pages/psychosocial/custom-visit/FormEdit.vue'),
					},
					{
						path: "visits",
						name: "psychosocial.visits",
						component: () => import('@/pages/psychosocial/visits/index.vue'),
					},
					{
						path: 'transversal-activity',
						name: 'psychosocial.transversal-activity',
						children: [
							{
								path: '',
								name: 'psychosocial.transversal-activity.index',
								component: () => import('@/pages/psychosocial/transversal-activity/Index.vue'),
							},
							{
								path: "create",
								name: "psychosocial.transversal-activity.create",
								component: () => import('@/pages/psychosocial/transversal-activity/Form.vue'),
							},
						]
					}
				],
			},
			{
				path: "psychosocial-coordinator",
				name: "psychosocial-coordinator",
				meta: { provider: 'psychosocial-coordinator' },
				children: [
					{
						path: "reviews",
						name: "psychosocial-coordinator.reviews",
						component: () => import('@/pages/psychosocial_coordinator/reviews/Index.vue'),
					},
				],
			},
			{
				path: "technical_director",
				name: "technical_director",
				meta: { provider: 'technical_director' },
				children: [
					{
						path: "visit",
						name: "technical_director.visit",
						component: () => import('@/pages/technical_director/visits/Form.vue'),
					},
					{
						path: "update/:id",
						name: "technical_director.update",
						component: () => import('@/pages/technical_director/visits/FormEdit.vue'),
					},
					{
						path: "visits",
						name: "technical_director.visits",
						component: () => import('@/pages/technical_director/visits/Index.vue'),
					},
				],
			},
			{
				path: "transversal_programs_director",
				name: "transversal_programs_director",
				meta: { provider: 'transversal_programs_director' },
				children: [
					{
						path: "reviews",
						name: "transversal_programs_director.reviews",
						component: () => import('@/pages/transversal_programs_director/reviews/Index.vue'),
					},
				],
			},
			{
				path: "subdirector",
				name: "subdirector",
				meta: { provider: 'subdirector' },
				children: [
					{
						path: "",
						name: "subdirector_visit.index",
						component: () => import('@/pages/subdirector/visit/Index.vue')
					},
					{
						path: "visit",
						name: "subdirector_visit.create",
						component: () => import('@/pages/subdirector/visit/Form.vue')
					},
					{
						path: "edit/:id",
						name: "subdirector_visit.edit",
						component: () => import('@/pages/subdirector/visit/Edit.vue')
					},
					{
						path: 'review',
						name: 'review.index',
						component: () => import('@/pages/subdirector/review/Index.vue')
					}
				]
			},
			{
				path: "administrative_director",
				name: "administrative_director",
				meta: { provider: 'administrative_director' },
				children: [
					{
						path: "reviews",
						name: "administrative_director.reviews",
						component: () => import('@/pages/administrative_director/reviews/directorVisit/Index.vue'),
					},
				],
			},
			{
				path: "subdirector",
				name: "subdirector",
				meta: { provider: 'subdirector' },
				children: [
					{
						path: "",
						name: "subdirector_visit.index",
						component: () => import('@/pages/subdirector/visit/Index.vue')
					},
					{
						path: "visit",
						name: "subdirector_visit.create",
						component: () => import('@/pages/subdirector/visit/Form.vue')
					},
					{
						path: "edit/:id",
						name: "subdirector_visit.edit",
						component: () => import('@/pages/subdirector/visit/Edit.vue')
					},
					{
						path: 'review',
						name: 'review.index',
						component: () => import('@/pages/subdirector/review/Index.vue')
					}
				]
			},

			{
				path: "users_of_zones",
				name: "users_of_zones",
				children: [
					{
						path: "index",
						name: "users_of_zones.index",
						component: () => import('@/pages/zones/Index.vue')
					},
					{
						path: "edit",
						name: "users_of_zones.edit",
						component: () => import('@/pages/zones/Form.vue')
					},
				]
			},
			{
				path: "users",
				name: "users",
				children: [
					{
						path: "index",
						name: "users.index",
						component: () => import('@/pages/user/Index.vue')
					},
					{
						path: "create",
						name: "users.create",
						component: () => import('@/pages/user/Form.vue')
					},
					{
						path: ":id",
						name: "users.edit",
						component: () => import('@/pages/user/FormEdit.vue')
					},
				]
			},
		],
	},
	{
		path: "/pdf-viewer",
		name: 'pdf.viewer',
		component: () => import('@/pages/viewPDF.vue'),
		beforeEnter: authGuard,
	}
] as RouteRecordRaw[];

metaPropagation(routes as RouteRecordRaw[], {})

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to, from, savedPosition) {
		return savedPosition || { left: 0, top: 0 };
	},
});

export default router;
