import { jwtDecode } from "jwt-decode";


const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const decodedToken = jwtDecode(token);
        return decodedToken; // This typically includes the user ID and other info
    }
    return null;
};

export default getCurrentUser;
