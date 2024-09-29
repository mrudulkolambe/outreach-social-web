import { auth } from '../config/firebase';

const useFirebaseToken = async (): Promise<string | null | undefined> => {
	return await auth.currentUser?.getIdToken();
};

export default useFirebaseToken;
