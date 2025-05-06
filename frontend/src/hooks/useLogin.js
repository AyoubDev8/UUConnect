import { useState } from 'react';
import { authService } from '../services/api';
import useShowToast from './useShowToast';
import useAuthStore from '../store/authStore';

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const showToast = useShowToast();
	const loginUser = useAuthStore((state) => state.login);

	const login = async (inputs) => {
		if (!inputs.email || !inputs.password) {
			return showToast('Error', 'Please fill all the fields', 'error');
		}

		setLoading(true);
		try {
			const response = await authService.login(inputs);
			loginUser(response.user);
			showToast('Success', 'Logged in successfully', 'success');
		} catch (error) {
			showToast('Error', error.response?.data?.error || 'An error occurred', 'error');
		} finally {
			setLoading(false);
		}
	};

	return { loading, login };
};

export default useLogin;
