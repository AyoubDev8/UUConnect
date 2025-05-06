import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import api from '../services/api';

const useLikePost = (post) => {
	const [isUpdating, setIsUpdating] = useState(false);
	const authUser = useAuthStore((state) => state.user);
	const [likes, setLikes] = useState(post.likes.length);
	const [isLiked, setIsLiked] = useState(post.likes.includes(authUser?._id));
	const showToast = useShowToast();

	const handleLikePost = async () => {
		if (isUpdating) return;
		if (!authUser) return showToast("Error", "You must be logged in to like a post", "error");
		setIsUpdating(true);

		try {
			await api.post(`/posts/${post._id || post.id}/like`);
			setIsLiked((prev) => !prev);
			setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
		} catch (error) {
			showToast("Error", error.response?.data?.error || error.message, "error");
		} finally {
			setIsUpdating(false);
		}
	};

	return { isLiked, likes, handleLikePost, isUpdating };
};

export default useLikePost;
