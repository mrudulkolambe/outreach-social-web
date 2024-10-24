import { endpoints } from '@/config/endpoints';
import { postReq } from '@/utils/api';
import { toast } from 'sonner';

async function createSupportRequest(data: any, cb: () => void): Promise<void> {
	const response = await postReq(endpoints["create-support"], data);
	console.log(response.ok)
	if (response.status === 201 || response.status === 200) {
		toast.success("Support request created!")
		cb()
	} else {
		toast.error("Something went wrong!")
	}
}


export { createSupportRequest }