type Providers = 'legal' | 'legalMaster' | 'assistants' | 'manager' | 'director' | 'subdirector' | 'subdirector_methodologist' | 'psychosocial' | 'psychosocial-coordinator' | 'subdirector_coordinator' | 'technical_subdirector' | 'technical_director' | 'transversal_programs_director' | 'administrative_director';
export function useProvider() {
    const route = useRoute()

    function isProvider (provider: Providers) {
        console.log( route.meta );
        return route.meta.provider == provider
    }

    return {
        isProvider
    }
}