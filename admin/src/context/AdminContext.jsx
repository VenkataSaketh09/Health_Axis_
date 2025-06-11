import { createContext, useState } from "react"
export const AdminContext=createContext(null)
const AdminContextProvider=({children})=>{
    const [atoken,setAToken]=useState("")
    const backend_url=import.meta.env.VITE_BACKEND_URL
    const value={atoken,setAToken,backend_url}
    return (
        <AdminContext.Provider value={{atoken,setAToken,backend_url}}>
            {children}
        </AdminContext.Provider>
    )
}
export default AdminContextProvider