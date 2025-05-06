import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/userProfileStore";
import useShowToast from "./useShowToast";
import api from '../services/api';

const useFollowUser = (userId) => {
	const [isUpdating, setIsUpdating] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);
	const authUser = useAuthStore((state) => state.user);
	const setAuthUser = useAuthStore((state) => state.setUser);
	const { userProfile, setUserProfile } = useUserProfileStore();
	const showToast = useShowToast();

	const handleFollowUser = async () => {
		if (!userId) return showToast("Error", "User ID is missing", "error");
		if (!authUser || !authUser._id) return showToast("Error", "You must be logged in to follow users", "error");
		if (userId === authUser._id) return showToast("Error", "You cannot follow yourself", "error");
		setIsUpdating(true);
		try {
			await api.post(`/users/${userId}/follow`);
			if (isFollowing) {
				setAuthUser({
					...authUser,
					following: (authUser.following || []).filter((uid) => (typeof uid === 'string' ? uid !== userId : uid._id !== userId)),
				});
				if (userProfile)
					setUserProfile({
						...userProfile,
						followers: (userProfile.followers || []).filter((uid) => (typeof uid === 'string' ? uid !== authUser._id : uid._id !== authUser._id)),
					});
				localStorage.setItem(
					"user-info",
					JSON.stringify({
						...authUser,
						following: (authUser.following || []).filter((uid) => (typeof uid === 'string' ? uid !== userId : uid._id !== userId)),
					})
				);
				setIsFollowing(false);
			} else {
				setAuthUser({
					...authUser,
					following: [...(authUser.following || []), userId],
				});
				if (userProfile)
					setUserProfile({
						...userProfile,
						followers: [...(userProfile.followers || []), authUser._id],
					});
				localStorage.setItem(
					"user-info",
					JSON.stringify({
						...authUser,
						following: [...(authUser.following || []), userId],
					})
				);
				setIsFollowing(true);
			}
		} catch (error) {
			showToast("Error", error.response?.data?.error || error.message, "error");
		} finally {
			setIsUpdating(false);
		}
	};

	useEffect(() => {
		if (authUser && Array.isArray(authUser.following)) {
		  setIsFollowing(authUser.following.includes(userId));
		}
	  }, [authUser, userId]);

	return { isUpdating, isFollowing, handleFollowUser };
};

export default useFollowUser;
