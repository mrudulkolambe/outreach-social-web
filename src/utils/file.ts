const getFileType = (file: File): SelectedFile['type'] => {
	const fileType = file.type;
	if (fileType === 'video/mp4') return 'mp4';
	if (fileType === 'video/quicktime') return 'mov';
	if (fileType === 'image/png') return 'png';
	if (fileType === 'image/jpeg') return 'jpg';
	if (fileType === 'image/jpg') return 'jpg';
	return 'unknown';
};
export { getFileType }