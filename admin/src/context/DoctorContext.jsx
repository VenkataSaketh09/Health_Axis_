import { createContext } from "react"
export const DoctorContext=createContext(null)
const DoctorContextProvider = ({children}) => {
  return (
    <DoctorContext.Provider>
        {children}
    </DoctorContext.Provider>
  )
}

export default DoctorContextProvider
