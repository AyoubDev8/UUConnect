import { Avatar, Box, Button, Flex, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUser from "../../hooks/useFollowUser";
import { timeAgo } from "../../utils/timeAgo";
import useAuthStore from "../../store/authStore";

const PostHeader = ({ post, creatorProfile }) => {
	const followUserHook = post && post.createdBy ? useFollowUser(post.createdBy) : null;
	const authUser = useAuthStore((state) => state.user);

	return (
		<Flex justifyContent={"space-between"} alignItems={"center"} w={"full"} my={2}>
			<Flex alignItems={"center"} gap={2}>
				{creatorProfile ? (
					<Link to={`/${creatorProfile.username}`}>
						<Avatar src={creatorProfile.profilePic || '/profilepic.png'} alt='user profile pic' size={"sm"} />
					</Link>
				) : (
					<SkeletonCircle size='10' />
				)}

				<Flex fontSize={12} fontWeight={"bold"} gap='2'>
					{creatorProfile ? (
						<Link to={`/${creatorProfile.username}`}>{creatorProfile.username}</Link>
					) : (
						<Skeleton w={"100px"} h={"10px"} />
					)}

					<Box color={"gray.500"}>• {timeAgo(post.createdAt)}</Box>
				</Flex>
			</Flex>
			<Box cursor={"pointer"}>
				{authUser && post.createdBy && authUser._id !== post.createdBy && !followUserHook?.isFollowing && (
					<Button
						size={"xs"}
						bg={"transparent"}
						fontSize={12}
						color={"blue.500"}
						fontWeight={"bold"}
						_hover={{ color: "white" }}
						transition={"0.2s ease-in-out"}
						onClick={followUserHook?.handleFollowUser}
						isLoading={followUserHook?.isUpdating}
					>
						Follow
					</Button>
				)}
			</Box>
		</Flex>
	);
};

export default PostHeader;
