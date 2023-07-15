import { useContext } from "react";
import RegisterAndLoginForm from "./RegisterAndLoginForm";
import { UserContext } from "../context/UserContext";
import ChatScreen from "./ChatScreen";

const Routes = () => {
    const {username, id} = useContext(UserContext);

    if (username){
        return(
            <ChatScreen />
        )
    }
    return(
        <RegisterAndLoginForm />
    )

}

export default Routes;