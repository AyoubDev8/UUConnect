import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import api from '../services/api';

const useGetUserProfileById = (userId) => {
	const [isLoading, setIsLoading] = useState(true);
	const [userProfile, setUserProfile] = useState(null);

	const showToast = useShowToast();

	useEffect(() => {
		const getUserProfile = async () => {
			setIsLoading(true);
			setUserProfile(null);
			try {
				const res = await api.get(`/users/id/${userId}`);
				setUserProfile(res.data);
			} catch (error) {
				showToast("Error", error.response?.data?.error || error.message, "error");
			} finally {
				setIsLoading(false);
			}
		};
		if (userId) getUserProfile();
	}, [showToast, userId]);

	return { isLoading, userProfile, setUserProfile };
};

export default useGetUserProfileById;
