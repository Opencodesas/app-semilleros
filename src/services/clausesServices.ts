let module = "clausesContracts"

export const clausesServices = {
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
    getAll: async () => {
        try {
            setLoading(true)

            const response = await api.get(`/${apiPath}/${module}`).finally(() => {
                setLoading(false)
            })

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
    update: async (id: string | number, payload: FormData) => {
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
    },
    findByContractor: async (id: string) => {
        try {
            setLoading(true)

            const response = await api.get(`/${apiPath}/${module}/findByContractor/${id}`).finally(() => {
                setLoading(false)
            })

            return response 
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
    }
}