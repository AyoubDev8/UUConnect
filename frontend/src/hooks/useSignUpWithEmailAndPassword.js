import { useState } from 'react';
import { authService } from '../services/api';
import useShowToast from './useShowToast';
import useAuthStore from '../store/authStore';

const useSignUpWithEmailAndPassword = () => {
	const [loading, setLoading] = useState(false);
	const showToast = useShowToast();
	const loginUser = useAuthStore((state) => state.login);

	const signup = async (inputs) => {
		if (!inputs.email || !inputs.password || !inputs.username || !inputs.fullName) {
			return showToast('Error', 'Please fill all the fields', 'error');
		}

		setLoading(true);
		try {
			const response = await authService.signup(inputs);
			loginUser(response.user);
			showToast('Success', 'Account created successfully', 'success');
		} catch (error) {
			showToast('Error', error.response?.data?.error || 'An error occurred', 'error');
		} finally {
			setLoading(false);
		}
	};

	return { loading, signup };
};

export default useSignUpWithEmailAndPassword;
