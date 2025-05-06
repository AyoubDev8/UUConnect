import { useEffect, useState } from "react";
import usePostStore from "../store/postStore";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { postService } from '../services/api';

const useGetUserPosts = () => {
	const [isLoading, setIsLoading] = useState(true);
	const { posts, setPosts } = usePostStore();
	const showToast = useShowToast();
	const userProfile = useUserProfileStore((state) => state.userProfile);

	useEffect(() => {
		const getPosts = async () => {
			if (!userProfile) return;
			setIsLoading(true);
			setPosts([]);

			try {
				const userPosts = await postService.getUserPosts(userProfile._id);
				setPosts(userPosts);
			} catch (error) {
				showToast("Error", error.response?.data?.error || error.message, "error");
				setPosts([]);
			} finally {
				setIsLoading(false);
			}
		};

		getPosts();
	}, [setPosts, userProfile, showToast]);

	return { isLoading, posts };
};

export default useGetUserPosts;
