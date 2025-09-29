import { useContext, useState } from 'react';
import { Form, Formik } from 'formik';
import { Button, Select } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import UserContext from '../../../../../Context/UserContext'
import { baseURL } from '../../../../../baseURL';
import { useCallApi } from '../../../../../Utlits/AxiosConifg';
import * as Yup from 'yup';

interface IPersonalInformation {
    fathersName: string,
    dateofbirth: string,
    gender: string,
    email: string,
    qualification: string[],
    maritalStatus: string,
    bloodGroup: string,
    personalEmail: string,
    contactNo: string,
    alternateMobileNo: string,
    systemUserName: string,
    systemPassword: string,
    presentAddress: {
        addressLine1: string,
        addressLine2: string,
        city: string,
        state: string,
        pincode: string,
    },
    permanentAddress: {
        addressLine1: string,
        addressLine2: string,
        city: string,
        state: string,
        pincode: string,
    },
}

const PersonalInformation = () => {
    const { callApi } = useCallApi();
    const { currentUserFullDetails, setIsDisable, isDisable, refresh, setRefresh } = useContext<any>(UserContext);

    const handleEdit = (values: IPersonalInformation) => {
        setIsDisable(true)
        const data = {
            contactFeilds: { ...currentUserFullDetails?.contactFeilds, ...values }
        }
        callApi({ requestEndpoint: `${baseURL}user/updateUser`, method: 'post', body: data })
            .then((res) => {
                setRefresh(refresh === true ? false : true);
            }).catch((error) => {
                console.log("Error : ", error);
            })
    }

    const personalInformationInitialValues: IPersonalInformation = {
        fathersName: currentUserFullDetails?.contactFeilds?.fathersName || '',
        dateofbirth: currentUserFullDetails?.contactFeilds?.dateofbirth || '',
        gender: currentUserFullDetails?.contactFeilds?.gender || '',
        email: currentUserFullDetails?.contactFeilds?.email || '',
        qualification: currentUserFullDetails?.contactFeilds?.qualification || [],
        maritalStatus: currentUserFullDetails?.contactFeilds?.maritalStatus || '',
        bloodGroup: currentUserFullDetails?.contactFeilds?.bloodGroup || '',
        personalEmail: currentUserFullDetails?.contactFeilds?.personalEmail || '',
        contactNo: currentUserFullDetails?.contactFeilds?.contactNo || '',
        alternateMobileNo: currentUserFullDetails?.contactFeilds?.altContactNo || '',
        systemUserName: currentUserFullDetails?.contactFeilds?.systemUserName || '',
        systemPassword: currentUserFullDetails?.contactFeilds?.systemPassword || '',
        presentAddress: {
            addressLine1: currentUserFullDetails?.contactFeilds?.presentAddress?.addressLine1 || '',
            addressLine2: currentUserFullDetails?.contactFeilds?.presentAddress?.addressLine2 || '',
            city: currentUserFullDetails?.contactFeilds?.presentAddress?.city || '',
            state: currentUserFullDetails?.contactFeilds?.presentAddress?.state || '',
            pincode: currentUserFullDetails?.contactFeilds?.presentAddress?.pincode || '',
        },
        permanentAddress: {
            addressLine1: currentUserFullDetails?.contactFeilds?.permanentAddress?.addressLine1 || '',
            addressLine2: currentUserFullDetails?.contactFeilds?.permanentAddress?.addressLine2 || '',
            city: currentUserFullDetails?.contactFeilds?.permanentAddress?.city || '',
            state: currentUserFullDetails?.contactFeilds?.permanentAddress?.state || '',
            pincode: currentUserFullDetails?.contactFeilds?.permanentAddress?.pincode || '',
        },
    }

    let schema = Yup.object().shape({
        fathersName: Yup.string().matches(/^[a-z ,.'-]+$/i, 'It Should not be a Number!'),
        dateofbirth: Yup.date(),
        gender: Yup.string().matches(/^[a-z ,.'-]+$/i, 'It Should not be a Number!'),
        bloodGroup: Yup.string().matches(/^[a-z ,.'-]+$/i, 'It Should not be a Number!'),
        maritalStatus: Yup.string().matches(/^[a-z ,.'-]+$/i, 'It Should not be a Number!'),
        email: Yup.string().email('Invalid Email'),
        personalEmail: Yup.string().email('Invalid Email'),
        contactNo: Yup.number().positive().min(10),
        alternateMobileNo: Yup.number().positive().min(10),
        systemUserName: Yup.string().matches(/^[a-z ,.'-]+$/i, 'It Should not be a Number!'),
        systemPassword: Yup.number(),
        presentAddress: Yup.object().shape({
            addressLine1: Yup.string(),
            city: Yup.string().matches(/^[a-z ,.'-]+$/i, 'It Should not be a Number!'),
            state: Yup.string().matches(/^[a-z ,.'-]+$/i, 'It Should not be a Number!'),
            pincode: Yup.number().min(6),
        }),
        permanentAddress: Yup.object().shape({
            addressLine1: Yup.string(),
            city: Yup.string().matches(/^[a-z ,.'-]+$/i, 'It Should not be a Number!'),
            state: Yup.string().matches(/^[a-z ,.'-]+$/i, 'It Should not be a Number!'),
            pincode: Yup.number().min(6),
        }),
    });

    return (
        <div>
            <p className='underline'>Personal Information</p>
            <div className='flex gap-1'>
                <p className='text-xs text-gray-400 mt-2'>Enter your essential details here for personalised service and accurate communication, ensuring a smooth and secure experience.</p>
                {isDisable == true ? <Button className='text-blue-600 bg-blue-50 border-blue-50' onClick={() => setIsDisable(false)}><EditOutlined /></Button> : null}
            </div>
            <Formik
                initialValues={personalInformationInitialValues}
                validationSchema={schema}
                onSubmit={handleEdit}
            >
                {({ errors, touched, values, setFieldValue }) => (
                    <Form>
                        <div>
                            <div className='mt-5 gap-4 grid grid-cols-4'>
                                <div className='col-span-2'>
                                    <div>
                                        <label htmlFor="fatherName" className="block text-sm/6 font-medium text-gray-900">
                                            FATHER NAME
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                                <input
                                                    id="fatherName"
                                                    name="fatherName"
                                                    type="text"
                                                    placeholder="Father Name"
                                                    className="block grow py-1.5 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                                    value={values.fathersName}
                                                    onChange={(e: any) => setFieldValue("fathersName", e.target.value)}
                                                    disabled={isDisable === true ? true : false}
                                                />
                                            </div>
                                        </div>
                                        {errors.fathersName && touched.fathersName ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.fathersName}</div>) : ''}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="dateOfBirth" className="block text-sm/6 font-medium text-gray-900">
                                        BIRTH DATE
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                            <input
                                                id="dateOfBirth"
                                                name="dateOfBirth"
                                                type="date"
                                                placeholder="Birth Date"
                                                className="block grow py-1.5 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                                value={values.dateofbirth}
                                                onChange={(e: any) => setFieldValue('dateOfBirth', e.target.value)}
                                                disabled={isDisable === true ? true : false}
                                            />
                                        </div>
                                    </div>
                                    {errors.dateofbirth && touched.dateofbirth ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.dateofbirth}</div>) : ''}
                                </div>
                                <div>
                                    <label htmlFor="gender" className="block text-sm/6 font-medium text-gray-900">
                                        GENDER
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                            < select
                                                className="block grow py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                                value={values.gender}
                                                onChange={(e: any) => setFieldValue('gender', e.target.value)}
                                                disabled={isDisable === true ? true : false}
                                            >
                                                <option hidden>Gender</option>
                                                <option id='01'>Male</option>
                                                <option id='02'>Female</option>
                                                <option id='03'>Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    {errors.gender && touched.gender ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.gender}</div>) : ''}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='mt-2 gap-4 grid grid-cols-4'>
                                <div className='col-span-2'>
                                    <div>
                                        <label htmlFor="qualifications" className="block text-sm/6 font-medium text-gray-900">
                                            QUALIFICATIONS
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                                <Select
                                                    mode="multiple"
                                                    style={{ width: '100%' }}
                                                    placeholder="Select Qualification"
                                                    options={[
                                                        {
                                                            value: "BCA",
                                                            label: "BCA",
                                                        },
                                                        {
                                                            value: "BSC",
                                                            label: "BSC",

                                                        },
                                                        {
                                                            value: "MCA",
                                                            label: "MCA",
                                                        },
                                                        {
                                                            value: "MSC",
                                                            label: "MSC",
                                                        }
                                                    ]}
                                                    value={values.qualification}
                                                    onChange={(value: string[]) => setFieldValue('qualification', value)}
                                                    disabled={isDisable === true ? true : false}
                                                />
                                            </div>
                                        </div>
                                        {errors.qualification && touched.qualification ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.qualification}</div>) : ''}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="maritalStatus" className="block text-sm/6 font-medium text-gray-900">
                                        MARITAL STATUS
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                            < select
                                                className="block grow py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                                value={values.maritalStatus}
                                                onChange={(e: any) => setFieldValue('maritalStatus', e.target.value)}
                                                disabled={isDisable === true ? true : false}
                                            >
                                                <option hidden>Marital Status</option>
                                                <option id='01'>Single</option>
                                                <option id='02'>Married</option>
                                            </select>
                                        </div>
                                    </div>
                                    {errors.maritalStatus && touched.maritalStatus ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.maritalStatus}</div>) : ''}
                                </div>
                                <div>
                                    <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                        BLOOD GROUP
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                            < select
                                                className="block grow py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                                value={values.bloodGroup}
                                                onChange={(e: any) => setFieldValue('bloodGroup', e.target.value)}
                                                disabled={isDisable === true ? true : false}
                                            >
                                                <option hidden>Blood Group</option>
                                                <option id='01'>A</option>
                                                <option id='02'>B</option>
                                                <option id='03'>C</option>
                                                <option id='04'>O</option>
                                                <option id='05'>AB</option>
                                            </select>
                                        </div>
                                    </div>
                                    {errors.bloodGroup && touched.bloodGroup ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.bloodGroup}</div>) : ''}
                                </div>
                            </div>
                        </div>
                        <div className='mt-2 gap-4 grid grid-cols-4'>
                            <div className='col-span-2'>
                                <div>
                                    <label htmlFor="workEmail" className="block text-sm/6 font-medium text-gray-900">
                                        WORK EMAIL
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                            <input
                                                id="workEmai;"
                                                name="workEmail"
                                                type="text"
                                                placeholder="Work Email"
                                                className="block grow py-1.5 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                                value={values.email}
                                                onChange={(e: any) => setFieldValue('email', e.target.value)}
                                                disabled={isDisable === true ? true : false}
                                            />
                                        </div>
                                    </div>
                                    {errors.email && touched.email ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.email}</div>) : ''}
                                </div>
                            </div>
                            <div className='col-span-2'>
                                <div>
                                    <label htmlFor="personalEmail" className="block text-sm/6 font-medium text-gray-900">
                                        PERSONAL EMAIL
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                            <input
                                                id="personalemail"
                                                name="personalEmail"
                                                type="text"
                                                placeholder="Personal Email"
                                                className="grow py-1.5 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                                value={values.personalEmail}
                                                onChange={(e: any) => setFieldValue('personalEmail', e.target.value)}
                                                disabled={isDisable === true ? true : false}
                                            />
                                        </div>
                                    </div>
                                    {errors.personalEmail && touched.personalEmail ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.personalEmail}</div>) : ''}
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label htmlFor="personalMobile" className="block text-sm font-medium text-gray-900">
                                    PERSONAL MOBILE
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            id="personalMobile"
                                            name="personalMobile"
                                            type="text"
                                            placeholder="Personal Mobile"
                                            className="w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                            value={values.contactNo}
                                            onChange={(e: any) => setFieldValue('contactNo', e.target.value)}
                                            disabled={isDisable === true ? true : false}
                                        />
                                    </div>
                                </div>
                                {errors.contactNo && touched.contactNo ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.contactNo}</div>) : ''}
                            </div>
                            <div>
                                <label htmlFor="alternateMobile" className="block text-sm font-medium text-gray-900">
                                    ALTERNATE MOBILE
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            id="alternateMobile"
                                            name="alternateMobile"
                                            type="text"
                                            placeholder="Alternate Mobile"
                                            className="w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                            value={values.alternateMobileNo}
                                            onChange={(e: any) => setFieldValue('altMobileNo', e.target.value)}
                                            disabled={isDisable === true ? true : false}
                                        />
                                    </div>
                                </div>
                                {errors.alternateMobileNo && touched.alternateMobileNo ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.alternateMobileNo}</div>) : ''}
                            </div>
                            <div>
                                <label htmlFor="systemUsername" className="block text-sm font-medium text-gray-900">
                                    SYSTEM USERNAME
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            id="systemUsername"
                                            name="systemUsername"
                                            type="text"
                                            placeholder="System Username"
                                            className="w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                            value={values.systemUserName}
                                            onChange={(e: any) => setFieldValue('systemUserName', e.target.value)}
                                            disabled={isDisable === true ? true : false}
                                        />
                                    </div>
                                </div>
                                {errors.systemUserName && touched.systemUserName ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.systemUserName}</div>) : ''}
                            </div>
                            <div>
                                <label htmlFor="systemPassword" className="block text-sm font-medium text-gray-900">
                                    SYSTEM PASSWORD
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            id="systemPassword"
                                            name="systemPassword"
                                            type="password"
                                            placeholder="System Password"
                                            className="w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                            value={values.systemPassword}
                                            onChange={(e: any) => setFieldValue('systemPassword', e.target.value)}
                                            disabled={isDisable === true ? true : false}
                                        />
                                    </div>
                                </div>
                                {errors.systemPassword && touched.systemPassword ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.systemPassword}</div>) : ''}
                            </div>
                        </div>
                        <div className='grid grid-cols-4 gap-4 mt-2'>
                            <div className='col-span-2'>
                                <div>
                                    <label htmlFor="permanentAddressLine1" className="block text-sm/6 font-medium text-gray-900">
                                        PERMANENT ADDRESS
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                            <input
                                                className="block grow py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                                id="permanentAddressLine1"
                                                name="permanentAddressLine1"
                                                type="text"
                                                placeholder="Permanent Address Line1"
                                                value={values.permanentAddress.addressLine1}
                                                onChange={(e: any) => setFieldValue("permanentAddress.addressLine1", e.target.value)}
                                                disabled={isDisable === true ? true : false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-2'>
                                <div>
                                    <label htmlFor="presentAddressLine1" className="block text-sm/6 font-medium text-gray-900">
                                        PRESENT ADDRESS
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                            <input
                                                className="block grow py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                                id="presentAddressLine1"
                                                name="presentAddressLine1"
                                                type="text"
                                                placeholder="Permanent Address Line1"
                                                value={values.presentAddress.addressLine1}
                                                onChange={(e: any) => setFieldValue("presentAddress.addressLine1", e.target.value)}
                                                disabled={isDisable === true ? true : false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='grid grid-cols-4 gap-4 mt-2'>
                            <div className='col-span-2'>
                                <div>
                                    <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            className="block grow py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                            id="permanentAddressLine2"
                                            name="permanentAddressLine2"
                                            type="text"
                                            placeholder="Permanent Address Line2"
                                            value={values.permanentAddress.addressLine2}
                                            onChange={(e: any) => setFieldValue("permanentAddress.addressLine2", e.target.value)}
                                            disabled={isDisable === true ? true : false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-2'>
                                <div>
                                    <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            className="block grow py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                            id="presentAddressLine2"
                                            name="presentAddressLine2"
                                            type="text"
                                            placeholder="Present Address Line2"
                                            value={values.presentAddress.addressLine2}
                                            onChange={(e: any) => setFieldValue("presentAddress.addressLine2", e.target.value)}
                                            disabled={isDisable === true ? true : false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='grid grid-cols-4 gap-4 mt-2'>
                            <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    className="block w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    id="state"
                                    name="state"
                                    type="text"
                                    placeholder="State"
                                    value={values.permanentAddress.state}
                                    onChange={(e: any) => setFieldValue('permanentAddress.state', e.target.value)}
                                    disabled={isDisable === true ? true : false}
                                />
                            </div>
                            <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    className="block w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    id="city"
                                    name="city"
                                    type="text"
                                    placeholder="City"
                                    value={values.permanentAddress.city}
                                    onChange={(e: any) => setFieldValue('permanentAddress.city', e.target.value)}
                                    disabled={isDisable === true ? true : false}
                                />
                            </div>
                            <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    className="block w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    id="state2"
                                    name="state2"
                                    type="text"
                                    placeholder="State"
                                    value={values.presentAddress.state}
                                    onChange={(e: any) => setFieldValue('presentAddress.state', e.target.value)}
                                    disabled={isDisable === true ? true : false}
                                />
                            </div>
                            <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    className="block w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    id="city2"
                                    name="city2"
                                    type="text"
                                    placeholder="City"
                                    value={values.presentAddress.city}
                                    onChange={(e: any) => setFieldValue('presentAddress.city', e.target.value)}
                                    disabled={isDisable === true ? true : false}
                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-4 gap-4 mt-2 mb-8'>
                            <div className='col-span-2'>
                                <div>
                                    <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            className="block grow py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                            id="personalMobile"
                                            name="personalMobile"
                                            type="text"
                                            placeholder="Pin Code"
                                            value={values.permanentAddress.pincode}
                                            onChange={(e: any) => setFieldValue('permanentAddress.pincode', e.target.value)}
                                            disabled={isDisable === true ? true : false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-2'>
                                <div>
                                    <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            className="block grow py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                            id="personalMobile"
                                            name="personalMobile"
                                            type="text"
                                            placeholder="Pin Code"
                                            value={values.presentAddress.pincode}
                                            onChange={(e: any) => setFieldValue('presentAddress.pincode', e.target.value)}
                                            disabled={isDisable === true ? true : false}
                                        />
                                    </div>
                                </div>
                                {errors.presentAddress?.addressLine1 && touched.presentAddress?.addressLine1 ? (<div className='text-red-600 font-medium mt-1'>{errors.presentAddress?.addressLine1}</div>) : ''}
                                {errors.presentAddress?.state && touched.presentAddress?.state ? (<div className='text-red-600 font-medium mt-1'>{errors.presentAddress?.state}</div>) : ''}
                                {errors.presentAddress?.city && touched.presentAddress?.city ? (<div className='text-red-600 font-medium mt-1'>{errors.presentAddress?.city}</div>) : ''}
                                {errors.presentAddress?.pincode && touched.presentAddress?.pincode ? (<div className='text-red-600 font-medium mt-1'>{errors.presentAddress?.pincode}</div>) : ''}
                            </div>
                            {errors.permanentAddress?.addressLine1 && touched.permanentAddress?.addressLine1 ? (<div className='text-red-600 font-medium mt-1'>{errors.permanentAddress?.addressLine1}</div>) : ''}
                            {errors.permanentAddress?.state && touched.permanentAddress?.state ? (<div className='text-red-600 font-medium mt-1'>{errors.permanentAddress?.state}</div>) : ''}
                            {errors.permanentAddress?.city && touched.permanentAddress?.city ? (<div className='text-red-600 font-medium mt-1'>{errors.permanentAddress?.city}</div>) : ''}
                            {errors.permanentAddress?.pincode && touched.permanentAddress?.pincode ? (<div className='text-red-600 font-medium mt-1'>{errors.permanentAddress?.pincode}</div>) : ''}
                        </div>
                        {isDisable === false ?
                            <div className='flex gap-3 justify-end'>
                                <button type='submit' className='px-8 bg-blue-700 rounded-md text-white'>Save</button>
                                <Button onClick={() => setIsDisable(true)} className='px-7'>Cancel</Button>
                            </div>
                            : null
                        }
                    </Form>
                )}
            </Formik>
        </div >
    )
}

export default PersonalInformation