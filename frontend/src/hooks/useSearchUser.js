import { useState } from "react";
import useShowToast from "./useShowToast";
import api from '../services/api';

const useSearchUser = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [user, setUser] = useState(null);
	const showToast = useShowToast();

	const getUserProfile = async (username) => {
		setIsLoading(true);
		setUser(null);
		try {
			const res = await api.get(`/users/search?username=${username}`);
			if (res.data.length === 0) return showToast("Error", "User not found", "error");
			setUser(res.data[0]);
		} catch (error) {
			showToast("Error", error.response?.data?.error || error.message, "error");
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, getUserProfile, user, setUser };
};

export default useSearchUser;
