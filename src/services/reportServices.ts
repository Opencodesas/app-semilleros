let module = "exports"
import dayjs from "dayjs";

const apiPath = import.meta.env.VITE_API_PATH;
const url_laravel = import.meta.env.VITE_BASE_URL;

interface Translations {
    [key: string]: string;
}

const translations: Translations = {
    users: "Usuarios",
    infoUsers: "Usuarios informacion",
    visitSubDirector: "Visitas subdirector",
    transversalActivity: "Actividades transversales",
    coordinatorVisit: "Visitas coordinador regional",
    customPsychologicalVisits: "Visitas personalizas psicosocial",
    inscriptions: "Fichas de inscripción",
    navigationHistory: "Historial de navegación",
};

const date = ref(dayjs().format("DD_MM_YYYY"));

export const reportServices = {

    exportExcel: async (type: string, form: FormData) => {
        try {
            setLoading(true)

            const response = await api.post(`/${apiPath}/${module}/excel/${type}`, form, {
                responseType: "blob",
            })
            .then((response) => {
                const url = URL.createObjectURL(
                    new Blob([response.data], {
                        type: "application/vnd.ms-excel",
                    })
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute(
                    "download",
                    translations[type] + "_" + date.value
                );
                document.body.appendChild(link);
                link.click();
                alerts.general("La exportación fue exitosa");
            });

            return response
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
    },
    exportPdf: async (type: string, form: FormData) => {
        try {
            setLoading(true)

            const response = await api.post(`/${apiPath}/${module}/pdf/${type}`, form)
            .then((response) => {
                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute(
                    "download",
                    type + "_" + date.value + ".pdf"
                );
                document.body.appendChild(link);
                link.click();
            });
            return response
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
    },
    exportZIP: async (type: string, form: FormData) => {
        try {
            setLoading(true)

            const response = await api.post(`/${apiPath}/${module}/pdf/${type}`, form)
            .then((response) => {
                window.open(
                    `${url_laravel}/${apiPath}/${module}/download/${type}`,
                    "_blank"
                );
            });

            return response
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
    },
    searchInfoReport: async (form: FormData) => {
        try {
            setLoading(true)

            const response = await api.post(`/${apiPath}/${module}/excel`, form)
            .finally(() => {
                setLoading(false);
            });
            return response
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
    },
}