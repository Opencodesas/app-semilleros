type Providers = 'legal' | 'legalMaster' | 'assistants' | 'manager' | 'director' | 'subdirector' | 'subdirector_methodologist' | 'psychosocial' | 'psychosocial-coordinator' | 'subdirector_coordinator' | 'technical_subdirector';
export function useProvider() {
    const route = useRoute()

    function isProvider (provider: Providers) {
        return route.meta.provider == provider
    }

    return {
        isProvider
    }
}