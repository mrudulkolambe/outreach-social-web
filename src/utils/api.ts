import useFirebaseToken from "../hooks/useFirebaseToken";

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface RequestOptions {
	method: Method;
	body?: any;
}

const fetchWithToken = async (url: string, options: RequestOptions): Promise<Response> => {
	const token = await useFirebaseToken();
	const headers = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${token}`,
	};

	const response = await fetch(url, {
		...options,
		headers,
	});
	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}

	return response;
};

export const postReq = async (endpoint: string, body: any): Promise<Response> => {
	const response = await fetchWithToken(endpoint, {
		method: 'POST',
		body: JSON.stringify(body),
	});
	return response;
};

export const getReq = async (endpoint: string): Promise<Response> => {
	const response = await fetchWithToken(endpoint, {
		method: 'GET',
	});
	return response;
};

export const patchReq = async (endpoint: string, body: any): Promise<Response> => {
	const response = await fetchWithToken(endpoint, {
		method: 'PATCH',
		body: JSON.stringify(body),
	});
	return response;
};

export const deleteReq = async (endpoint: string): Promise<Response> => {
	const response = await fetchWithToken(endpoint, {
		method: 'DELETE',
	});
	return response;
};
