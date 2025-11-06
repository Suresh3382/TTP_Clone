import { useState } from 'react';
import { useNavigate } from "react-router";
import * as Yup from 'yup';
import { Checkbox, Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined } from '@ant-design/icons';
import { Form, Formik } from 'formik';
import { ILogin } from './LoginSignUpInterface';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, authLogin, ILoginResponse, RootState, setIsAdminPanel, setSelectedKey } from '../../Redux/Store';

const Login = () => {
    const navigate = useNavigate();
    const [rememberMe, setRememberMe,] = useState<boolean>(false);
    const { role } = useSelector((state: RootState) => state.authLogin);
    const dispatch = useDispatch<AppDispatch>();

    const LoginInitialValue = {
        email: '',
        username: '',
        password: ''
    }
    let schema = Yup.object().shape({
        username: Yup.string().required('Username is required!'),
        password: Yup.string().required('Password is required!')
    })

    const handleSubmit = async (values: ILogin) => {
        dispatch(authLogin(values)).then((result) => {

            const payload = result.payload as ILoginResponse;
            console.log(payload);

            if (payload && payload.data) {
                const role = payload.data.result.role;
                const onBoarding = payload.data.result.Onboadring;
                if (onBoarding) {
                    if (role === "ADMIN") {
                        dispatch(setIsAdminPanel(true));
                        navigate('/adminDashboard');
                        dispatch(setSelectedKey('/adminDashboard'));
                    } else {
                        dispatch(setIsAdminPanel(false));
                        navigate('/home');
                        dispatch(setSelectedKey('/home'));
                    }
                } else {
                    navigate('/onboarding');
                }
            }
        }).catch((error) => {
            console.error("Login error:", error);
        });
    };

    // try {
    //     const response = await axios.post(`${baseURL}user/Login`, values);
    //     if (response.data.result) {
    //         const AccessToken = response.data.result.accessToken;
    //         const RefreshToken = response.data.result.refreshToken;
    //         localStorage.setItem('username', response?.data?.result?.user);
    //         if (rememberMe) {
    //             localStorage.setItem('AccessToken', AccessToken);
    //             localStorage.setItem('RefreshToken', RefreshToken);
    //         } else {
    //             sessionStorage.setItem('AccessToken', AccessToken);
    //             sessionStorage.setItem('RefreshToken', RefreshToken);
    //         }
    //         if (response?.data?.result?.Onboadring) {
    //             if (response?.data?.result?.role === 'ADMIN') {
    //                 // dispatch(setIsAdminPanel(true));
    //                 navigate('/adminDashboard');
    //                 dispatch(setSelectedKey('/adminDashboard'));
    //             } else {
    //                 // dispatch(setIsAdminPanel(false));
    //                 navigate('/home');
    //                 dispatch(setSelectedKey('/home'));
    //             }
    //         } else {
    //             navigate('/onboarding');
    //         }
    //     }
    // } catch (error) {
    //     console.log("Error :", error);
    // }

    //     if (isLoggedIn) {
    //         // Handle token storage based on rememberMe flag
    //         if (rememberMe) {
    //             localStorage.setItem('AccessToken', accessToken || '');
    //             localStorage.setItem('RefreshToken', refreshToken || '');
    //         } else {
    //             sessionStorage.setItem('AccessToken', accessToken || '');
    //             sessionStorage.setItem('RefreshToken', refreshToken || '');
    //         }

    //         // Redirect based on onboarding and role
    //         if (onBoarding) {
    //             if (role === 'ADMIN') {
    //                 navigate('/adminDashboard');
    //             } else {
    //                 navigate('/userDashboard'); // Adjust as needed
    //             }
    //         } else {
    //             navigate('/onboarding');
    //         }
    //     }
    // }, [isLoggedIn, role, accessToken, refreshToken, onBoarding, rememberMe, navigate]);

    return (
        <div className="w-full min-h-screen flex">
            <div className="w-1/2 flex items-center justify-center bg-[#F3F4FA]">
                <img src='src\Component\LoginSignUp\Images\ttpLogin.svg' alt="Login" />
            </div>
            <div className="w-1/2 flex items-center justify-center">
                <div className='w-1/3 h-full flex flex-col justify-center gap-8'>
                    {/* <img src="src\Component\LoginSignUp\logo.png" alt="" /> */}
                    <hr />
                    <p className='text-xl text-[#223B95]'>Login into Your Account</p>
                    <div className='flex flex-col gap-5'>
                        <Formik
                            initialValues={LoginInitialValue}
                            validationSchema={schema}
                            onSubmit={handleSubmit}
                        >
                            {({ values, errors, touched, setFieldValue }) => (
                                <Form>
                                    <div className='flex flex-col gap-3'>
                                        <div>
                                            <label htmlFor="username" className='text-[#223B95]'>Username</label>
                                            <Input placeholder="Enter Username" autoComplete='username' suffix={<UserOutlined />} className='border-none bg-[#F9FAFF]' value={values.username} onChange={(e) => { setFieldValue('username', e.target.value) }} />
                                            {errors.username && touched.username ? <span className='text-red-600'>{errors.username}</span> : null}

                                        </div>
                                        <div>
                                            <label htmlFor="password" className='text-[#223B95]'>Password</label>
                                            <Input.Password placeholder="Enter Password" autoComplete="current-password" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} className='border-none bg-[#F9FAFF]' value={values.password} onChange={(e) => { setFieldValue('password', e.target.value) }} />
                                        </div>
                                        {errors.password && touched.password ? <span className='text-red-600'>{errors.password}</span> : null}
                                    </div>
                                    <div className='flex gap-2 mt-3'>
                                        <Checkbox onChange={(e) => setRememberMe(e.target.checked)} />
                                        <label htmlFor="rememberMe" className='text-[#223B95]'>Remember Me</label>
                                    </div>
                                    <p className='text-[#017AFF] cursor-pointer text-right my-3' onClick={() => navigate('/signup')}>Signup!</p>
                                    <div className='flex justify-center'>
                                        <button type='submit' className='w-1/3 text-white bg-blue-700 rounded-lg text-sm px-4 py-2'>Login</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                    <hr />
                </div>
            </div>
        </div>
    );
};

export default Login;