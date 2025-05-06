import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import PageLayout from "./Layouts/PageLayout/PageLayout";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import useAuthStore from "./store/authStore";

function App() {
	const user = useAuthStore((state) => state.user);
	const location = useLocation();

	return (
		<PageLayout>
			<Routes>
				<Route
					path='/'
					element={user ? <HomePage /> : <Navigate to='/auth' state={{ from: location }} replace />}
				/>
				<Route
					path='/auth'
					element={!user ? <AuthPage /> : <Navigate to='/' replace />}
				/>
				<Route
					path='/:username'
					element={user ? <ProfilePage /> : <Navigate to='/auth' state={{ from: location }} replace />}
				/>
			</Routes>
		</PageLayout>
	);
}

export default App;
