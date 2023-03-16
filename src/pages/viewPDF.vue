<script setup lang="ts">
import Lucide from '@/base-components/Lucide'
import apiPath from '@/helpers/apiPath';
import { VuePdf, createLoadingTask } from 'vue3-pdfjs'

const route = useRoute()
const apiUrl = import.meta.env.VITE_BASE_URL

const message = ref('')
const pdfSrc = ref<Uint8Array>()
const numOfPages = ref(0)

const readBase64 = async (imgUrl: string) => {
	message.value = 'Cargando...'
	await api.get(imgUrl, {
		responseType: 'blob',
	})
	.then((response) => {
		const reader = new FileReader()

		reader.readAsArrayBuffer(new Blob([response.data]))

		reader.onloadend = () => {
			const base64 = reader.result

			pdfSrc.value = new Uint8Array(reader.result as ArrayBuffer)

			const loadingTask = createLoadingTask(new Uint8Array(reader.result as ArrayBuffer))

			loadingTask.promise.then((pdf) => {
				numOfPages.value = pdf.numPages
			})
		}
	})
	.catch((err) => {
		let file = new Blob([err.response.data])
		file.text()
			.then(value => message.value = JSON.parse(value).at(0))
	})
}

onBeforeMount(async () => {
	await readBase64(`${apiUrl}/${apiPath}/get-document?file=${route.query.file}`)
})
</script>

<template>
	<div :class="[
		'max-w-full md:max-w-none rounded-[30px] md:rounded-none p-5 md:px-[22px] my-5 min-w-0 min-h-screen bg-slate-100 flex-1 relative',
		'before:content-[\'\'] before:w-full before:h-px before:block',
	]">
		<div class="intro-y box rounded-md">
			<template v-if="pdfSrc">
				<VuePdf v-for="page in numOfPages" :key="page" :src="pdfSrc" :page="page" />
			</template>
			<template v-else>
				<p>{{ message }}</p>
			</template>
		</div>
	</div>
</template>