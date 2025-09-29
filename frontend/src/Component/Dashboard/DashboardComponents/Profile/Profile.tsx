import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../../../Context/UserContext';
import { CalendarOutlined, CreditCardOutlined, EditFilled, EditOutlined, FileTextOutlined, InfoCircleOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, Spin, Upload, UploadProps } from 'antd';
import PersonalInformation from './Personalnformation/PersonalInformation';
import EmergencyContact from './EmergencyContact';
import KYCDeatilsProfile from './KYCDeatilsProfile';
import IdentityInformation from './IdentityInformation';
import { baseURL } from '../../../../baseURL';
import { useCallApi } from '../../../../Utlits/AxiosConifg';
import imageCompression from 'browser-image-compression';
import { EprofilePageEnum } from './ProfileEnum/ProfileEnum';
import { Pencil } from 'lucide-react';

const Profile = () => {
  const { callApi } = useCallApi();
  const { currentUserFullDetails, setProfileEnum, setImage, Image, profileEnum, setCurrentUserFullDetails, setIsDisable, refresh, setRefresh } = useContext<any>(UserContext);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    callApi({ requestEndpoint: `${baseURL}user/full-details`, method: 'get' }).then((res) => {
      setCurrentUserFullDetails(res.data.data?.[0]);
      setLoading(false);
    })
  }, [refresh]);



  const handleChange = async (e: any) => {
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
        const imageURL = {
          imageURL: base64Image
        }
        callApi({ requestEndpoint: `${baseURL}user/updatePfp`, method: 'post', body: imageURL }).then((res) => {
          setImage(res.data.image);
        });
        setRefresh((prev: boolean) => !prev)
      };
      reader.readAsDataURL(compressedFile);

    } catch (error) {
      console.error("Error during image upload:", error);
      alert("An error occurred while uploading the image.");
    }
  };

  return (
    <>
      {loading == true ?
        <div className='h-[70vh] flex justify-center items-center'>
          <Spin />
        </div> :
        <div className='flex flex-col container relative'>
          <div>
            {currentUserFullDetails?.contactFeilds?.image || Image ?
              <img src={Image || currentUserFullDetails?.contactFeilds?.image || Avatar} className='rounded-full w-36 h-36 absolute left-44 top-10 border-4 border-white' alt="" />
              : <Avatar size={145} icon={<UserOutlined />} className='rounded-full w-36 h-36 absolute left-44 top-10 border-4 border-white' />
            }
            <label htmlFor="abc">
              <Pencil size={35} className='rounded-full absolute cursor-pointer bg-gray-50 shadow-sm left-[280px] top-[140px] px-[8px] py-2 avatar-uploader flex items-center justify-center text-lg text-blue-500' />
              <input type='file'
                onChange={handleChange}
                className='hidden'
                id='abc'
              />
            </label>
          </div>
          <div className='w-100 flex justify-center bg-gray-100'>
            <div className='flex self-center gap-6 py-5 w-1/2'>
              <div className='flex flex-col self-center gap-2'>
                <p className='text-2xl'>{currentUserFullDetails.contactFeilds.firstName} <span>{currentUserFullDetails.contactFeilds.lastName}</span></p>
                <div className='flex gap-2'>
                  <p className='text-xs bg-white rounded-md border py-1 px-2 border-gray-300'>Senior Assistant System Engineer - L2</p>
                  <p className='text-xs bg-white rounded-md border py-1 px-2 border-gray-300'>Development</p>
                </div>
                <div className='flex gap-6'>
                  <span className='flex gap-2 text-xs text-gray-700'><MailOutlined />{currentUserFullDetails.contactFeilds.email}</span>
                  <span className='flex gap-2 text-xs text-gray-700'><CalendarOutlined />{currentUserFullDetails.contactFeilds.dateofbirth}</span>
                </div>
              </div>
            </div>
          </div>
          <div className='flex mt-5 gap-4 self-center w-1/2'>
            <Button className={profileEnum === EprofilePageEnum.personalInformationProfile ? 'text-blue-700 border-blue-700' : 'hover:text-blue-500'} onClick={() => { setProfileEnum(EprofilePageEnum.personalInformationProfile); setIsDisable(true); }}><UserOutlined />Personal Information</Button>
            <Button className={profileEnum === EprofilePageEnum.emergencyContactProfile ? 'text-blue-700 border-blue-700' : 'hover:text-blue-500'} onClick={() => { setProfileEnum(EprofilePageEnum.emergencyContactProfile); setIsDisable(true); }}><FileTextOutlined /> Emergency Contact</Button>
            <Button className={profileEnum === EprofilePageEnum.kycDetailsProfile ? 'text-blue-700 border-blue-700' : 'hover:text-blue-500'} onClick={() => { setProfileEnum(EprofilePageEnum.kycDetailsProfile); setIsDisable(true); }}><CreditCardOutlined /> KYC Information</Button>
            <Button className={profileEnum === EprofilePageEnum.identityInformationProfile ? 'text-blue-700 border-blue-700' : 'hover:text-blue-500'} onClick={() => { setProfileEnum(EprofilePageEnum.identityInformationProfile); setIsDisable(true); }} ><InfoCircleOutlined /> Identity Information</Button>
          </div>
          <div className='flex self-center w-1/2 mt-4'>
            {profileEnum === EprofilePageEnum.personalInformationProfile && <PersonalInformation />}
            {profileEnum === EprofilePageEnum.emergencyContactProfile && <EmergencyContact />}
            {profileEnum === EprofilePageEnum.kycDetailsProfile && <KYCDeatilsProfile />}
            {profileEnum === EprofilePageEnum.identityInformationProfile && <IdentityInformation />}
          </div>
        </div>
      }
    </>
  )
}

export default Profile