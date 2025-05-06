import { Box, Button, Flex, Input, InputGroup, InputRightElement, Text, useDisclosure } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { CommentLogo, NotificationsLogo, UnlikeLogo } from "../../assets/constants";
import usePostComment from "../../hooks/usePostComment";
import useAuthStore from "../../store/authStore";
import useLikePost from "../../hooks/useLikePost";
import { timeAgo } from "../../utils/timeAgo";
import CommentsModal from "../Modals/CommentsModal";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import useUserProfileStore from "../../store/userProfileStore";
import { postService } from "../../services/api";

const PostFooter = ({ post, isProfilePage, creatorProfile, onUnlike, onAddComment, onRemovePost }) => {
	const { isCommenting, handlePostComment } = usePostComment();
	const [comment, setComment] = useState("");
	const authUser = useAuthStore((state) => state.user);
	const commentRef = useRef(null);
	const { handleLikePost, isLiked, likes } = useLikePost(post);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const userProfile = useUserProfileStore((state) => state.userProfile);
	const setUserProfile = useUserProfileStore((state) => state.setUserProfile);
	const isSaved = userProfile?.savedPosts?.includes(post._id || post.id);

	const handleSubmitComment = async () => {
		const newComment = await handlePostComment(post._id || post.id, comment);
		if (newComment && typeof onAddComment === 'function') {
			onAddComment(newComment);
		}
		setComment("");
	};

	const handleSavePost = async () => {
		if (!authUser) return;
		try {
			if (isSaved) {
				await postService.unsavePost(post._id || post.id);
				if (typeof onRemovePost === 'function') {
					onRemovePost(post._id || post.id);
				}
			} else {
				await postService.savePost(post._id || post.id);
			}
			// Always fetch the latest savedPosts from backend after save/unsave
			const updatedSavedPosts = await postService.getSavedPosts();
			setUserProfile({
				...userProfile,
				savedPosts: updatedSavedPosts.map(p => p._id || p.id),
			});
		} catch (e) {
			// handle error
		}
	};

	const handleLikeOrUnlike = async () => {
		await handleLikePost();
		if (isLiked && typeof onUnlike === 'function') {
			onUnlike(post._id || post.id);
		}
	};

	return (
		<Box mb={10} marginTop={"auto"}>
			<Flex alignItems={"center"} gap={4} w={"full"} pt={0} mb={2} mt={4}>
				<Box onClick={handleLikeOrUnlike} cursor={"pointer"} fontSize={18}>
					{!isLiked ? <NotificationsLogo /> : <UnlikeLogo />}
				</Box>

				<Box cursor={"pointer"} fontSize={18} onClick={() => commentRef.current.focus()}>
					<CommentLogo />
				</Box>

				<Box onClick={handleSavePost} cursor={"pointer"} fontSize={18} ml="auto">
					{isSaved ? <BsBookmarkFill /> : <BsBookmark />}
				</Box>
			</Flex>
			<Text fontWeight={600} fontSize={"sm"}>
				{likes} likes
			</Text>

			{isProfilePage && (
				<Text fontSize='12' color={"gray"}>
					Posted {timeAgo(post.createdAt)}
				</Text>
			)}

			{!isProfilePage && (
				<>
					<Text fontSize='sm' fontWeight={700}>
						{creatorProfile?.username}{" "}
						<Text as='span' fontWeight={400}>
							{post.caption}
						</Text>
					</Text>
					{post.comments.length > 0 && (
						<Text fontSize='sm' color={"gray"} cursor={"pointer"} onClick={onOpen}>
							View all {post.comments.length} comments
						</Text>
					)}
					{/* COMMENTS MODAL ONLY IN THE HOME PAGE */}
					{isOpen ? <CommentsModal isOpen={isOpen} onClose={onClose} post={post} /> : null}
				</>
			)}

			{authUser && (
				<Flex alignItems={"center"} gap={2} justifyContent={"space-between"} w={"full"}>
					<InputGroup>
						<Input
							variant={"flushed"}
							placeholder={"Add a comment..."}
							fontSize={14}
							onChange={(e) => setComment(e.target.value)}
							value={comment}
							ref={commentRef}
						/>
						<InputRightElement>
							<Button
								fontSize={14}
								color={"blue.500"}
								fontWeight={600}
								cursor={"pointer"}
								_hover={{ color: "white" }}
								bg={"transparent"}
								onClick={handleSubmitComment}
								isLoading={isCommenting}
							>
								Post
							</Button>
						</InputRightElement>
					</InputGroup>
				</Flex>
			)}
		</Box>
	);
};

export default PostFooter;
