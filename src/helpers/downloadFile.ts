export const downloadFile = (res: any) => {
	const link = document.createElement('a');
	const url = `${import.meta.env.VITE_BASE_URL}/${res.data}`;
	link.href = url;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
