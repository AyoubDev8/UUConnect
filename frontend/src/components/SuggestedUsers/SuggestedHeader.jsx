import { Avatar, Button, Flex, Text } from "@chakra-ui/react";
import useLogout from "../../hooks/useLogout";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";

const SuggestedHeader = () => {
	const { handleLogout, isLoggingOut } = useLogout();
	const authUser = useAuthStore((state) => state.user);

	if (!authUser) return null;

	return (
		<Flex alignItems="center" gap={3} mb={2}>
			<Avatar src={authUser?.profilePic || '/profilepic.png'} size="lg" />
			<Text fontWeight="bold">{authUser?.username}</Text>
			{isLoggingOut ? (
				<Text color="blue.500" ml="auto">Logging out...</Text>
			) : (
				<Text color="blue.500" ml="auto" cursor="pointer" onClick={handleLogout}>Log out</Text>
			)}
		</Flex>
	);
};

export default SuggestedHeader;
