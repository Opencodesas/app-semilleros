let module = "users"

export const userServices = {
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
            console.log(response);
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
    },
    getHistory: async (id: string|string[]) => {
        try {
            setLoading(true)

            const response = await api.get(`/${apiPath}/${module}/history/${id}`).finally(() => {
                setLoading(false)
            })

            return response
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
    },
    toggleUserStatus: async (id: number, statusUSer: number) => {
        try {
            setLoading(true)

            const response = await api.post(`/${apiPath}/${module}/toggleUserStatus/${id}`).finally(() => {
                setLoading(false)
            })

            return response
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
    },
}