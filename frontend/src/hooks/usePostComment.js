import { useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import usePostStore from "../store/postStore";
import api from '../services/api';

const usePostComment = () => {
	const [isCommenting, setIsCommenting] = useState(false);
	const showToast = useShowToast();
	const authUser = useAuthStore((state) => state.user);
	const addComment = usePostStore((state) => state.addComment);

	const handlePostComment = async (postId, comment) => {
		if (isCommenting) return;
		if (!authUser) return showToast("Error", "You must be logged in to comment", "error");
		setIsCommenting(true);
		try {
			const res = await api.post(`/posts/${postId}/comments`, { text: comment });
			addComment(postId, res.data);
			return res.data;
		} catch (error) {
			showToast("Error", error.response?.data?.error || error.message, "error");
			return null;
		} finally {
			setIsCommenting(false);
		}
	};

	return { isCommenting, handlePostComment };
};

export default usePostComment;
