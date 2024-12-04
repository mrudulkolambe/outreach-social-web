interface MultiUploadResponse {
	status: string;
	results:  UploadedFile[]
}
interface SingleUploadResponse {
	status: string;
	media:  UploadedFile
}

interface UploadedFile {
	url: string;
	type: "image" | "video"
}