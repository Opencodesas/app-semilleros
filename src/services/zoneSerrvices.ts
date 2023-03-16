let module = "userZones";
export const zoneServices = {
    getZones: async () => {
        setLoading(true);
        try {
            const response = await api.get(`/${apiPath}/${module}`).finally(() => { setLoading(false) });
            return response;
        } catch (e) {
            console.log(`Exception on getZones:${e} `);
        }
    },
    updateZone: async (id: String, zone_id: String) => {
        setLoading(true);
        try {
            const response = await api.post(`/${apiPath}/${module}/${id}?_method=PUT`, { "zones_id": zone_id }).finally(() => {
                setLoading(false)

            });
            console.log(response.data);
            return response;
        } catch (e) {
            console.log(`Exception on put method zones: ${e} `);
        }
    }
}