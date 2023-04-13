export const getSelectStatus = async () => {
  const response = await api.get('/api/v1/get-status-select')
  return response.data as Array<{ label: string, value: string | number }>
}