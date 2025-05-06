import { Box, Flex, Grid, Skeleton, Text, VStack } from "@chakra-ui/react";
import ProfilePost from "./ProfilePost";
import useGetUserPosts from "../../hooks/useGetUserPosts";
import useAuthStore from "../../store/authStore";
import useUserProfileStore from "../../store/userProfileStore";

const ProfilePosts = ({ posts: customPosts, onRemovePost }) => {
	const { isLoading, posts: fetchedPosts } = useGetUserPosts();
	const posts = customPosts !== undefined ? customPosts : fetchedPosts;
	const authUser = useAuthStore((state) => state.user);
	const userProfile = useUserProfileStore((state) => state.userProfile);

	// Only hide the posts tab for viewers on their own profile
	const isOwnProfile = authUser && userProfile && authUser._id === userProfile._id;
	if (authUser?.role === "viewer" && isOwnProfile && customPosts === undefined) return null;

	const noPostsFound = !isLoading && posts.length === 0;
	if (noPostsFound) return <NoPostsFound />;

	const handleRemovePost = (postId) => {
		if (typeof onRemovePost === 'function') {
			onRemovePost(postId);
		}
	};

	return (
		<Grid
			templateColumns={{
				sm: "repeat(1, 1fr)",
				md: "repeat(3, 1fr)",
			}}
			gap={1}
			columnGap={1}
		>
			{isLoading &&
				[0, 1, 2].map((_, idx) => (
					<VStack key={idx} alignItems={"flex-start"} gap={4}>
						<Skeleton w={"full"}>
							<Box h='300px'>contents wrapped</Box>
						</Skeleton>
					</VStack>
				))}

			{!isLoading && (
				<>
					{posts.map((post) => (
						<ProfilePost post={post} key={post.id || post._id} onUnlike={handleRemovePost} onRemovePost={onRemovePost} />
					))}
				</>
			)}
		</Grid>
	);
};

export default ProfilePosts;

const NoPostsFound = () => {
	return (
		<Flex flexDir='column' textAlign={"center"} mx={"auto"} mt={10}>
			<Text fontSize={"2xl"}>No Posts Found🤔</Text>
		</Flex>
	);
};
