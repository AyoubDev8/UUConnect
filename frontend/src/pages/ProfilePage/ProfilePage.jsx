import { Container, Flex, Link, Skeleton, SkeletonCircle, Text, VStack } from "@chakra-ui/react";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileTabs from "../../components/Profile/ProfileTabs";
import ProfilePosts from "../../components/Profile/ProfilePosts";
import useGetUserProfileByUsername from "../../hooks/useGetUserProfileByUsername";
import { useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { useState, useEffect } from "react";
import useUserProfileStore from "../../store/userProfileStore";
import { postService } from "../../services/api";

const ProfilePage = () => {
	const { username } = useParams();
	const { isLoading, userProfile } = useGetUserProfileByUsername(username);
	const authUser = useAuthStore((state) => state.user);
	const isOwnProfile = authUser && userProfile && authUser._id === userProfile._id;
	const isViewer = authUser?.role === "viewer";
	const [activeTab, setActiveTab] = useState(() => {
		if (authUser?.role === "viewer" && userProfile && authUser._id === userProfile._id) {
			return "saved";
		}
		return "posts";
	});
	const userProfileStore = useUserProfileStore();
	const [savedPosts, setSavedPosts] = useState([]);
	const [likedPosts, setLikedPosts] = useState([]);
	const [loadingSaved, setLoadingSaved] = useState(false);
	const [loadingLiked, setLoadingLiked] = useState(false);
	const [errorSaved, setErrorSaved] = useState("");
	const [errorLiked, setErrorLiked] = useState("");
	const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

	const userNotFound = !isLoading && !userProfile;
	if (userNotFound) return <UserNotFound />;

	// Determine if the profile being viewed is a viewer
	const isProfileViewer = userProfile && userProfile.role === "viewer";

	useEffect(() => {
		if (activeTab === "saved" && isOwnProfile) {
			setLoadingSaved(true);
			postService.getSavedPosts().then(res => {
				setSavedPosts(res || []);
				setErrorSaved("");
				setUserProfile({
					...userProfile,
					savedPosts: (res || []).map(p => p._id || p.id),
				});
			}).catch(e => {
				setErrorSaved("Failed to load saved posts");
			}).finally(() => setLoadingSaved(false));
		}
		if (activeTab === "likes" && isOwnProfile) {
			setLoadingLiked(true);
			postService.getLikedPosts().then(res => {
				setLikedPosts(res || []);
				setErrorLiked("");
				setUserProfile({
					...userProfile,
					likedPosts: (res || []).map(p => p._id || p.id),
				});
			}).catch(e => {
				setErrorLiked("Failed to load liked posts");
			}).finally(() => setLoadingLiked(false));
		}
	}, [activeTab, isOwnProfile]);

	const handleRemoveSavedPost = (postId) => {
		setSavedPosts((prev) => prev.filter((post) => (post._id || post.id) !== postId));
	};

	const handleRemoveLikedPost = (postId) => {
		setLikedPosts((prev) => prev.filter((post) => (post._id || post.id) !== postId));
	};

	return (
		<Container maxW='container.lg' py={5}>
			<Flex py={10} px={4} pl={{ base: 4, md: 10 }} w={"full"} mx={"auto"} flexDirection={"column"}>
				{!isLoading && userProfile && <ProfileHeader />}
				{isLoading && <ProfileHeaderSkeleton />}
			</Flex>
			<Flex
				px={{ base: 2, sm: 4 }}
				maxW={"full"}
				mx={"auto"}
				borderTop={"1px solid"}
				borderColor={"whiteAlpha.300"}
				direction={"column"}
			>
				{/* Own profile: viewer sees only Saved and Likes, creator sees all. */}
				{(isOwnProfile && isViewer) && (
					<>
						<ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
						{activeTab === "saved" && (
							loadingSaved ? <div>Loading...</div> : errorSaved ? <div>{errorSaved}</div> : <ProfilePosts posts={savedPosts} emptyText="No Saved Posts" onRemovePost={handleRemoveSavedPost} />
						)}
						{activeTab === "likes" && (
							loadingLiked ? <div>Loading...</div> : errorLiked ? <div>{errorLiked}</div> : <ProfilePosts posts={likedPosts} emptyText="No Liked Posts" onRemovePost={handleRemoveLikedPost} />
						)}
					</>
				)}
				{/* Own profile: creator sees all tabs */}
				{(isOwnProfile && !isViewer) && (
					<>
						<ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
						{activeTab === "posts" && <ProfilePosts />}
						{activeTab === "saved" && (
							loadingSaved ? <div>Loading...</div> : errorSaved ? <div>{errorSaved}</div> : <ProfilePosts posts={savedPosts} emptyText="No Saved Posts" onRemovePost={handleRemoveSavedPost} />
						)}
						{activeTab === "likes" && (
							loadingLiked ? <div>Loading...</div> : errorLiked ? <div>{errorLiked}</div> : <ProfilePosts posts={likedPosts} emptyText="No Liked Posts" onRemovePost={handleRemoveLikedPost} />
						)}
					</>
				)}
				{/* Viewing another user's profile: creator shows only posts, viewer shows nothing */}
				{(!isOwnProfile && !isProfileViewer) && (
					<>
						<ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
						{activeTab === "posts" && <ProfilePosts />}
					</>
				)}
				{/* Viewing a viewer's profile: show nothing but details */}
			</Flex>
		</Container>
	);
};

export default ProfilePage;

// skeleton for profile header
const ProfileHeaderSkeleton = () => {
	return (
		<Flex
			gap={{ base: 4, sm: 10 }}
			py={10}
			direction={{ base: "column", sm: "row" }}
			justifyContent={"center"}
			alignItems={"center"}
		>
			<SkeletonCircle size='24' />

			<VStack alignItems={{ base: "center", sm: "flex-start" }} gap={2} mx={"auto"} flex={1}>
				<Skeleton height='12px' width='150px' />
				<Skeleton height='12px' width='100px' />
			</VStack>
		</Flex>
	);
};

const UserNotFound = () => {
	return (
		<Flex flexDir='column' textAlign={"center"} mx={"auto"}>
			<Text fontSize={"2xl"}>User Not Found</Text>
			<Link as={RouterLink} to={"/"} color={"blue.500"} w={"max-content"} mx={"auto"}>
				Go home
			</Link>
		</Flex>
	);
};
