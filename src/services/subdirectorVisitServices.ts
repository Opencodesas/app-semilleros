const module = "subdirector_visits"


export const subdirectorVisitServices = {
    get: async (id: string) => {

        try {
            setLoading(true)

            const response = await api.get(`/${apiPath}/${module}?id=${id}`).finally(() => {
                setLoading(false)
            })

            return response 
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
    },
    getAll: async (user_id?: string, director_id?: number) => {
        try {
            setLoading(true)
            
            let response
            
            if (director_id) {
                response = await api.get(`/${apiPath}/${module}?director_id=${director_id}`).finally(() => {
                    setLoading(false)
                })
            } else {

            response = await api.get(`/${apiPath}/${module}?user_id=${user_id}`).finally(() => {
                setLoading(false)
            })
            }

            return response
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
    },
    create: async (payload: FormData, user_id: number) => {
        try {
            setLoading(true)

            const response = await api.post(`/${apiPath}/${module}?user_id=${user_id}`, payload).finally(() => {
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

            const response = await api.post(`/${apiPath}/${module}?_method=PUT&id=${id}`, payload).finally(() => {
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

            const response = await api.delete(`/${apiPath}/${module}?id=${id}`).finally(() => {
                setLoading(false)
            })

            return response
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
    }
}