import { Navigate } from 'react-router-dom'
import Cookies from "js-cookie";

//const user_info = Cookies.get("user_info")

const ProtectedRoute = ({ redirectPath ="/",children}: any) => {
    const  isLoingied = Cookies.get("user_info")
    if (!isLoingied) {
        return <Navigate to={redirectPath} />
    }
    return children
    
}

export default ProtectedRoute