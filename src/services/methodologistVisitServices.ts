let module = "methodologist_visits"


export const methodologistVisitServices = {
    get: async (id: string) => {
        try {
            setLoading(true)

            const response = await api.get(`/${apiPath}/${module}/${id}`).finally(() => {
                setLoading(false)
            })

            return response 
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
    },
    getAll: async (subdirector_id?: number) => {
        try {
            setLoading(true)
            let response
            if(subdirector_id){
                response = await api.get(`/${apiPath}/${module}?subdirector_id=${subdirector_id}`).finally(() => {
                setLoading(false)
            })
            }
            else {
                response = await api.get(`/${apiPath}/${module}`).finally(() => {
                    setLoading(false)
                })
            }

            return response
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
    },
    create: async (payload: FormData) => {
        try {
            setLoading(true)

            const response = await api.post(`/${apiPath}/${module}`, payload).finally(() => {
                setLoading(false)
            })

            return response
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
    },
    update: async (id: string, payload: FormData) => {
        try {
            setLoading(true)

            const response = await api.post(`/${apiPath}/${module}/${id}?_method=PUT`, payload).finally(() => {
                setLoading(false)
            })

            return response
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
    },
    delete: async (id: string) => {
        try {
            setLoading(true)

            const response = await api.delete(`/${apiPath}/${module}/${id}`).finally(() => {
                setLoading(false)
            })

            return response
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
    }
}