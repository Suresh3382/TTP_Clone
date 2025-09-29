import React, { useContext } from 'react'
import * as Yup from 'yup';
import { Formik, Form, FieldArray } from 'formik';
import UserContext from '../../../Context/UserContext';
import { EPageName } from '../../Details/DetailsEnum/detailsEnum';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import { IFullDetails } from '../../../Interfaces/FulldetailsInterface';

const EmployeesKyc = () => {
    const { bordingProcess, setBordingProcess, setActivePage, data, setData } = useContext<any>(UserContext);

    const EmployeesKycSchema = Yup.object().shape({
        UANNo: Yup.string().required(),
        nationality: Yup.string().required(),
        guardianName: Yup.string().required(),
        relationWithGurdian: Yup.string().required('Feild is required!'),
        isInternationWorkerChecked: Yup.boolean(),
        countryofOrigin: Yup.string().when('isInternationalWorkerChecked', ([isInternationalWorkerChecked]) =>
            isInternationalWorkerChecked ? Yup.string().required('Country of Origin is required!') : Yup.string().notRequired()
        ),
        isPhysicalHandiCapChecked: Yup.boolean(),
        handicaptype: Yup.string().when('isPhysicalHandiCapChecked', ([isPhysicalHandiCapChecked]) => {
            return isPhysicalHandiCapChecked ? Yup.string().required('Feild is required!') : Yup.string().notRequired()
        }),
        totalPercentage: Yup.number().test('', (label) => `Total percentage must be exactly 100%, current total = ${label.value}`, (value, context) => {
            const total = context.parent?.nominees?.reduce((sum, nominee) => sum + (nominee.percentage || 0), 0);
            return total === 100;
        }),
        nominees: Yup.array().of(Yup.object().shape({
            nomineesName: Yup.string().required('Feild is required!'),
            relationWithNominee: Yup.string().required('Feild is required!'),
            DOB: Yup.string().required('Feild is required!'),
            percentage: Yup.number()
                .required('required')
        }))
    })

    const EmployeesKycInitialValue: IFullDetails['EmployeesKyc'] = {

        UANNo: data?.EmployeesKyc?.UANNo || '',
        nationality: data?.EmployeesKyc?.nationality || '',
        guardianName: data?.EmployeesKyc?.guardianName || '',
        relationWithGurdian: data?.EmployeesKyc?.relationWithGurdian || '',
        isInternationalWorker: data?.EmployeesKyc?.isInternationalWorker || '',
        isInternationalWorkerChecked: data?.EmployeesKyc?.isInternationalWorkerChecked || false,
        countryofOrigin: data?.EmployeesKyc?.countryofOrigin || '',
        isPhysicalHandicap: data?.EmployeesKyc?.isPhysicalHandicap || '',
        isPhysicalHandiCapChecked: data?.EmployeesKyc?.isPhysicalHandiCapChecked || false,
        handicaptype: data?.EmployeesKyc?.handicaptype || '',
        totalPercentage: 0,
        nominees: data?.EmployeesKyc?.nominees || [{ nomineesName: '', DOB: '', percentage: 100, relationWithNominee: '' }],

    }

    const handleEmployeeKyc = (values: IFullDetails['EmployeesKyc']) => {
        setData({ ...data, EmployeesKyc: values });
        alert('data Saved')
        setBordingProcess(
            {
                ...bordingProcess,
                EmployeesKyc: {
                    ...bordingProcess.EmployeesKyc,
                    isSubmited: true
                },
                CabRequest: {
                    ...bordingProcess.CabRequest,
                    hasAccess: true,
                }
            }
        )
        setActivePage(EPageName.cabDetails);
    }

    return (
        <div>
            <p className='text-xl text-center py-5'>Employees Kyc Form</p>
            <Formik
                initialValues={EmployeesKycInitialValue}
                validationSchema={EmployeesKycSchema}
                onSubmit={handleEmployeeKyc}
            >
                {({ values, errors, touched, setFieldValue }) => {
                    return <Form>
                        <div className='flex flex-col gap-7'>
                            <div className='w-full flex justify-between gap-16 mt-12'>
                                <div className='w-1/2 flex justify-between'>
                                    <label htmlFor="UANNo">UAN Number</label>
                                    <div>
                                        <input type="text" style={{ outline: 'none' }} className='border-0 border-b-2 w-64' placeholder='Enter Your UAN Number'
                                            value={values.UANNo}
                                            onChange={(e) => setFieldValue('UANNo', e.target.value)}
                                        />
                                        {errors.UANNo && touched.UANNo ? <div className='text-red-600'>{errors.UANNo}</div> : null}
                                    </div>
                                </div>
                                <div className='w-1/2 flex justify-between'>
                                    <label htmlFor="Nationality">Nationality</label>
                                    <div>
                                        <input type="text" className='border-0 border-b-2 w-64' placeholder='Enter Nationality'
                                            value={values.nationality}
                                            onChange={(e) => setFieldValue('nationality', e.target.value)}
                                        />
                                        {errors.nationality && touched.nationality ? <div className='text-red-600'>{errors.nationality}</div> : null}
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex justify-between gap-16'>
                                <div className='w-1/2 flex justify-between'>
                                    <label htmlFor="guardianName">Guardian Name</label>
                                    <div>
                                        <input type="text" className='border-0 border-b-2 w-64' placeholder='Enter Your Guardian Name'
                                            value={values.guardianName}
                                            onChange={(e) => setFieldValue('guardianName', e.target.value)}
                                        />
                                        {errors.nationality && touched.nationality ? (
                                            <div className='text-red-600'>{errors.nationality}</div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className='w-1/2 flex justify-between'>
                                    <label htmlFor="relationWithGuardian">Relation With Guardian</label>
                                    <div>
                                        <input type="text" className='border-0 border-b-2 w-64' placeholder='Enter Your Relation With Guardian'
                                            value={values.relationWithGurdian}
                                            onChange={(e) => setFieldValue('relationWithGurdian', e.target.value)}
                                        />
                                        {errors.relationWithGurdian && touched.relationWithGurdian ? <div className='text-red-600'>{errors.relationWithGurdian}</div> : null}
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex justify-between'>
                                <div className='w-[40.5%] flex justify-end'>
                                    <div className='space-x-2'>
                                        <input
                                            type="checkbox"
                                            checked={values.isInternationalWorkerChecked}
                                            onChange={(e) => setFieldValue('isInternationalWorkerChecked', e.target.checked)}
                                        />
                                        <label htmlFor="isInternationalWorker">Is International Worker</label>
                                    </div>
                                </div>
                                {values.isInternationalWorkerChecked ? (
                                    <div className='w-1/2 flex flex-col justify-between'>
                                        <div className='flex justify-between'>
                                            <label htmlFor="countryOfOrigin" className='ms-8'>Country Of Origin</label>
                                            <input
                                                type="text"
                                                className='border-0 border-b-2 w-64'
                                                placeholder='Enter Your Country Of Origin'
                                                value={values.countryofOrigin}
                                                onChange={(e) => setFieldValue('countryofOrigin', e.target.value)}
                                            />
                                        </div>
                                        <div className='flex justify-center'>
                                            {errors.countryofOrigin && touched.countryofOrigin ? (
                                                <div className='text-red-600 ms-64'>{errors.countryofOrigin}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div className='w-full flex justify-between'>
                                <div className='w-2/5 flex justify-end'>
                                    <div className='space-x-2 me-[13px]'>
                                        <input
                                            type="checkbox"
                                            checked={values.isPhysicalHandiCapChecked}
                                            onChange={(e) => setFieldValue('isPhysicalHandiCapChecked', e.target.checked)}
                                        />
                                        <label htmlFor="isPhysicalHandicap">Is Physical Handicap</label>
                                    </div>
                                </div>
                                {values.isPhysicalHandiCapChecked ? (
                                    <div className='w-1/2 flex flex-col justify-between'>
                                        <div className='flex justify-between'>
                                            <label htmlFor="handiCapType" className='ms-8'>HandiCap Type</label>
                                            <select
                                                className='border-0 border-b-2 w-64'
                                                value={values.handicaptype}
                                                onChange={(e) => setFieldValue('handicaptype', e.target.value)}
                                            >
                                                <option hidden value="">Enter Your HandiCap Type</option>
                                                <option value="locomotion">Locomotion</option>
                                                <option value="hearingAndVisual">Hearing And Visual</option>
                                            </select>
                                        </div>
                                        <div className='flex justify-center'>
                                            {errors.handicaptype && touched.handicaptype ? (
                                                <div className='text-red-600 ms-44'>{errors.handicaptype}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div>
                                <FieldArray name='nominees'>
                                    {({ push, remove }) => (
                                        <div>
                                            {values.nominees.map((nominees, index) => {
                                                return (
                                                    <div key={index}>
                                                        <div className='w-full flex justify-between py-1'>
                                                            <div className='w-1/4'>
                                                                <label htmlFor="nominees">Nominees</label>
                                                            </div>
                                                            <div className='flex gap-2.5 items-center'>
                                                                <div className='h-12'>
                                                                    <input
                                                                        type="text"
                                                                        placeholder='Nominee Name'
                                                                        className='border-0 border-b-2 w-64'
                                                                        value={nominees.nomineesName}
                                                                        onChange={(e) => setFieldValue(`nominees[${index}].nomineesName`, e.target.value)} />
                                                                    {errors && errors.nominees && errors.nominees.length > 0 && errors.nominees?.[index] && errors.nominees?.[index]?.['nomineesName'] && <div className='text-red-600'>{errors.nominees?.[index]?.['nomineesName']}</div>}
                                                                </div>
                                                                <div className='h-12'>
                                                                    <input
                                                                        type="text"
                                                                        placeholder='Relation with Nominee'
                                                                        className='border-0 border-b-2 w-64'
                                                                        value={nominees.relationWithNominee}
                                                                        onChange={(e) => setFieldValue(`nominees[${index}].relationWithNominee`, e.target.value)} />
                                                                    {errors && errors.nominees && errors.nominees?.[index]?.['relationWithNominee'] &&
                                                                        <div className='text-red-600'>{errors.nominees?.[index]?.['relationWithNominee']}</div>}
                                                                </div>
                                                                <div className='h-12'>
                                                                    <input
                                                                        type="date"
                                                                        placeholder='Select DOB'
                                                                        className='border-0 border-b-2 w-48'
                                                                        value={nominees.DOB}
                                                                        onChange={(e) => {
                                                                            setFieldValue(`nominees[${index}].DOB`, e.target.value);
                                                                        }}
                                                                    />
                                                                    {errors && errors.nominees && errors.nominees.length > 0 && errors.nominees?.[index] && errors?.nominees?.[index]?.['DOB'] && <div className='text-red-600'>{errors.nominees?.[index]?.['DOB']}</div>}
                                                                </div>
                                                                <div className='h-12'>
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Percentage"
                                                                        className="border-0 border-b-2 w-32"
                                                                        value={values.nominees[index].percentage}
                                                                        onChange={(e) => {
                                                                            const value = e.target.value;
                                                                            let total = 0;
                                                                            if (values.nominees && values.nominees.length > 0) {
                                                                                total = values.nominees.reduce((sum, nominee, i) => {
                                                                                    if (i !== index) {
                                                                                        return sum + (+nominee.percentage) || 0;
                                                                                    }
                                                                                    return sum;
                                                                                }, 0);
                                                                            }
                                                                            const totalPercentage = total + (+value);
                                                                            setFieldValue(`nominees[${index}].percentage`, value);
                                                                            setFieldValue('totalPercentage', totalPercentage);
                                                                        }}
                                                                    />
                                                                    {errors && errors.nominees && errors.nominees.length > 0 && errors.nominees?.[index] && errors.nominees?.[index]?.['percentage'] && <div className='text-red-600'>{errors.nominees?.[index]?.['percentage']}</div>}
                                                                </div>
                                                                <button className='text-red-600' onClick={() => remove(index)}><DeleteOutlined /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div>
                                                <button onClick={() => push({
                                                    nominees: {
                                                        nomineesName: data?.nominees?.nomineesName || '',
                                                        relationWithNominee: data?.nominees?.relationWithNominee || '',
                                                        DOB: data?.nominees?.DOB || '',
                                                        percentage: data?.nominees?.percentage || 100
                                                    },
                                                })} type="button" className="border my-3 text-blue-700 font-medium rounded-lg text-sm px-5 py-1 text-center me-2 mb-2 dark:text-blue-500">Add</button>
                                            </div>
                                        </div>
                                    )}
                                </FieldArray>
                                {errors?.totalPercentage && <div className='text-red-600'>{errors?.totalPercentage}</div>}
                            </div>
                            <div>
                                <button type='submit' className='text-sm float-end my-4 bg-sky-600 px-3 py-1 rounded-md text-white'>Save&Continue</button>
                            </div>
                        </div>
                    </Form>
                }}
            </Formik>
        </div >
    )
}

export default EmployeesKyc