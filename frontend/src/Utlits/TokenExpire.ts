import { jwtDecode } from "jwt-decode";

export const jwtTokenExpire = (token: string) => {

    if (token) {
        const decodedToken: { exp: any } = jwtDecode(token);
        if (!decodedToken.exp) {
            return true
        }
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime
    }
    else {
        return true
    }
}