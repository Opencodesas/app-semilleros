<script setup lang="ts">
import { required } from '@/utils/validators';
import {
	Dialog,
	DialogPanel,
	TransitionChild,
	TransitionRoot,
} from '@headlessui/vue';
import { useVuelidate } from '@vuelidate/core';
import { computed, reactive, ref } from 'vue';

const isOpen = ref(false);

function closeModal() {
	isOpen.value = false;
}
function openModal() {
	isOpen.value = true;
}

const props = defineProps<{
	Form: Object;
	id_review: number;
}>();

const form = reactive({
	status: '',
	note: '',
	identifier_number: '',
});

const formRules = computed(() => ({
	status: { required },
	note: form.status == '4' ? { required } : {},
	identifier_number: form.status != '4' ? { required } : {},
}));

</script>

<template>
	<!-- BEGIN: Modal Toggle -->
	<div class="text-center">
		<Button
			outline-secondary
			@click="openModal()">
			<Lucide
				icon="Eye"
				class="mr-2" />
			<span class="text-sm">Revisar</span>
		</Button>
	</div>
	<!-- END: Modal Toggle -->
	<!-- BEGIN: Modal Content -->
	<TransitionRoot
		appear
		:show="isOpen"
		as="template">
		<Dialog
			as="div"
			class="relative z-[100]">
			<TransitionChild
				as="template"
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0">
				<div class="fixed inset-0 bg-black bg-opacity-25" />
			</TransitionChild>

			<div
				class="fixed inset-0 overflow-y-auto"
				@click.mouseover="closeModal()">
				<div
					class="flex w-full sm:w-4/5 mx-auto min-h-full items-center justify-center p-4 text-center">
					<TransitionChild
					class="w-full sm:w-4/5"
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95">
						<DialogPanel
							class="transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
							<!-- <Form /> -->
							<props.Form :closeModal="closeModal" :id_review="id_review" />
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>
