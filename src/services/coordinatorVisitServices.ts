const module = 'coordinator_visits'

export const coordinatorVisitServices = {
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
  downloadFilesMeto: async () => {
    try {
      setLoading(true)

      const response = await api.get(`/${apiPath}/cordinator/zips`).finally(() => {
        setLoading(false)
      })

      return response 
    } catch (error: any) {
      alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
    }   
  },
  downloadFilesCoor: async () => {
    try {
      setLoading(true)

      const response = await api.get(`/${apiPath}/cordinator/zips`).finally(() => {
        setLoading(false)
      })

      return response 
    } catch (error: any) {
      alerts.custom('ERROR', error.response.data.error ?? error.response.data.message, 'error')
    }
  },
  downloadFiles: async () => {
    try {
      setLoading(true)

      const response = await api.get(`/${apiPath}/zips`).finally(() => {
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
  update: async (id: string, payload: FormData) => {
    try {
      setLoading(true)

      const response = await api.post(`/${apiPath}/${module}/${id}`, payload).finally(() => {
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
}