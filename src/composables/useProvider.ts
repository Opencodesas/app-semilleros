type Providers = 'legal' | 'legalMaster' | 'assistants' | 'manager' | 'director' | 'psychosocial' | 'psychosocial-coordinator' | 'technical_subdirector';

export function useProvider() {
    const route = useRoute()

    function isProvider (provider: Providers) {
        return route.meta.provider == provider
    }

    return {
        isProvider
    }
}