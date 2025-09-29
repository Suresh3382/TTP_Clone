import React, { use, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import UserContext from '../../../Context/UserContext';
import { IFullDetails } from '../../../Interfaces/FulldetailsInterface';
import { baseURL } from '../../../baseURL';
import { useCallApi } from '../../../Utlits/AxiosConifg';
import { IContext } from '../../../Context/UserContextInterface';

const CabRequest = () => {
  const { callApi } = useCallApi();
  const { bordingProcess, setBordingProcess, agree, data, setData } = useContext(UserContext) as IContext;
  const navigate = useNavigate();

  const cabRequestSchema = Yup.object().shape({
    hasCabrequest: Yup.boolean(),
    cabRequestYesorNo: Yup.string().required('Feild is Required!'),
    landmark: Yup.string().when('hasCabrequest', ([hasCabrequest]) => {
      return hasCabrequest ? Yup.string().required('Feild is Required!') : Yup.string().notRequired()
    }),
    pickAndDropAddress: Yup.string().when('hasCabrequest', ([hasCabrequest]) => {
      return hasCabrequest ? Yup.string().required('Feild is Required!') : Yup.string().notRequired()
    }),
    mapLink: Yup.string().when('hasCabrequest', ([hasCabrequest]) => {
      return hasCabrequest ? Yup.string().required('Feild is Required!') : Yup.string().notRequired()
    })
  })

  const cabRequestInitialValue: IFullDetails['cabRequest'] = {
    cabRequestYesorNo: data?.cabRequest?.cabRequestYesorNo || '',
    hasCabrequest: data?.cabRequest?.hasCabrequest || false,
    landmark: data?.cabRequest?.landmark || '',
    pickAndDropAddress: data?.cabRequest?.pickAndDropAddress || '',
    mapLink: data?.cabRequest?.mapLink || ''
  }

  const handleSubmit = async (values: IFullDetails["cabRequest"]) => {
    try {
      if (agree) {
        setData({ ...data, cabRequest: values });
        callApi({ requestEndpoint: `${baseURL}user/UserDetails`, method: 'post', body: data })
          .then((res) => {
            if (res.data) {
              alert('Data saved successfully!');
              setBordingProcess({
                ...bordingProcess,
                CabRequest: {
                  ...bordingProcess.CabRequest,
                  isSubmited: true,
                },
              });
              navigate('/home');
            } else {
              alert('Please agree to the terms and conditions before submitting.');
            }
          })
          .catch((error) => {
            console.error("Error during API call:", error);
          });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert('An error occurred while saving the data. Please try again.');
    }
  };

  return (
    <div>
      <p className='flex justify-center mt-2 mb-10 text-xl'>Cab Service Request Form</p>
      <Formik
        initialValues={cabRequestInitialValue}
        validationSchema={cabRequestSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            <div className='flex flex-col gap-4'>
              <div className='w-full flex gap-16'>
                <div className='w-1/2 flex justify-between'>
                  <label htmlFor="cabRequest">Do You Want Cab Facility</label>
                  <div>
                    <select name="cabRequest"
                      id="cabRequest"
                      className='border-0 border-b-2 w-64'
                      value={values.cabRequestYesorNo}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFieldValue('cabRequestYesorNo', e.target.value);
                        setFieldValue('hasCabrequest', value == 'yes' ? true : false);
                      }}>
                      <option hidden value="select">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    {errors.cabRequestYesorNo && touched.cabRequestYesorNo ? <div className='text-red-600'>{errors.cabRequestYesorNo}</div> : null}
                  </div>
                </div>
                {values.cabRequestYesorNo == 'yes' ?
                  <div className='w-1/2 flex justify-between'>
                    <label htmlFor="Landmark">Landmark</label>
                    <div>
                      <input
                        type="text"
                        className='border-0 border-b-2 w-64'
                        placeholder='Enter Landmark'
                        value={values.landmark}
                        onChange={(e) => { setFieldValue('landmark', e.target.value) }}
                      />
                      {errors.landmark && touched.landmark ? <div className='text-red-600'>{errors.landmark}</div> : null}
                    </div>
                  </div>
                  : null}
              </div>
              {values.cabRequestYesorNo == 'yes' ?
                <div className='w-full flex gap-16'>
                  <div className='w-1/2 flex justify-between'>
                    <label htmlFor="pickAndDropAddress">Enter Pick and Drop Address</label>
                    <div>
                      <textarea
                        className='border-0 border-b-2 w-64'
                        placeholder='Enter Pick and Drop Address'
                        value={values.pickAndDropAddress}
                        onChange={(e) => setFieldValue('pickAndDropAddress', e.target.value)}
                      />
                      {errors.pickAndDropAddress && touched.pickAndDropAddress ? <div className='text-red-600'>{errors.pickAndDropAddress}</div> : null}
                    </div>
                  </div>
                  <div className='w-1/2 flex justify-between'>
                    <label htmlFor="mapsLink">Maps Link</label>
                    <div>
                      <textarea
                        className='border-0 border-b-2 w-64'
                        placeholder='Enter Map Link'
                        value={values.mapLink}
                        onChange={(e) => setFieldValue('mapLink', e.target.value)}
                      />
                      {errors.mapLink && touched.mapLink ? <div className='text-red-600'>{errors.mapLink}</div> : null}
                    </div>
                  </div>
                </div>
                : null}
              <div>
                <button type='submit' disabled={!agree} className={!agree ? 'text-sm float-end my-6 bg-gray-400 px-3 py-1 rounded-md text-white' : 'text-sm float-end my-6 bg-sky-600 px-3 py-1 rounded-md text-white'}>Save</button>
                {!agree && <div className='text-red-600'>Please Agree Terms and Condition</div>}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div >
  )
}

export default CabRequest