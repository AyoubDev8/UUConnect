import { Alert, AlertIcon, Button, Input, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { useState } from "react";
import useLogin from "../../hooks/useLogin";

const Login = () => {
	const [inputs, setInputs] = useState({
		email: "",
		password: "",
	});
	const { loading, error, login } = useLogin();
	const [role, setRole] = useState("creator");
	return (
		<>
			<Input
				placeholder='Email'
				fontSize={14}
				type='email'
				size={"sm"}
				value={inputs.email}
				onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
			/>
			<Input
				placeholder='Password'
				fontSize={14}
				size={"sm"}
				type='password'
				value={inputs.password}
				onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
			/>
			<RadioGroup value={role} onChange={setRole} mb={2}>
				<Stack direction="row">
					<Radio value="creator">Creator</Radio>
					<Radio value="viewer">Viewer</Radio>
				</Stack>
			</RadioGroup>
			{error && (
				<Alert status='error' fontSize={13} p={2} borderRadius={4}>
					<AlertIcon fontSize={12} />
					{error.message}
				</Alert>
			)}
			<Button
				w={"full"}
				colorScheme='blue'
				size={"sm"}
				fontSize={14}
				isLoading={loading}
				onClick={() => login({ ...inputs, role })}
			>
				Log in
			</Button>
		</>
	);
};

export default Login;
