import { Avatar, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { timeAgo } from "../../utils/timeAgo";
import useUserProfileStore from "../../store/userProfileStore";

const Caption = ({ post, creator }) => {
	return (
		<Flex gap={4}>
			<Link to={`/${creator.username}`}>
				<Avatar src={creator.profilePic || creator.profilePicURL || '/profilepic.png'} size={"sm"} />
			</Link>
			<Flex direction={"column"}>
				<Flex gap={2} alignItems={"center"}>
					<Link to={`/${creator.username}`}>
						<Text fontWeight={"bold"} fontSize={12}>
							{creator.username}
						</Text>
					</Link>
					<Text fontSize={14}>{post.caption}</Text>
				</Flex>
				<Text fontSize={12} color={"gray"}>
					{timeAgo(post.createdAt)}
				</Text>
			</Flex>
		</Flex>
	);
};

export default Caption;
