import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import api from '../services/api';

const useGetSuggestedUsers = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [suggestedUsers, setSuggestedUsers] = useState([]);
	const authUser = useAuthStore((state) => state.user);
	const showToast = useShowToast();

	useEffect(() => {
		const getSuggestedUsers = async () => {
			setIsLoading(true);
			try {
				const res = await api.get('/users/suggested');
				setSuggestedUsers(res.data);
			} catch (error) {
				showToast("Error", error.response?.data?.error || error.message, "error");
			} finally {
				setIsLoading(false);
			}
		};

		if (authUser) getSuggestedUsers();
	}, [authUser, showToast]);

	return { isLoading, suggestedUsers };
};

export default useGetSuggestedUsers;
