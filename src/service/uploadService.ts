import { endpoints } from '@/config/endpoints';
import axios from 'axios';

async function uploadMultipleFiles(files: SelectedFile[], path: string): Promise<MultiUploadResponse | null> {
	let data = new FormData();
	files.forEach((file) => {
		console.log(file)
		data.append('files', file.file);
	})

	data.append('path', path);

	let config = {
		method: 'POST',
		maxBodyLength: Infinity,
		url: endpoints['multi-file-upload'],
		data: data
	};

	// Make the API request
	const response = await axios.request(config)
	console.log("Upload Response", response.data)
	return response.data
}


export { uploadMultipleFiles }