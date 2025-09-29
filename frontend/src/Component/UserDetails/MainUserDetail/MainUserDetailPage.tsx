import { UserOutlined } from '@ant-design/icons'
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import ContactUs from '../BasicInfo/ContactUs'
import CabRequest from '../CabRequest/CabRequest'
import { EPageName } from '../../Details/DetailsEnum/detailsEnum'
import UserContext from '../../../Context/UserContext'
import EmployeesKyc from '../EmployeesKYC/EmployeesKyc'

const MainUserDetailPage = () => {
    const { bordingProcess, activePage, setActivePage, setAgree, loggedUser } = useContext<any>(UserContext);
    const handleAgreement = (e: any) => {
        setAgree(e.target.checked)
    }

    return (
        <div>
            <div>
                <p className='text-xl font-semibold'>On Bording Process</p>
            </div>
            <hr className='my-2' />
            <div className='w-full flex gap-2'>
                <div className='w-1/4'>
                    <div className='px-8'>
                        <p className='text-base '>Welcome</p>
                        <div className='flex gap-2 pt-2 text-xl'>
                            <UserOutlined />
                            <p>{loggedUser?.username}</p>
                        </div>
                    </div>
                    <div className='flex flex-col p-8 space-y-9'>
                        <button style={{ textAlign: 'left', cursor: 'pointer' }} className={activePage === EPageName.empDetails ? 'text-blue-700' : 'hover:text-blue-500'} onClick={() => setActivePage(EPageName.empDetails)}>Basic Employee Details</button>
                        <button style={{ textAlign: 'left', cursor: 'pointer' }} className={activePage === EPageName.kycDetails ? 'text-blue-700' : 'hover:text-blue-500'} disabled={!bordingProcess?.EmployeesKyc?.hasAccess} onClick={() => setActivePage(EPageName.kycDetails)}>Employee KYC Form</button>
                        <button style={{ textAlign: 'left', cursor: 'pointer' }} className={activePage === EPageName.cabDetails ? 'text-blue-700' : 'hover:text-blue-500'} disabled={!bordingProcess?.CabRequest?.hasAccess} onClick={() => setActivePage(EPageName.cabDetails)}>Cab Request</button>
                        <div className='flex items-center gap-2'>
                            <input type="checkbox" onClick={handleAgreement} />
                            <label htmlFor="policies">Agree With Terms and Condition</label>
                        </div>
                    </div>
                </div>
                <div className='w-3/4'>
                    {activePage === EPageName.empDetails && <ContactUs />}
                    {bordingProcess?.EmployeesKyc?.hasAccess && activePage === EPageName.kycDetails && < EmployeesKyc />}
                    {bordingProcess?.CabRequest?.hasAccess && activePage === EPageName.cabDetails && < CabRequest />}
                </div>
            </div>
        </div>
    )
}

export default MainUserDetailPage