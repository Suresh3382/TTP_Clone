import React, { useContext, useState } from 'react';
import imageCompression from 'browser-image-compression';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Image, Select, Switch } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import UserContext from '../../../Context/UserContext';
import { EPageName } from '../../Details/DetailsEnum/detailsEnum';
import { IFullDetails } from '../../../Interfaces/FulldetailsInterface';
import { IContext } from '../../../Context/UserContextInterface';

const ContactUs = () => {
    const { bordingProcess, setBordingProcess, setActivePage, data, setData } = useContext(UserContext) as IContext;

    let schema = Yup.object().shape({
        firstName: Yup.string().required("Requierd!"),
        lastName: Yup.string().required("Requierd!"),
        fathersName: Yup.string().required("Requierd!"),
        dateofbirth: Yup.date().min('2000-01-01').required("Requierd!"),
        gender: Yup.string().required("Requierd!"),
        bloodGroup: Yup.string().required("Requierd!"),
        maritalStatus: Yup.string().required("Requierd!"),
        contactNo: Yup.number().positive().min(10).required("Requierd!"),
        email: Yup.string().email('Invalid Email').required("Requierd!"),
        aadharId: Yup.string().required("Requierd!").matches(/^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)/, "Invalid Aadhar No"),
        aadharName: Yup.string().min(3).required("Requierd!"),
        isPassport: Yup.boolean(),
        passportNo: Yup.string().when('isPassport', ([isPassport]) => {
            return isPassport ? Yup.string().required("Requierd!").matches(/^(?!^0+$)[a-zA-Z0-9]{3,20}$/, "Invalid Passport No.") : Yup.string().notRequired();
        }),
        validFrom: Yup.string().when('isPassport', ([isPassport]) => {
            return isPassport ? Yup.date().required("Requierd!") : Yup.string().notRequired();
        }),
        validTo: Yup.string().when('isPassport', ([isPassport]) => {
            return isPassport ? Yup.date().required("Requierd!") : Yup.string().notRequired();
        }),
        presentAddress: Yup.object().shape({
            addressLine1: Yup.string().required("Requierd!"),
            city: Yup.string().required("Requierd!"),
            state: Yup.string().required("Requierd!"),
            pincode: Yup.number().required("Requierd!").min(6),
        }),
        permanentAddress: Yup.object().shape({
            addressLine1: Yup.string().required("Requierd!"),
            city: Yup.string().required("Requierd!"),
            state: Yup.string().required("Requierd!"),
            pincode: Yup.number().required("Requierd!").min(6),
        }),
    });

    const initialValues: IFullDetails['contactFeilds'] = {
        firstName: data?.contactFeilds?.firstName || '',
        lastName: data?.contactFeilds?.lastName || '',
        fathersName: data?.contactFeilds?.fathersName || '',
        dateofbirth: data?.contactFeilds?.dateofbirth || '',
        gender: data?.contactFeilds?.gender || '',
        bloodGroup: data?.contactFeilds?.bloodGroup || '',
        maritalStatus: data?.contactFeilds?.maritalStatus || '',
        contactNo: data?.contactFeilds?.contactNo || '',
        email: data?.contactFeilds?.email || '',
        aadharId: data?.contactFeilds?.aadharId || '',
        aadharName: data?.contactFeilds?.aadharName || '',
        qualification: data?.contactFeilds?.qualification || [],
        isPassport: data?.contactFeilds?.isPassport || false,
        passportNo: data?.contactFeilds?.passportNo || '',
        validFrom: data?.contactFeilds?.validFrom || '',
        validTo: data?.contactFeilds?.validTo || '',
        presentAddress: {
            addressLine1: data?.contactFeilds?.presentAddress?.addressLine1 || '',
            addressLine2: data?.contactFeilds?.presentAddress?.addressLine2 || '',
            city: data?.contactFeilds?.presentAddress?.city || '',
            state: data?.contactFeilds?.presentAddress?.state || '',
            pincode: data?.contactFeilds?.presentAddress?.pincode || '',
        },
        permanentAddress: {
            addressLine1: data?.contactFeilds?.permanentAddress?.addressLine1 || '',
            addressLine2: data?.contactFeilds?.permanentAddress?.addressLine2 || '',
            city: data?.contactFeilds?.permanentAddress?.city || '',
            state: data?.contactFeilds?.permanentAddress?.state || '',
            pincode: data?.contactFeilds?.permanentAddress?.pincode || '',
        },
        image: data?.contactFeilds?.image || '',
    }
    const handleSubmit = (values: IFullDetails["contactFeilds"]) => {
        setData({
            ...data,
            contactFeilds: values
        });
        // setGlobalState(values, 'IcontactFeilds')
        alert("data saved");
        setBordingProcess({
            ...bordingProcess,
            basicEmployeeDetail: {
                ...bordingProcess.basicEmployeeDetail,
                isSubmited: true
            },
            EmployeesKyc: {
                ...bordingProcess.EmployeesKyc,
                hasAccess: true,
            }
        })
        setActivePage(EPageName.kycDetails)
    }


    return (
        <div className="flex flex-col items-center">
            <p className='text-xl py-5 text-center'>Basic Employee Details</p>
            <div className='w-full mt-10'>
                <Formik
                    initialValues={initialValues}
                    validationSchema={schema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, values, setFieldValue }) => {
                        const handleImageUpload = async (e: any) => {
                            try {
                                const file = e.target.files?.[0];
                                if (!file) {
                                    alert("No file selected.");
                                    return;
                                }
                                const options = {
                                    maxSizeMB: 1,
                                    maxWidthOrHeight: 250
                                };
                                const compressedFile = await imageCompression(file, options);

                                const reader = new FileReader();
                                reader.onload = async () => {
                                    const base64Image = reader.result;
                                    setFieldValue('image', base64Image)
                                };
                                reader.readAsDataURL(compressedFile);

                            } catch (error) {
                                console.error("Error during image upload:", error);
                                alert("An error occurred while uploading the image.");
                            }
                        };

                        return <Form>
                            <div className='flex justify-between w-full space-x-32 flex-row'>
                                <div className='flex items-center justify-between mb-4 flex-grow w-40'>
                                    <label htmlFor="firstName">Name</label>
                                    <div className='flex flex-row'>
                                        <div className='flex flex-col'>
                                            <input
                                                type="text"
                                                placeholder='Enter Your First Name'
                                                className='border-b border-gray-300 focus:outline-none focus:border-blue-500 py-2'
                                                value={values.firstName}
                                                onChange={(e: any) => setFieldValue("firstName", e.target.value)}
                                            />
                                            {errors.firstName && touched.firstName ? (<div className='text-red-600 font-medium mt-1 me-2'>{errors.firstName}</div>) : ''}
                                        </div>
                                        <div className='flex flex-col'>
                                            <input
                                                type="text"
                                                placeholder='Enter Your Last Name'
                                                className='border-b border-s px-1 border-gray-300 focus:outline-none focus:border-blue-500 py-2'
                                                value={values.lastName}
                                                onChange={(e: any) => setFieldValue("lastName", e.target.value)}
                                            />
                                            {errors.lastName && touched.lastName ? (<div className='text-red-600 font-medium mt-1'>{errors.lastName}</div>) : ''}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between mb-4 flex-grow w-40'>
                                    <label htmlFor="fatherName">Fathers Name</label>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder='Enter Your Father Name'
                                            className='border-b pe-[190px] border-gray-300 focus:outline-none focus:border-blue-500 py-2'
                                            value={values.fathersName}
                                            onChange={(e: any) => setFieldValue("fathersName", e.target.value)}
                                        />
                                        {errors.fathersName && touched.fathersName ? (<div className='text-red-600 font-medium mt-1'>{errors.fathersName}</div>) : ''}
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between w-full space-x-32 flex-row'>
                                <div className='flex items-center justify-between mb-4 flex-grow w-40'>
                                    <label htmlFor="firstName">Date of Birth</label>
                                    <div>
                                        <input
                                            type="date"
                                            placeholder='Select date'
                                            className='border-b pe-[233px] border-gray-300 focus:outline-none focus:border-blue-500 py-2 '
                                            value={values.dateofbirth}
                                            onChange={(e: any) => setFieldValue('dateofbirth', e.target.value)}
                                        />
                                        {errors.dateofbirth && touched.dateofbirth ? (<div className='text-red-600 font-medium mt-1'>{errors.dateofbirth}</div>) : ''}
                                    </div>
                                </div>
                                <div className='flex items-center justify-between mb-4 flex-grow w-40'>
                                    <div className='flex items-center gap-20 flex-grow w-40'>
                                        <label className='className="text-gray-700'>Gender</label>
                                        <div className='flex flex-col'>
                                            <select
                                                value={values.gender}
                                                onChange={(e: any) => setFieldValue('gender', e.target.value)}
                                            >
                                                <option hidden>Select Gender</option>
                                                <option id='01'>Male</option>
                                                <option id='02'>Female</option>
                                                <option id='03'>Other</option>
                                            </select>
                                            {errors.gender && touched.gender ? (<div className='text-red-600 font-medium mt-1'>{errors.gender}</div>) : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between my-2 w-full space-x-32 flex-row'>
                                <div className='flex items-center  gap-10 mb-4 flex-grow w-40'>
                                    <label htmlFor='BG'>Blood Group</label>
                                    <div className='flex flex-col'>
                                        <select defaultValue={'sbg'}
                                            value={values.bloodGroup}
                                            onChange={(e: any) => setFieldValue('bloodGroup', e.target.value)}>
                                            <option hidden value="sbg">Select Blood Group</option>
                                            <option>A</option>
                                            <option>B</option>
                                            <option>AB</option>
                                            <option>O</option>
                                        </select>
                                        {errors.bloodGroup && touched.bloodGroup ? (<div className='text-red-600 font-medium mt-1'>{errors.bloodGroup}</div>) : ''}
                                    </div>
                                </div>
                                <div className='flex items-center justify-between mb-4 flex-grow w-40'>
                                    <div className='flex items-center gap-8 flex-grow w-40'>
                                        <label className='className="text-gray-700'>Marital Status</label>
                                        <div className='flex flex-col'>
                                            <select defaultValue={'ms'}
                                                value={values.maritalStatus}
                                                onChange={(e: any) => setFieldValue('maritalStatus', e.target.value)}>
                                                <option hidden value="ms">Marital Status</option>
                                                <option>Married</option>
                                                <option>Single</option>
                                            </select>
                                            {errors.maritalStatus && touched.maritalStatus ? (<div className='text-red-600 font-medium mt-1'>{errors.maritalStatus}</div>) : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between w-full space-x-32 flex-row'>
                                <div className='flex items-center justify-between mb-4 flex-grow w-40'>
                                    <label htmlFor="firstName">Contact No.</label>
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder='Enter Your Phone No'
                                            className='border-b pe-[190px] border-gray-300 focus:outline-none focus:border-blue-500 py-2 '
                                            value={values.contactNo}
                                            onChange={(e: any) => setFieldValue("contactNo", e.target.value)}
                                        />
                                        {errors.contactNo && touched.contactNo ? (<div className='text-red-600 font-medium mt-1'>{errors.contactNo}</div>) : ''}
                                    </div>
                                </div>
                                <div className='flex items-center justify-between mb-4 flex-grow w-40'>
                                    <div className='flex items-center justify-between flex-grow w-40'>
                                        <label className='className="text-gray-700'>Email Id</label>
                                        <div className='flex flex-col'>
                                            <input
                                                type="text"
                                                placeholder='Enter Your Email Id'
                                                className='border-b pe-[190px] border-gray-300 focus:outline-none focus:border-blue-500 py-2 '
                                                value={values.email}
                                                onChange={(e: any) => setFieldValue('email', e.target.value)}
                                            />
                                            {errors.email && touched.email ? (<div className='text-red-600 font-medium mt-1'>{errors.email}</div>) : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between w-full space-x-32'>
                                <div className='flex items-center justify-between mb-4 flex-grow w-40'>
                                    <label htmlFor="firstName">Aadhar Id</label>
                                    <div className='flex flex-col'>
                                        <input
                                            type="tel"
                                            placeholder='Enter Your Aadhar No.'
                                            className='border-b pe-[190px] border-gray-300 focus:outline-none focus:border-blue-500 py-2 '
                                            value={values.aadharId}
                                            onChange={(e: any) => setFieldValue('aadharId', e.target.value)}
                                        />
                                        {errors.aadharId && touched.aadharId ? (<div className='text-red-600 font-medium mt-1'>{errors.aadharId}</div>) : ''}
                                    </div>
                                </div>
                                <div className='flex items-center justify-between mb-4 flex-grow w-40'>
                                    <div className='flex items-center justify-between flex-grow w-40'>
                                        <label className='className="text-gray-700'>Name as Per Aadhar Id</label>
                                        <div className='flex flex-col'>
                                            <input
                                                type="Text"
                                                placeholder='Name as Per Aadhar Id'
                                                className='border-b pe-[190px] border-gray-300 focus:outline-none focus:border-blue-500 py-2 '
                                                value={values.aadharName}
                                                onChange={(e: any) => setFieldValue('aadharName', e.target.value)}
                                            />
                                            {errors.aadharName && touched.aadharName ? (<div className='text-red-600 font-medium mt-1'>{errors.aadharName}</div>) : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between my-2 w-full space-x-32 flex-row'>
                                <div className='flex items-center space-x-11 mb-4 flex-grow w-40'>
                                    <label htmlFor='BG'>Select Qualification</label>
                                    <Select
                                        mode="multiple"
                                        style={{ width: '29%' }}
                                        placeholder="Select Qualification"
                                        value={values.qualification}
                                        onChange={(value: string[]) => setFieldValue('qualification', value)}
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
                                    />
                                    {errors.qualification && touched.qualification ? (<div className='text-red-600 font-medium mt-1'>{errors.qualification}</div>) : ''}
                                </div>
                            </div>
                            <div className='mb-2'>
                                <p>Has Passport?</p>
                                <Switch onChange={() => setFieldValue("isPassport", !values.isPassport)} />
                            </div>
                            {values.isPassport ?
                                <div className='flex justify-between w-full space-x-32 flex-row'>
                                    <div className='flex items-center justify-between mb-4 flex-grow w-40'>
                                        <label htmlFor="fatherName">Passport No.</label>
                                        <div className='flex flex-col gap-3'>
                                            <input
                                                type="text"
                                                placeholder='Enter Passport No.'
                                                className='border-b pe-[190px] border-gray-300 focus:outline-none focus:border-blue-500 py-2'
                                                value={values.passportNo}
                                                onChange={(e: any) => setFieldValue('passportNo', e.target.value)}
                                            />
                                            {errors.passportNo && touched.passportNo ? (<div className='text-red-600 font-medium mt-1'>{errors.passportNo}</div>) : ''}
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-between mb-4 flex-grow w-40'>
                                        <label htmlFor="firstName">Passport Valid</label>
                                        <div className='flex flex-row'>
                                            <div className='flex flex-col'>
                                                <input
                                                    type="date"
                                                    placeholder='Valid from'
                                                    className='border-b pe-[40px] border-gray-300 focus:outline-none focus:border-blue-500 py-2'
                                                    value={values.validFrom}
                                                    onChange={(e: any) => setFieldValue('validFrom', e.target.value)}
                                                />
                                                {errors.validFrom && touched.validFrom ? (<div className='text-red-600 font-medium mt-1 me-2'>{errors.validFrom}</div>) : ''}
                                            </div>
                                            <div className='flex flex-col'>
                                                <input
                                                    type="date"
                                                    placeholder='Valid to'
                                                    className='border-b pe-[36px] border-s px-1 border-gray-300 focus:outline-none focus:border-blue-500 py-2'
                                                    value={values.validTo}
                                                    onChange={(e: any) => setFieldValue('validTo', e.target.value)}
                                                />
                                                {errors.validTo && touched.validTo ? (<div className='text-red-600 font-medium mt-1'>{errors.validTo}</div>) : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : null}
                            <div className='flex space-x-2 pb-2 ms-[630px]'>
                                <label htmlFor="">Same as Present</label>
                                <input type="checkbox" onChange={(e) => {
                                    let isChecked = e.target.checked;
                                    if (isChecked) {
                                        setFieldValue('permanentAddress', values.presentAddress)
                                    }
                                }} />
                            </div>
                            <div className='flex justify-between w-full space-x-32 flex-row'>
                                <div className='flex gap-12 justify-between mb-4 flex-grow w-40'>
                                    <div>
                                        <label htmlFor="firstName">Present Address</label>
                                    </div>
                                    <div className='flex flex-col gap-3'>
                                        <input
                                            type="text"
                                            placeholder='Address Line 1'
                                            className='border-b pe-[190px] border-gray-300 focus:outline-none focus:border-blue-500 py-2 '
                                            value={values.presentAddress.addressLine1}
                                            onChange={(e: any) => setFieldValue("presentAddress.addressLine1", e.target.value)}
                                        />
                                        {errors.presentAddress?.addressLine1 && touched.presentAddress?.addressLine1 ? (<div className='text-red-600 font-medium mt-1'>{errors.presentAddress?.addressLine1}</div>) : ''}
                                        <input
                                            type="text"
                                            placeholder='Address Line 2'
                                            className='border-b pe-[190px] border-gray-300 focus:outline-none focus:border-blue-500 py-2 '
                                            value={values.presentAddress.addressLine2}
                                            onChange={(e: any) => setFieldValue("presentAddress.addressLine2", e.target.value)}
                                        />
                                        <div className='flex items-center justify-between flex-grow w-40'>
                                            <div className='flex flex-row'>
                                                <div className='flex flex-col'>

                                                    <input
                                                        type="text"
                                                        placeholder='Enter your City'
                                                        className='border-b border-gray-300 focus:outline-none focus:border-blue-500 py-2'
                                                        value={values.presentAddress.city}
                                                        onChange={(e: any) => setFieldValue('presentAddress.city', e.target.value)}
                                                    />
                                                    {errors.presentAddress?.city && touched.presentAddress?.city ? (<div className='text-red-600 font-medium mt-1'>{errors.presentAddress?.city}</div>) : ''}
                                                </div>
                                                <div className='flex flex-col'>

                                                    <input
                                                        type="text"
                                                        placeholder='Enter Your state'
                                                        className='border-b border-s px-1 border-gray-300 focus:outline-none focus:border-blue-500 py-2'
                                                        value={values.presentAddress.state}
                                                        onChange={(e: any) => setFieldValue('presentAddress.state', e.target.value)}
                                                    />
                                                    {errors.presentAddress?.state && touched.presentAddress?.state ? (<div className='text-red-600 font-medium mt-1'>{errors.presentAddress?.state}</div>) : ''}
                                                </div>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder='Pincode'
                                            className='border-b pe-[190px] border-gray-300 focus:outline-none focus:border-blue-500 py-2 '
                                            value={values.presentAddress.pincode}
                                            onChange={(e: any) => setFieldValue('presentAddress.pincode', e.target.value)} />
                                        {errors.presentAddress?.pincode && touched.presentAddress?.pincode ? (<div className='text-red-600 font-medium mt-1'>{errors.presentAddress?.pincode}</div>) : ''}
                                    </div>
                                </div>
                                <div className='flex items-center justify-between mb-4 flex-grow w-40'>
                                    <div className='flex gap-[15px] justify-between flex-grow w-40'>
                                        <div>
                                            <label className='className="text-gray-700'>Permanent Address</label>
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <input
                                                type="text"
                                                placeholder='Address Line 1'
                                                className='border-b pe-[190px] border-gray-300 focus:outline-none focus:border-blue-500 py-2 '
                                                value={values.permanentAddress.addressLine1}
                                                onChange={(e: any) => setFieldValue("permanentAddress.addressLine1", e.target.value)}
                                            />
                                            {errors.permanentAddress?.addressLine1 && touched.permanentAddress?.addressLine1 ? (<div className='text-red-600 font-medium mt-1'>{errors.permanentAddress?.addressLine1}</div>) : ''}
                                            <input
                                                type="text"
                                                placeholder='Address Line 2'
                                                className='border-b pe-[190px] border-gray-300 focus:outline-none focus:border-blue-500 py-2 '
                                                value={values.permanentAddress.addressLine2}
                                                onChange={(e: any) => setFieldValue("permanentAddress.addressLine2", e.target.value)}
                                            />
                                            <div className='flex items-center justify-between flex-grow w-40'>
                                                <div className='flex flex-row'>
                                                    <div className='flex flex-col'>

                                                        <input
                                                            type="text"
                                                            placeholder='Enter your City'
                                                            className='border-b border-gray-300 focus:outline-none focus:border-blue-500 py-2'
                                                            value={values.permanentAddress.city}
                                                            onChange={(e: any) => setFieldValue('permanentAddress.city', e.target.value)}
                                                        />
                                                        {errors.permanentAddress?.city && touched.permanentAddress?.city ? (<div className='text-red-600 font-medium mt-1'>{errors.permanentAddress?.city}</div>) : ''}
                                                    </div>
                                                    <div className='flex flex-col'>

                                                        <input
                                                            type="text"
                                                            placeholder='Enter Your state'
                                                            className='border-b border-s px-1 border-gray-300 focus:outline-none focus:border-blue-500 py-2'
                                                            value={values.permanentAddress.state}
                                                            onChange={(e: any) => setFieldValue('permanentAddress.state', e.target.value)}
                                                        />
                                                        {errors.permanentAddress?.state && touched.permanentAddress?.state ? (<div className='text-red-600 font-medium mt-1'>{errors.permanentAddress?.state}</div>) : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder='Pincode'
                                                className='border-b pe-[190px] border-gray-300 focus:outline-none focus:border-blue-500 py-2 '
                                                value={values.permanentAddress.pincode}
                                                onChange={(e: any) => setFieldValue('permanentAddress.pincode', e.target.value)} />
                                            {errors.permanentAddress?.pincode && touched.permanentAddress?.pincode ? (<div className='text-red-600 font-medium mt-1'>{errors.permanentAddress?.pincode}</div>) : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex  items-start gap-3 mt-5">
                                <label htmlFor="file-upload" className="flex items-center gap-4 cursor-pointer">
                                    <p className="font-medium text-gray-700">Profile Picture</p>
                                    <div className="py-2 px-6 text-sm border-2 border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 transition">
                                        Upload
                                    </div>
                                </label>
                                {values.image &&
                                    <Image
                                        width={100}
                                        height={100}
                                        src={values.image as string}
                                        className="rounded-full border border-gray-300"
                                    />

                                }
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    name="image"
                                    onChange={handleImageUpload}
                                />
                            </div>
                            <button type='submit' className='float-end my-6 bg-sky-700 px-3 py-1 rounded-md text-white'>Save&Continue</button>
                        </Form>
                    }
                    }
                </Formik>
            </div >
        </div >
    );
}


export default ContactUs;