import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import api from '../services/api';
import useUserProfileStore from "../store/userProfileStore";

const useGetUserProfileByUsername = (username) => {
	const [isLoading, setIsLoading] = useState(true);
	const showToast = useShowToast();
	const { userProfile, setUserProfile } = useUserProfileStore();

	useEffect(() => {
		const getUserProfile = async () => {
			setIsLoading(true);
			try {
				const res = await api.get(`/users/username/${username}`);
				setUserProfile(res.data);
			} catch (error) {
				showToast("Error", error.response?.data?.error || error.message, "error");
				setUserProfile(null);
			} finally {
				setIsLoading(false);
			}
		};
		if (username) getUserProfile();
	}, [setUserProfile, username, showToast]);

	return { isLoading, userProfile };
};

export default useGetUserProfileByUsername;
