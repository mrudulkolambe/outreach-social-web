const firebaseErrorMessages: { [key: string]: string } = {
	'auth/invalid-email': 'The email address is not valid.',
	'auth/user-disabled': 'This user has been disabled.',
	'auth/user-not-found': 'There is no user corresponding to this email.',
	'auth/wrong-password': 'The password is incorrect.',
	'auth/email-already-in-use': 'This email is already in use.',
	'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
	'auth/weak-password': 'The password is too weak.',
	'auth/invalid-credential': 'The credential provided is not valid.'
};

export const getErrorMessage = (errorCode: string): string => {
	return firebaseErrorMessages[errorCode] || 'An unknown error occurred. Please try again.';
};
