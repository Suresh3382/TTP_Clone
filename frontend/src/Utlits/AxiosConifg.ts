import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setAccessToken } from "../Component/Redux/Store";
import { baseURL } from "../baseURL";

export const useCallApi = () => {
    const { accessToken, refreshToken } = useSelector((state: RootState) => state.authLogin);
    const dispatch = useDispatch();

    const callApi = async ({
        requestEndpoint,
        method,
        body
    }: {
        requestEndpoint: string;
        method: "get" | "post" | "put" | "delete"; // constrain methods
        body?: any;
    }) => {
        try {
            if (requestEndpoint) {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: accessToken
                };

                const axiosInstance = axios.create({ headers });
                const response = await axiosInstance[method](requestEndpoint, body);
                return response;
            }
        } catch (err: any) {
            console.error(err);

            if (err.response?.data?.authError) {
                if (refreshToken) {
                    try {
                        const response = await axios.post(`${baseURL}user/refresh/${refreshToken}`);

                        if (response.data?.accessToken) {
                            dispatch(setAccessToken(response.data.accessToken));

                            const headers = {
                                "Content-Type": "application/json",
                                Authorization: response.data.accessToken
                            };

                            const axiosInstance = axios.create({ headers });
                            const res = await axiosInstance[method](requestEndpoint, body);
                            return res;
                        } else {
                            localStorage.clear();
                            // redirect to login if needed
                        }
                    } catch (refreshError) {
                        console.error("Refresh token failed", refreshError);
                        localStorage.clear();
                    }
                } else {
                    localStorage.clear();
                    // redirect to login if needed
                }
            }

            return err;
        }
    };

    return { callApi };
};
