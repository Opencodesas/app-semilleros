import { defineStore, acceptHMRUpdate } from "pinia";
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
      // {
      //   icon: "Activity",
      //   title: "Semilleros",
      //   subMenu: [
      //     {
      //       icon: "Activity",
      //       pageName: "users.index",
      //       title: "Usuarios",
      //     }, {
      //       icon: "Activity",
      //       pageName: "users_of_zones.index",
      //       title: "Usuarios por Region"
      //     },
      //     {
      //       icon: "Activity",
      //       pageName: "methodologist_visits.index",
      //       title: "Visita Metodólogo"
      //     },
      //     {
      //       icon: "Activity",
      //       pageName: "subdirector_visit.index",
      //       title: "Visita Subdirectora"
      //     },
      //     {
      //       icon: "Activity",
      //       pageName: "beneficiaries.index",
      //       title: "Beneficiarios"
      //     },
      //     {
      //       icon: "Activity",
      //       pageName: "chronograms.index",
      //       title: "Cronograma"
      //     },
      //   ]
      // },
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
            pageName: "psychosocial.visits",
            title: "Formatos",
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
          {
            icon: "Activity",
            pageName: "psychosocial-coordinator.prueba",
            title: "Prueba",
          },
        ]
      },
      {
        icon: "User",
        title: "Subdirector Tecnico Regional",
        subMenu: [
          {
            icon: "Activity",
            pageName: "technical_subdirector.visit",
            title: "Crear Visita",
          },
          {
            icon: "Activity",
            pageName: "technical_subdirector.visits",
            title: "Visitas Insertadas",
          },
        ]
      },
      {
        icon: "User",
        title: "Director Tecnico",
        subMenu: [
          {
            icon: "Activity",
            pageName: "technical_director.reviews",
            title: "Revisiones",
          },
        ]
      },
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
      else {
        return state.menu
      }
    }
  }
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useSideMenuStore, import.meta.hot))

