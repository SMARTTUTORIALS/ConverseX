import { useContext, useState } from "react"
import axios from "../utils/axios";
import requests from "../utils/requests";
import { UserContext } from "../context/UserContext";

const RegisterAndLoginForm = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginOrRegister, setIsLoginOrRegister] = useState(false); // false means user not exists

    const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const url = isLoginOrRegister ? requests.loginUser : requests.registerUser;
        const { data } = await axios.post(url, { username, password });
        setLoggedInUsername(username);
        setId(data.userId);
    }

    return (
        <div className="bg-blue-50 h-screen flex items-center">
            <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    type="text"
                    placeholder="username"
                    className="block w-full rounded-sm p-2 mb-2" />

                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    placeholder="password"
                    className="block w-full rounded-sm p-2 mb-2" />

                <button className="bg-blue-500 text-white block p-2 mb-2 w-full rounded-sm">{isLoginOrRegister ? 'Log In' : 'Register'}</button>
                {!isLoginOrRegister && (
                    <div className="text-center mt-2">
                        Already have account?
                        <button className="text-blue-600 underline ps-0.5" onClick={(e) => { e.preventDefault(); setIsLoginOrRegister(true) }} > Login here</button>
                    </div>
                )}
                {isLoginOrRegister && (
                    <div className="text-center mt-2">
                        Do not have account?
                        <button className="text-blue-600 underline ps-0.5" onClick={(e) => { e.preventDefault(); setIsLoginOrRegister(false) }}> Register here</button>
                    </div>
                )}

            </form>
        </div>
    )
}

export default RegisterAndLoginForm