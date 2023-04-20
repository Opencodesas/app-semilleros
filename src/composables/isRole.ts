import roles from "@/types/roles"
import { onboardingStore } from "@/stores/onboardingStore"

export const isRole = (role: roles, user: any = null): boolean => {
    let findRole = null;

    if ( user ) {
        findRole = user.roles.some((_role: any) => _role.slug == role)
    } else {
        const store = onboardingStore()
        findRole = store.userRoles?.some((userRole) => userRole.slug == role)
    }


    return findRole ? findRole : false
}