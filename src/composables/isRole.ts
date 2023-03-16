import roles from "@/types/roles"
import { onboardingStore } from "@/stores/onboardingStore"

export const isRole = (role: roles): boolean => {
    const store = onboardingStore()

    const findRole = store.userRoles?.some((userRole) => userRole.slug == role)

    return findRole ? findRole : false
}