import { defineStore } from "pinia"
import roles from "@/types/roles"

interface roleT {
	id: number
	name: string
	slug: roles
	description: string
	'full-access': string
	public: number
	created_at: string
	updated_at: string
	deleted_at: string
	pivot: {
		user_id: number
		role_id: number
	}
	permissions: []
}

interface userT {
	id?: number
	name?: string
	document_number?: string
	profile_photo_path?: string
	email?: string
	email_verified_at?: string
	two_factor_secret?: string
	two_factor_recovery_codes?: string
	status?: number
	created_at?: string
	updated_at?: string
	deleted_at?: string
	roles?: roleT[]
}

interface stateT {
	user: userT
	roles: Object
	isAuth: boolean
}

export const onboardingStore = defineStore("onboarding", {
	state: (): stateT => ({
		user: {},
		isAuth: false,
		roles: {},
	}),
	getters: {
		get_user: (state) => {
			return state.user
		},
		get_user_role: (state) => {
			if (state.user.roles) {
				return state.user.roles[0] as roleT
			}
		},
		userRoles: (state) => {
			if (state.user.roles) {
				return state.user.roles
			}
		}
	},
	actions: {
		async login(values: { email: string, password: string }) {
			try {
				const result = await onboardingServices.login(values);
				
				// Si el usuario no tiene perfil
				if (result.status == 200) {
					this.set_auth(result.data.user)
					// localStorage.setItem("user", JSON.stringify(result.data.user));
					// localStorage.setItem("roles", JSON.stringify(result.data.data.roles));
					// localStorage.setItem("isAuth", JSON.stringify(true));

					// this.user = result.data.user;
					// this.roles = result.data.data.roles;
					// this.isAuth = true;
				}
				return result;
			} catch (error: any) {
				return error?.response;
			}
		}, async getListSelect() {
			try {
				const response = await onboardingServices.getSelectLists();

				if (response.status == 200) {
					console.log("success fecth data")
					console.log(response.data);
				} else {
					console.log("error");
					console.log(response.status);
					console.log(response.request);
				}
				return response;
			} catch (e) {
				console.log(e);
			}

		},
		async logout() {
			try {
				const result = await onboardingServices.logout();
				this.unset_auth()
				return result
			} catch (error) {
				// return error.response
			}
		},
		set_auth(user: userT) {
			this.$patch(state => {
				state.user = user,
				state.isAuth = true
			})
		},
		unset_auth() {
			this.$reset()
		},
	},
	persist: true
});
