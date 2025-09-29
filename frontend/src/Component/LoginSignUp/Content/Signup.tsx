import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Input, Button } from 'antd'
import * as Yup from 'yup';
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined, MailOutlined } from '@ant-design/icons'
import { Form, Formik } from 'formik';
import { ISignUpInterface } from './LoginSignUpInterface';
import axios from 'axios';
import { baseURL } from '../../../baseURL';

const Signup = () => {
    const navigate = useNavigate();

    const SignUpInitialValue = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    }

    let signUpSchema = Yup.object().shape({
        username: Yup.string().required('Username is required!'),
        email: Yup.string().email().required('Email is required!'),
        password: Yup.string().required('Password is required!'),
        confirmPassword: Yup.string().required('Confirm Password is required!').test('', 'Password must match', (value, context) => {
            return context.parent.password == value
        })
    })

    const handleSubmit = async (values: ISignUpInterface) => {
        const finalSignupValues = {
            username: values.username,
            email: values.email,
            password: values.password,
            role: "USER",
            onboardingComplete: false,
        }
        try {
            const response = await axios.post(`${baseURL}user/Signup`, finalSignupValues);
            if (response.data) {
                alert('Signup Sucessfully');
                navigate('/login');
            }
        } catch (error) {
            console.log("Error :", error);
        }
    }

    return (
        <div className="w-full min-h-screen flex">
            <div className="w-1/2 flex items-center justify-center bg-[#F3F4FA]">
                <img src='src\Component\LoginSignUp\Images\ttplogin.svg' alt="Login" />
            </div>
            <div className="w-1/2 flex items-center justify-center">
                <div className='w-1/3 h-full flex flex-col justify-center gap-10'>
                    <hr />
                    <p className='text-xl text-[#223B95]'>Create Your Account</p>
                    <div className='flex flex-col gap-5'>
                        <Formik
                            initialValues={SignUpInitialValue}
                            validationSchema={signUpSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values, errors, touched, setFieldValue }) => (
                                <Form>
                                    <div className='flex flex-col gap-3'>
                                        <div>
                                            <label htmlFor="username" className='text-[#223B95]'>Username</label>
                                            <Input placeholder="Enter Username" suffix={<UserOutlined />} className='border-none bg-[#F9FAFF]' value={values.username} onChange={(e: any) => setFieldValue('username', e.target.value)} />
                                            {errors.username && touched.username ? <span className='text-red-600'>{errors.username}</span> : null}
                                        </div>
                                        <div>
                                            <label htmlFor="email" className='text-[#223B95]'>Email</label>
                                            <Input placeholder="Enter email" suffix={<MailOutlined />} className='border-none bg-[#F9FAFF]' value={values.email} onChange={(e: any) => setFieldValue('email', e.target.value)} />
                                            {errors.email && touched.email ? <span className='text-red-600'>{errors.email}</span> : null}
                                        </div>
                                        <div>
                                            <label htmlFor="password" className='text-[#223B95]'>Password</label>
                                            <Input.Password placeholder="Enter Password" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} className='border-none bg-[#F9FAFF]' value={values.password} onChange={(e: any) => setFieldValue('password', e.target.value)} />
                                            {errors.password && touched.password ? <span className='text-red-600'>{errors.password}</span> : null}
                                        </div>
                                        <div>
                                            <label htmlFor="confirmPassword" className='text-[#223B95]'>Confirm Password</label>
                                            <Input.Password placeholder="Enter confirmPassword" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} className='border-none bg-[#F9FAFF]' value={values.confirmPassword} onChange={(e: any) => setFieldValue('confirmPassword', e.target.value)} />
                                            {errors.confirmPassword && touched.confirmPassword ? <span className='text-red-600'>{errors.confirmPassword}</span> : null}
                                        </div>
                                    </div>
                                    <p className='text-[#017AFF] cursor-pointer text-right my-6' onClick={() => navigate('/login')}>Login!</p>
                                    <div className='flex justify-center'>
                                        <button type='submit' className='w-1/3 text-white bg-blue-700 rounded-lg text-sm px-4 py-2'>Signup</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                    <hr />
                </div>
            </div>
        </div>
    )
}

export default Signup