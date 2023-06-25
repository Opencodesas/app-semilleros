import qs from 'qs'
type Select = 'municipalities' | 'groups' | 'validity_periods' | 'zones' | 'statuses' | 'disciplines' | 'roles' | 'departments' | 'bank_account_types' | 'identification_types' | 'banks' | 'objects' | 'months' | 'asistentList' | 'metodologoList' | 'managerList' | 'monitors';

export const getSelect = async (selects: Select[], auth = false) => {
    const parse = qs.stringify({ selects: selects, auth })
    const response = await api.get(`/api/v1/selects?${parse}`)

    return response.data.at(0) as Array<{ label: string, value: string | number }>
}