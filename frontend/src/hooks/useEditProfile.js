import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { authService } from '../services/api';

const useEditProfile = () => {
	const [isUpdating, setIsUpdating] = useState(false);

	const authUser = useAuthStore((state) => state.user);
	const setAuthUser = useAuthStore((state) => state.setUser);
	const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

	const showToast = useShowToast();

	const editProfile = async (inputs, selectedFile) => {
		if (isUpdating || !authUser) return;
		setIsUpdating(true);

		let profilePic = authUser.profilePic;
		try {
			if (selectedFile) {
				profilePic = selectedFile;
			}

			const updatedUser = await authService.editProfile({
				fullName: inputs.fullName || authUser.fullName,
				username: inputs.username || authUser.username,
				bio: inputs.bio || authUser.bio,
				profilePic,
			});

			localStorage.setItem("user-info", JSON.stringify(updatedUser));
			setAuthUser(updatedUser);
			setUserProfile(updatedUser);
			showToast("Success", "Profile updated successfully", "success");
		} catch (error) {
			showToast("Error", error.response?.data?.error || error.message, "error");
		}
		setIsUpdating(false);
	};

	return { editProfile, isUpdating };
};

export default useEditProfile;
