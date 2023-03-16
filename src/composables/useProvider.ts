type Providers = 'legal' | 'legalMaster' | 'assistants' | 'manager' | 'director';

export function useProvider() {
    const route = useRoute()

    function isProvider (provider: Providers) {
        return route.meta.provider == provider
    }

    return {
        isProvider
    }
}