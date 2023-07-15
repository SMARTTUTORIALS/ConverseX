import axios from "../utils/axios";
import requests from "../utils/requests";

const { createContext, useState, useEffect } = require("react");

export const UserContext = createContext({});

export const UserContextProvider = ({children}) => {
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);

    useEffect(()=>{
        
        axios.get(requests.getCurrentUser).then(response=>{
            setId(response.data.userId);
            setUsername(response.data.username);
        });

    },[]);
    return (
        <UserContext.Provider value={{username, setUsername, id, setId}}>
            {children}
        </UserContext.Provider>
    )
}