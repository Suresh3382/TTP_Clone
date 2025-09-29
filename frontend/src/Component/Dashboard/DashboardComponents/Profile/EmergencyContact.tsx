import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useContext } from 'react'
import { Formik, Form } from 'formik';
import { baseURL } from '../../../../baseURL';
import { useCallApi } from '../../../../Utlits/AxiosConifg';
import UserContext from '../../../../Context/UserContext';
import * as Yup from 'yup';


interface IEmergencyContact {
    contactName: string,
    contactNo: string,
    relation: string,
    address: {
        addressLine1: string,
        addressLine2: string,
        city: string,
        state: string,
        pincode: string,
    },
}

const EmergencyContact = () => {
    const { callApi } = useCallApi();
    const { currentUserFullDetails, setIsDisable, isDisable, refresh, setRefresh } = useContext<any>(UserContext);

    const handleEdit = (values: IEmergencyContact) => {
        setIsDisable(true)
        const data = {
            emergencyContact: values
        }
        callApi({ requestEndpoint: `${baseURL}user/updateUser`, method: 'post', body: data })
            .then((res) => {
                setRefresh(refresh === true ? false : true);
            }).catch((error) => {
                console.log("Error : ", error);
            })
    }

    const EmergencyContactInitialValues: IEmergencyContact = {
        contactName: currentUserFullDetails?.emergencyContact?.contactName || '',
        contactNo: currentUserFullDetails?.emergencyContact?.contactNo || '',
        relation: currentUserFullDetails?.emergencyContact?.relation || '',
        address: {
            addressLine1: currentUserFullDetails?.emergencyContact?.address?.addressLine1 || '',
            addressLine2: currentUserFullDetails?.emergencyContact?.address?.addressLine2 || '',
            city: currentUserFullDetails?.emergencyContact?.address?.city || '',
            state: currentUserFullDetails?.emergencyContact?.address?.state || '',
            pincode: currentUserFullDetails?.emergencyContact?.address?.pincode || '',
        },
    }

    let schema = Yup.object().shape({
        contactName: Yup.string().matches(/^[a-z ,.'-]+$/i, 'Its Should be a name'),
        contactNo: Yup.number().positive().min(10, 'Contact Number must be equal to 10'),
        relation: Yup.string().matches(/^[a-z ,.'-]+$/i, 'Its Should be a name'),
        permanentAddress: Yup.object().shape({
            addressLine1: Yup.string(),
            city: Yup.string().matches(/^[a-z ,.'-]+$/i, 'Its Should be a name'),
            state: Yup.string().matches(/^[a-z ,.'-]+$/i, 'Its Should be a name'),
            pincode: Yup.number().min(6),
        }),
    });

    return (
        <div>
            <p className='underline'>Emergency Contact</p>
            <div className='flex gap-1'>
                <p className='text-xs text-gray-400 mt-2'>Ensure quick access to vital information in case of unexpected situations. Update and review your emergency contact details regula...</p>
                {isDisable == true ? <Button className='text-blue-600 bg-blue-50 border-blue-50' onClick={() => setIsDisable(false)}><EditOutlined /></Button> : null}
            </div>
            <Formik
                initialValues={EmergencyContactInitialValues}
                validationSchema={schema}
                onSubmit={handleEdit}
            >
                {({ errors, touched, values, setFieldValue }) => {
                    return <Form>
                        <div className='grid grid-cols-4 gap-4 mt-4'>
                            <div className='col-span-2'>
                                <div>
                                    <label htmlFor="contactName" className="block text-sm/6 font-medium text-gray-900">
                                        CONTACT NAME
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                            <input
                                                id="contactName"
                                                name="contactName"
                                                type="text"
                                                placeholder="Contact Name"
                                                className="block grow py-1.5 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                                disabled={isDisable === true ? true : false}
                                                value={values.contactName}
                                                onChange={(e: any) => setFieldValue("contactName", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {errors.contactName && touched.contactName ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.contactName}</div>) : ''}
                                </div>
                            </div>
                        </div>
                        <div className='grid grid-cols-4 gap-4 mt-4'>
                            <div>
                                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-900">
                                    CONTACT NUMBER
                                </label>
                                <div className="mt-2">
                                    <div className="flex flex-col items-center rounded-md bg-white outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-indigo-600">
                                        <input
                                            id="contactNumber"
                                            name="contactNumber"
                                            type="text"
                                            placeholder="Contact Number"
                                            className="block w-full py-1.5 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                            disabled={isDisable === true ? true : false}
                                            value={values.contactNo}
                                            onChange={(e: any) => setFieldValue("contactNo", e.target.value)}
                                        />
                                    </div>
                                    {errors.contactNo && touched.contactNo ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.contactNo}</div>) : ''}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="relation" className="block text-sm font-medium text-gray-900">
                                    RELATION
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-indigo-600">
                                        <input
                                            id="relation"
                                            name="relation"
                                            type="text"
                                            placeholder="Relation"
                                            className="block w-full py-1.5 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                            disabled={isDisable === true ? true : false}
                                            value={values.relation}
                                            onChange={(e: any) => setFieldValue("relation", e.target.value)}
                                        />
                                    </div>
                                </div>
                                {errors.relation && touched.relation ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.relation}</div>) : ''}
                            </div>
                        </div>
                        <div className='grid grid-cols-4 gap-4 mt-2'>
                            <div className='col-span-2'>
                                <div>
                                    <label htmlFor="workEmail" className="block text-sm/6 font-medium text-gray-900">
                                        ADDRESS
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                            <input
                                                className="block grow py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                                id="personalMobile"
                                                name="personalMobile"
                                                type="text"
                                                placeholder="Address Line1"
                                                disabled={isDisable === true ? true : false}
                                                value={values.address.addressLine1}
                                                onChange={(e: any) => setFieldValue("address.addressLine1", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='grid grid-cols-4 gap-4 mt-2'>
                            <div className='col-span-2'>
                                <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    <input
                                        className="block grow py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        id="personalMobile"
                                        name="personalMobile"
                                        type="text"
                                        placeholder="Address Line2"
                                        disabled={isDisable === true ? true : false}
                                        value={values.address.addressLine2}
                                        onChange={(e: any) => setFieldValue("address.addressLine2", e.target.value)}
                                    />
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
                                    disabled={isDisable === true ? true : false}
                                    value={values.address.state}
                                    onChange={(e: any) => setFieldValue("address.state", e.target.value)}
                                />
                            </div>
                            <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                <input
                                    className="block w-full py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                    id="city"
                                    name="city"
                                    type="text"
                                    placeholder="City"
                                    disabled={isDisable === true ? true : false}
                                    value={values.address.city}
                                    onChange={(e: any) => setFieldValue("address.city", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-4 gap-4 mt-2'>
                            <div className='col-span-2'>
                                <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    <input
                                        className="block grow py-2 px-3 text-base rounded-md text-gray-900 bg-gray-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        id="pincode"
                                        name="pincode"
                                        type="text"
                                        placeholder="Pin Code"
                                        disabled={isDisable === true ? true : false}
                                        value={values.address.pincode}
                                        onChange={(e: any) => setFieldValue("address.pincode", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        {errors.address?.addressLine1 && touched.address?.addressLine1 ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.address.addressLine1}</div>) : ''}
                        {errors.address?.state && touched.address?.state ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.address.state}</div>) : ''}
                        {errors.address?.city && touched.address?.city ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.address.city}</div>) : ''}
                        {errors.address?.pincode && touched.address?.pincode ? (<div className='text-red-600 font-medium mt-1 text-sm'>{errors.address.pincode}</div>) : ''}

                        {isDisable === false ?
                            <div className='flex gap-3 justify-end mt-6'>
                                <button type='submit' className='px-8 bg-blue-700 rounded-md text-white'>Save</button>
                                <Button onClick={() => setIsDisable(true)} className='px-7'>Cancel</Button>
                            </div>
                            : null
                        }
                    </Form>
                }}
            </Formik>
        </div>
    )
}

export default EmergencyContact