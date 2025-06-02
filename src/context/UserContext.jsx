import { useContext,useState,createContext } from "react";

// create a UserContext
const UserContext = createContext();

export function UserProvider({ children })  {
    const [user,setUser] = useState({username: 'User123'}); // hardcoded user for simplicity

    return (
        <UserContext.Provider value={{user,setUser}}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}