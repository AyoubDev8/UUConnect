import { Box, Flex, Text } from "@chakra-ui/react";
import { BsBookmark, BsGrid3X3, BsSuitHeart } from "react-icons/bs";
import useAuthStore from "../../store/authStore";
import useUserProfileStore from "../../store/userProfileStore";

const ProfileTabs = ({ activeTab, setActiveTab }) => {
	const authUser = useAuthStore((state) => state.user);
	const userProfile = useUserProfileStore((state) => state.userProfile);
	const isOwnProfile = authUser && userProfile && authUser._id === userProfile._id;
	const isViewer = authUser?.role === "viewer";
	const isProfileViewer = userProfile && userProfile.role === "viewer";
	return (
		<Flex
			w={"full"}
			justifyContent={"center"}
			gap={{ base: 4, sm: 10 }}
			textTransform={"uppercase"}
			fontWeight={"bold"}
		>
			{/* Own profile: viewer sees only Saved and Likes, creator sees all. */}
			{isOwnProfile && isViewer && (
				<>
					<Flex
						borderTop={activeTab === "saved" ? "2px solid white" : "1px solid white"}
						alignItems={"center"}
						p='3'
						gap={1}
						cursor={"pointer"}
						onClick={() => setActiveTab("saved")}
						color={activeTab === "saved" ? "white" : "gray.400"}
					>
						<Box fontSize={20}>
							<BsBookmark />
						</Box>
						<Text fontSize={12} display={{ base: "none", sm: "block" }}>
							Saved
						</Text>
					</Flex>
					<Flex
						borderTop={activeTab === "likes" ? "2px solid white" : "1px solid white"}
						alignItems={"center"}
						p='3'
						gap={1}
						cursor={"pointer"}
						onClick={() => setActiveTab("likes")}
						color={activeTab === "likes" ? "white" : "gray.400"}
					>
						<Box fontSize={20}>
							<BsSuitHeart fontWeight={"bold"} />
						</Box>
						<Text fontSize={12} display={{ base: "none", sm: "block" }}>
							Likes
						</Text>
					</Flex>
				</>
			)}
			{/* Own profile: creator sees all tabs */}
			{isOwnProfile && !isViewer && (
				<>
					<Flex
						borderTop={activeTab === "posts" ? "2px solid white" : "1px solid white"}
						alignItems={"center"}
						p='3'
						gap={1}
						cursor={"pointer"}
						onClick={() => setActiveTab("posts")}
						color={activeTab === "posts" ? "white" : "gray.400"}
					>
						<Box fontSize={20}>
							<BsGrid3X3 />
						</Box>
						<Text fontSize={12} display={{ base: "none", sm: "block" }}>
							Posts
						</Text>
					</Flex>
					<Flex
						borderTop={activeTab === "saved" ? "2px solid white" : "1px solid white"}
						alignItems={"center"}
						p='3'
						gap={1}
						cursor={"pointer"}
						onClick={() => setActiveTab("saved")}
						color={activeTab === "saved" ? "white" : "gray.400"}
					>
						<Box fontSize={20}>
							<BsBookmark />
						</Box>
						<Text fontSize={12} display={{ base: "none", sm: "block" }}>
							Saved
						</Text>
					</Flex>
					<Flex
						borderTop={activeTab === "likes" ? "2px solid white" : "1px solid white"}
						alignItems={"center"}
						p='3'
						gap={1}
						cursor={"pointer"}
						onClick={() => setActiveTab("likes")}
						color={activeTab === "likes" ? "white" : "gray.400"}
					>
						<Box fontSize={20}>
							<BsSuitHeart fontWeight={"bold"} />
						</Box>
						<Text fontSize={12} display={{ base: "none", sm: "block" }}>
							Likes
						</Text>
					</Flex>
				</>
			)}
			{/* Viewing another user's profile: creator shows only posts, viewer shows nothing */}
			{!isOwnProfile && !isProfileViewer && (
				<Flex
					borderTop={activeTab === "posts" ? "2px solid white" : "1px solid white"}
					alignItems={"center"}
					p='3'
					gap={1}
					cursor={"pointer"}
					onClick={() => setActiveTab("posts")}
					color={activeTab === "posts" ? "white" : "gray.400"}
				>
					<Box fontSize={20}>
						<BsGrid3X3 />
					</Box>
					<Text fontSize={12} display={{ base: "none", sm: "block" }}>
						Posts
					</Text>
				</Flex>
			)}
		</Flex>
	);
};

export default ProfileTabs;
