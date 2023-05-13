import { acceptHMRUpdate, defineStore } from "pinia";
import { Icon } from "../base-components/Lucide/Lucide.vue";
import { onboardingStore } from "./onboardingStore";

export interface Menu {
  icon: Icon;
  title: string;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
  role?: string;
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
        title: "Monitor",
        subMenu: [
          // {
          //   role: 'monitor',
          //   icon: "Activity",
          //   pageName: "users.index",
          //   title: "Usuarios",
          // }, 
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
            role: 'monitor',
            icon: "Activity",
            pageName: "beneficiaries.index",
            title: "Beneficiarios"
          },
          {
            role: 'monitor',
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
            role: 'coordinador_regional',
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
            pageName: "review.bene_chro",
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
            pageName: "users.index",
            title: "Usuarios",
          },
          {
            icon: "Activity",
            pageName: "reports.index",
            title: "Reportes",
          },
          {
            icon: "Activity",
            pageName: "administrative_director.reviews",
            title: "Revisiones Visitas Directores Técnicos",
          },
        ]
      },
      {
        icon: "User",
        title: "Asistente Administrativo",
        subMenu: [
          {
            icon: "Activity",
            role: 'asistente_administrativo',
            pageName: 'fichas_inscripcion.index'/*"review.bene_chro"*/,
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
            role: 'metodologo',
            pageName: "methodologist_visits.create",
            title: "Crear visita",
          },
          {
            icon: "Activity",
            pageName: "methodologist_visits.index",
            title: "Visitas"
          },
          {
            icon: "Activity",
            pageName: "fichas_inscripcion.index",
            title: "Revisiones",
          },
          //cual es la diferencia entre el review general y el de metodologo?? @JuanChicue
          /*{
            icon: "Activity",
            pageName: "methodologist_visits.reviews",
            title: "Revisiones",
          },*/
        ]
      },
      //vvvv MODULO FRONT DE CONTRATACION AÑADIDO POR PETICION DE ALEJANDRO 5/9/2023 vvvv
      {
        icon: 'Activity',
        title: 'Actividades',
        subMenu: [
          {
            icon: 'Activity',
            role: 'monitor auxiliar_administrativo_tecnico apoyo_juridico asistente_administrativo metodologo subdirector_tecnico coordinador_regional coordinador_psicosocial psicologo director_tecnico director_administrator director_programa',
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
      if (isRole('monitor')) {
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' : menuItem.subMenu?.some((subMenuItem) => subMenuItem.role?.includes('monitor')))
      } 
      else if (isRole('auxiliar_administrativo_tecnico')) {
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' : menuItem.subMenu?.some((subMenuItem) => subMenuItem.pageName?.includes('assistants') || subMenuItem.role?.includes('auxiliar_administrativo_tecnico')))
      }
      else if (isRole('apoyo_juridico')) {
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' : menuItem.subMenu?.some((subMenuItem) => subMenuItem.pageName?.split('.').at(0) == 'legal' || subMenuItem.role?.includes('apoyo_juridico')))
      }
      else if (isRole('asistente_administrativo')){
        return state.menu.filter( (menuItem) => menuItem == 'divider' ? 'divider' : menuItem.subMenu?.some((subMenuItem) =>  subMenuItem.role?.includes('asistente_administrativo')))
      }
      /*else if (isRole('director_juridico')){
        return state.menu.filter( (menuItem) => menuItem == 'divider' ? 'divider' : menuItem.title == "Director Jurídico")
      }*/
      else if (isRole('metodologo')){
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' : menuItem.subMenu?.some((subMenuItem) => subMenuItem.pageName?.split('.').at(0) == 'methodologist_visits' || subMenuItem.role?.includes('metodologo') ))
      }
      else if (isRole('subdirector_tecnico')){
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' : menuItem.subMenu?.some((subMenuItem) => subMenuItem.pageName?.split('.').at(0) == 'subdirector_visit' || subMenuItem.role?.includes('subdirector_tecnico')))
      }
      else if (isRole('coordinador_regional')){
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' :
        menuItem.subMenu?.some((subMenuItem) => (subMenuItem.pageName?.split('.').at(0) == 'coordinator' || subMenuItem.role?.includes('coordinador_regional')) ))
      }
      else if (isRole('coordinador_psicosocial')){
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' : menuItem.subMenu?.some((subMenuItem) => subMenuItem.pageName?.split('.').at(0) == 'psychosocial-coordinator' || subMenuItem.role?.includes('coordinador_psicosocial')))
      }
      else if (isRole('psicologo')){
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' : menuItem.subMenu?.some((subMenuItem) => subMenuItem.pageName?.split('.').at(0) == 'psychosocial' || subMenuItem.role?.includes('psicologo')))
      }
      else if (isRole('director_tecnico')){
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' : menuItem.subMenu?.some((subMenuItem) => subMenuItem.pageName?.split('.').at(0) == 'technical_director' || subMenuItem.role?.includes('director_tecnico')))
      }
      else if (isRole('director_administrator')){
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' : menuItem.subMenu?.some((subMenuItem) => subMenuItem.pageName?.split('.').at(0) == 'administrative_director' || subMenuItem.role?.includes('director_administrator')))
      }
      else if (isRole('director_programa')){
        return state.menu.filter((menuItem) => menuItem == 'divider' ? 'divider' : menuItem.subMenu?.some((subMenuItem) => subMenuItem.pageName?.split('.').at(0) == 'transversal_programs_director' || subMenuItem.role?.includes('director_programa')))
      }
      else {
        return state.menu
      }
    }
  }
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useSideMenuStore, import.meta.hot))

