export const getSelectStatus = async () => {
  setLoading(true)
  const response = await api.get('/api/v1/get-status-select')
  setLoading(false)
  return response.data as Array<{ label: string, value: string | number }>
}