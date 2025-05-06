import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";

const useLogout = () => {
	const showToast = useShowToast();
	const logoutUser = useAuthStore((state) => state.logout);

	const handleLogout = async () => {
		try {
			localStorage.removeItem("user-info");
			logoutUser();
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return { handleLogout };
};

export default useLogout;
