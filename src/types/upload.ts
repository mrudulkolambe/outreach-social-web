interface MultiUploadResponse {
	status: string;
	results:  UploadedFile[]
}

interface UploadedFile {
	url: string;
	type: "image" | "video"
}