import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall, getTokenFromLocalStorage } from "../utils/apiCall";
import ConnectMe from "../config/connect";

const ProtectedRoute = ({ children, haveAdminAccess=false }) => {
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false); // State to track token verification

    useEffect(() => {
        const verifyToken = async () => {
            const token = getTokenFromLocalStorage(); // Retrieve token from localStorage
            if (!token) {
                navigate("/login", { replace: true });
                return;
            }
            try {

                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                };
                // Verify the token using the reusable API call
                const response = await apiCall("GET", `${ConnectMe.BASE_URL}/sso/verifyToken`, headers)

                if (response?.message == 'Token is valid') {
                    if (haveAdminAccess==true ) {
                        if(response?.data?.isAdmin==true){
                            setIsVerified(true); 
                        }
                        else{
                            navigate("/login", { replace: true }); // Redirect to login if invalid
                        }
                   
                    }
                    else{
                        setIsVerified(true); // Mark as verified if the token is valid
                    }
                   
                } else {
                    console.log("Token invalid");
                    navigate("/login", { replace: true }); // Redirect to login if invalid
                }
            } catch (error) {
                console.error("Token verification failed:", error.message);
                navigate("/login", { replace: true }); // Redirect on error
            }
        };

        verifyToken();
    }, [navigate]);

    // Render children only if token is verified
    return isVerified ? children : null;
};

export default ProtectedRoute;
