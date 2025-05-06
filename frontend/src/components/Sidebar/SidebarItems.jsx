import CreatePost from "./CreatePost";
import Home from "./Home";
import Notifications from "./Notifications";
import ProfileLink from "./ProfileLink";
import Search from "./Search";
import useAuthStore from "../../store/authStore";

const SidebarItems = () => {
	const authUser = useAuthStore((state) => state.user);
	return (
		<>
			<Home />
			<Search />
			<Notifications />
			{authUser?.role === "creator" && <CreatePost />}
			<ProfileLink />
		</>
	);
};

export default SidebarItems;
