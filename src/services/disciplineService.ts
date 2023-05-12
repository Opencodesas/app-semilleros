let module = "disciplines"

export const disciplineService = {
    byUser: async (id: number) => {
        try {
            setLoading(true)

            const response = await api.get(`/${apiPath}/${module}/by-user/${id}`).finally(() => {
                setLoading(false)
            })

            return response 
        } catch (error: any) {
            alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
        }
    },
    
}