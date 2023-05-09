import { acceptHMRUpdate, defineStore } from "pinia";
import { Icon } from "../base-components/Lucide/Lucide.vue";

export interface Menu {
  icon: Icon;
  title: string;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | 'divider'>;
}

export const useSideMenuStore = defineStore("sideMenu", {
  state: (): SideMenuState => ({
    menu: [
      // /*{
      //   icon: "Activity",
      //   pageName: "side-menu-page-1",
      //   title: "Page 1",
      // },
      // {
      //   icon: "Activity",
      //   pageName: "side-menu-page-2",
      //   title: "Page 2",
      // },
      // {
      //   icon: "Activity",
      //   pageName: "example.create",
      //   title: "Formulario de Ejemplo",
      // },
      // {
      //   icon: "Activity",
      //   pageName: "example.index",
      //   title: "Listado de Ejemplo",
      // },*/
      {
        icon: "Activity",
        title: "Semilleros",
        subMenu: [
          {
            icon: "Activity",
            pageName: "users.index",
            title: "Usuarios",
          }, 
          /* {
            icon: "Activity",
            pageName: "users_of_zones.index",
            title: "Usuarios por Region"
          }, */
          /* {
            icon: "Activity",
            pageName: "methodologist_visits.index",
            title: "Visita Metodólogo"
          }, */
          /* {
            icon: "Activity",
            pageName: "subdirector_visit.index",
            title: "Visita Subdirectora"
          }, */
          {
            icon: "Activity",
            pageName: "beneficiaries.index",
            title: "Beneficiarios"
          },
          {
            icon: "Activity",
            pageName: "chronograms.index",
            title: "Cronograma"
          },
        ]
      },
      // {
      //   icon: "User",
      //   title: "Auxiliar",
      //   subMenu: [
      //     {
      //       icon: "Activity",
      //       pageName: "assistants.contractors",
      //       title: "Contratistas",
      //     },
      //     {
      //       icon: "Activity",
      //       pageName: "validity_periods.index",
      //       title: "Periodo Vigencia"
      //     },
      //   ],
      // },
      // {
      //   icon: "User",
      //   title: "Directores",
      //   subMenu: [
      //     // {
      //     //   icon: "Activity",
      //     //   pageName: "contractors.index",
      //     //   title: "Contratistas",
      //     // },
      //     {
      //       icon: "Activity",
      //       pageName: "director.contracts",
      //       title: "Contratos",
      //     }
      //   ]
      // },
      // {
      //   icon: "User",
      //   title: "Jurídico",
      //   subMenu: [
      //     {
      //       icon: "Activity",
      //       pageName: "legal.contracts",
      //       title: "Contratos",
      //     },
      //     {
      //       icon: "Activity",
      //       pageName: "legal.documents",
      //       title: "Revision de Documentos",
      //     },
      //   ]
      // },
      // {
      //   icon: "User",
      //   title: "Jurídico Master",
      //   subMenu: [
      //     {
      //       icon: "Activity",
      //       pageName: "legalMaster.contracts",
      //       title: "Contratos"
      //     }
      //   ]
      // },
      // {
      //   icon: "User",
      //   title: "Gerente",
      //   subMenu: [
      //     {
      //       icon: "Activity",
      //       pageName: "manager.contracts",
      //       title: "Contratos",
      //     }
      //   ]
      // },
      // // {
      // //   icon: "Activity",
      // //   title: "Administración",
      // //   subMenu: [
      // //     {
      // //       icon: "Activity",
      // //       pageName: "validity_periods.index",
      // //       title: "Periodo Vigencia"
      // //     },
      // //   ]
      // // },
      {
        icon: "User",
        title: "Reportes",
        subMenu: [
          {
            icon: "Activity",
            pageName: "reports.index",
            title: "Reportes",
          },
        ]
      },
      {
        icon: "User",
        title: "Subdirector",
        subMenu: [
          {
            icon: "Activity",
            pageName: "subdirector_visit.create",
            title: "Crear visita",
          },
          {
            icon: "Activity",
            pageName: "subdirector_visit.index",
            title: "Visitas",
          },
          {
            icon: "Activity",
            pageName: "review.index",
            title: "Revisiones",
          },
        ]
      },
      {
        icon: "User",
        title: "Psicosocial",
        subMenu: [
          {
            icon: "Activity",
            pageName: "psychosocial.visit",
            title: "Crear visita",
          },
          {
            icon: "Activity",
            pageName: "psychosocial.custom-visit",
            title: "Crear visita personalizada",
          },
          {
            icon: "Activity",
            pageName: "psychosocial.transversal-activity.create",
            title: "Crear actividades transversales",
          },
          {
            icon: "Activity",
            pageName: "psychosocial.visits",
            title: "Formatos",
          },
        ]
      },
      {
        icon: "User",
        title: "Coordinador Regional",
        subMenu: [
          {
            icon: "Activity",
            pageName: "coordinator.create",
            title: "Crear visita",
          },
          {
            icon: "Activity",
            pageName: "coordinator.index",
            title: "Visitas",
          },
          {
            icon: "Activity",
            pageName: "fichas_inscripcion.index",
            title: "Revisiones",
          },
        ]
      },
      {
        icon: "User",
        title: "Coordinador Psicosocial",
        subMenu: [
          {
            icon: "Activity",
            pageName: "psychosocial-coordinator.reviews",
            title: "Revisiones",
          },
        ]
      },
      {
        icon: "User",
        title: "Director Tecnico",
        subMenu: [
          {
            icon: "Activity",
            pageName: "technical_director.visit",
            title: "Crear visita",
          },
          {
            icon: "Activity",
            pageName: "technical_director.visits",
            title: "Visitas Ingresadas",
          },
          {
            icon: "Activity",
            pageName: "technical_director.reviews",
            title: "Revisiones",
          },
        ]
      },
      {
        icon: "User",
        title: "Director de Programas Transversales",
        subMenu: [
          {
            icon: "Activity",
            pageName: "transversal_programs_director.reviews",
            title: "Revisiones",
          },
        ]
      },
      {
        icon: "User",
        title: "Director Administrativo",
        subMenu: [
          {
            icon: "Activity",
            pageName: "administrative_director.reviews",
            title: "Revisiones",
          },
        ]
      },
      {
        icon: "User",
        title: "Asistente Administrativo",
        subMenu: [
          {
            icon: "Activity",
            pageName: "fichas_inscripcion.index",
            title: "Revisiones",
          },
        ]
      },
      {
        icon: "User",
        title: "Metodólogo",
        subMenu: [
          {
            icon: "Activity",
            pageName: "fichas_inscripcion.index",
            title: "Revisiones",
          },
          {
            icon: "Activity",
            pageName: "methodologist_visits.create",
            title: "Crear visita",
          },
          {
            icon: "Activity",
            pageName: "methodologist_visits.index",
            title: "Visitas"
          },
        ]
      },
      //vvvv MODULO FRONT DE CONTRATACION AÑADIDO POR PETICION DE ALEJANDRO 5/9/2023 vvvv
      {
        icon: 'Activity',
        title: 'Actividades',
        subMenu: [
          {
            icon: 'Activity',
            pageName: 'budget.active',
            title: 'Procesos Activos',
          },
          {
            icon: 'Activity',
            pageName: 'budget.store',
            title: 'Crear Informe',
          },
          {
            icon: 'Activity',
            pageName: 'budget.index',
            title: 'Informes Ingresados',
          }
        ]
      }
      //^^^^ MODULO FRONT DE CONTRATACION AÑADIDO POR PETICION DE ALEJANDRO 5/9/2023 ^^^^
    ],
  }),
  getters: {
    getMenu(state) {
      if (isRole('auxiliar_administrativo_tecnico')) {
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' : menuItem.subMenu?.some((subMenuItem) => subMenuItem.pageName?.includes('assistants')))
      }
      else if (isRole('apoyo_juridico')) {
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' : menuItem.subMenu?.some((subMenuItem) => subMenuItem.pageName?.split('.').at(0) == 'legal'))
      }
      else if (isRole('asistente_administrativo')){
        return state.menu.filter( (menuItem) => menuItem == 'divider' ? 'divider' : menuItem.title == "Coordinador Regional")
      }
      /*else if (isRole('director_juridico')){
        return state.menu.filter( (menuItem) => menuItem == 'divider' ? 'divider' : menuItem.title == "Director Jurídico")
      }*/
      else if (isRole('metodologo')){
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' : menuItem.subMenu?.some((subMenuItem) => subMenuItem.pageName?.split('.').at(0) == 'methodologist_visits'))
      }
      else if (isRole('subdirector_tecnico')){
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' : menuItem.subMenu?.some((subMenuItem) => subMenuItem.pageName?.split('.').at(0) == 'subdirector_visit'))
      }
      else if (isRole('coordinador_regional')){
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' :
        menuItem.subMenu?.some((subMenuItem) => (subMenuItem.pageName?.split('.').at(0) == 'coordinator'|| menuItem.title == "Asistente Administrativo") ))
      }
      else if (isRole('coordinador_psicosocial')){
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' : menuItem.subMenu?.some((subMenuItem) => subMenuItem.pageName?.split('.').at(0) == 'psychosocial-coordinator'))
      }
      else if (isRole('psicologo')){
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' : menuItem.subMenu?.some((subMenuItem) => subMenuItem.pageName?.split('.').at(0) == 'psychosocial'))
      }
      else if (isRole('director_tecnico')){
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' : menuItem.subMenu?.some((subMenuItem) => subMenuItem.pageName?.split('.').at(0) == 'technical_director'))
      }
      else {
        return state.menu
      }
    }
  }
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useSideMenuStore, import.meta.hot))

