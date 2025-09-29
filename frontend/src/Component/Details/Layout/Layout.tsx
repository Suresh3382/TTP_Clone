import { BellOutlined, UserOutlined } from '@ant-design/icons'
import React, { useContext } from 'react'
import { Button, Popover } from 'antd';
import MainUserDetailPage from '../../UserDetails/MainUserDetail/MainUserDetailPage';
import UserContext from '../../../Context/UserContext';
import { IContext } from '../../../Context/UserContextInterface';


const Layout = () => {

    const { loggedUser, setisLogin, setData } = useContext<any>(UserContext);

    const handleLogout = () => {
        setData(null);
        localStorage.clear();
        sessionStorage.clear();
        setisLogin(false);
    }

    const content = (
        <div className='px-2 pb-2'>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
    const title = (
        <div className='flex gap-1 px-2'>
            <p className='font-bold'>Signed in as :</p>{loggedUser?.username}
        </div>
    );

    return (
        <div>
            <div className='flex justify-between bg-white px-4 py-3'>
                <p className='text-2xl font-bold text-[#223B95]'>USER <span className='text-blue-700'>MANAGEMENT</span></p>
                <div className='space-x-2'>
                    <BellOutlined className='rounded-full border border-[#D1E6FF] p-2 text-[#D1E6FF]' />
                    <Popover placement="bottomRight" title={title} content={content}>
                        <UserOutlined className='rounded-full border border-[#D1E6FF] p-2 text-[#D1E6FF]' />
                    </Popover>

                </div>
            </div>
            <div className='mx-3 bg-white my-5 p-5 rounded-s-lg'>
                <MainUserDetailPage />
            </div>
        </div>
    )
}

export default Layout