import { createContext, useState } from "react"
export const AdminContext=createContext(null)
const AdminContextProvider=({children})=>{
    const [aToken,setaToken]=useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):"")
    const backend_url=import.meta.env.VITE_BACKEND_URL
    return (
        <AdminContext.Provider value={{aToken,setaToken,backend_url}}>
            {children}
        </AdminContext.Provider>
    )
}
export default AdminContextProvider