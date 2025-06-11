import { createContext } from "react";
export const AppContext=createContext(null)
const AppContextProvider=({children})=>{
    const value={}
    return (
        <AppContext.Provider>
            {children}
        </AppContext.Provider>
    )
}
export default AppContextProvider