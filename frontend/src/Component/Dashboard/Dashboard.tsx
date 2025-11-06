import { useContext, useState } from 'react';
import { BellOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Avatar, Button, Input, Menu, Modal, Popover } from 'antd';
import { Route, Routes, useNavigate } from 'react-router-dom';
import UserContext from '../../Context/UserContext';
import { baseURL } from '../../baseURL';
import { Calendar, ChartNoAxesColumnIncreasing, CircleUserRound, HousePlus, LayoutGrid, LogOut, SquareAsterisk, SquareUserRound, Star, User, Users } from 'lucide-react';
import { IContext } from '../../Context/UserContextInterface';
import { useDispatch, useSelector } from 'react-redux';
import { IPanelState, setIsAdminPanel, setSelectedKey } from '../Redux/Store';
import { useCallApi } from '../../Utlits/AxiosConifg';
import Request from './DashboardComponents/AdminDashboardComponents/Request';
import AdminDashboard from './DashboardComponents/AdminDashboardComponents/AdminDashboard';
import Attendance from './DashboardComponents/AdminDashboardComponents/Attendance/Attendance';
import Employees from './DashboardComponents/AdminDashboardComponents/Employess/Employees';
import Reports from './DashboardComponents/EmployeeComponents/Reports';
import Leaves from './DashboardComponents/Leaves/Leaves';
import Profile from './DashboardComponents/Profile/Profile';
import Home from './DashboardComponents/Home';



const Dashboard = () => {
    const { callApi } = useCallApi();
    const { loggedUser, Image } = useContext<IContext>(UserContext);
    const username = localStorage.getItem('username')
    const [modalOpen, setmodalOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAdmin = useSelector((state: { panelState: IPanelState }) => state.panelState.isAdminPanel);
    const selected = useSelector((state: { panelState: IPanelState }) => state.panelState.selectedKey);

    const items =
        isAdmin === false
            ? [
                {
                    key: '/home',
                    label: 'Home',
                    icon: <LayoutGrid size={21} />,
                },
                {
                    key: '/leaves',
                    label: 'Leaves',
                    icon: <HousePlus size={21} />,
                },
                {
                    key: '/profile',
                    label: 'Profile',
                    icon: <CircleUserRound size={21} />
                },
                {
                    key: '/reports',
                    label: 'Reports',
                    icon: <ChartNoAxesColumnIncreasing size={21} />
                }
            ]
            : [
                {
                    key: '/adminDashboard',
                    label: 'Dashboard',
                    icon: <LayoutGrid size={21} />
                },
                {
                    key: '/employees',
                    label: 'Employees',
                    icon: <Users size={21} />
                },
                {
                    key: '/request',
                    label: 'Request',
                    icon: <CircleUserRound size={21} />
                },
                {
                    key: '/attendance',
                    label: 'Attendance',
                    icon: <Calendar size={21} />
                },
            ];

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/Login');
    };

    const handleMenuClick = (e: { key: string }) => {
        navigate(e.key);
        dispatch(setSelectedKey(e.key))
    };

    const handleChangePassword = (values: any) => {
        try {
            callApi({
                requestEndpoint: `${baseURL}user/changePassword`, method: 'post', body: {
                    userId: loggedUser._id,
                    currentPassword: values.currentPassword,
                    updatedPassword: values.updatedPassword
                }
            }).then((res) => {
                if (res.data?.success) {
                    setmodalOpen(false);
                }
            })
        } catch (error) {
            console.log("Error:", error)
        }
    }

    return (
        <div>
            <div className="flex gap-4 bg-white" style={{ height: '100vh', overflow: 'hidden' }}>
                <div style={{ width: '5.4%', position: 'sticky', top: 7, left: 7, bottom: 7, zIndex: 1000, height: '98vh' }}>
                    <Menu
                        onClick={handleMenuClick}
                        style={{
                            width: 90,
                            height: '100%',
                            backgroundColor: '#0052CC',
                            borderRadius: '10px'
                        }}
                        selectedKeys={[selected]}
                        className='flex flex-col items-center'
                        mode="inline"
                        theme="dark"
                        inlineCollapsed
                    >
                        <Menu.Item key="logo" disabled style={{
                            textAlign: 'center', padding: 0, height: '60px', display: "flex", justifyContent: 'center', width: "85px", margin: '10px 0px 10px 4px'
                        }}
                            className='cursor-pointer'
                            title={null}
                        >
                            <img src="/logo.png" className='flex justify-center w-[20] h-16' />
                        </Menu.Item>

                        {items.map(item => (
                            <Menu.Item
                                key={item.key}
                                title={null}
                                icon={
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '60px' }} className='font-[Outfit] py-1.5 gap-0.5'>
                                        <div>{item.icon}</div>
                                        <span className='mt-1 text-[10px]'>{item.label}</span>
                                    </div>
                                }
                            />
                        ))}
                    </Menu>

                </div>
                <div style={{ width: '93%', overflowY: 'auto' }}>
                    <div
                        className="w-full h-12 rounded-md flex justify-between bg-[#F0F3F8] px-4 items-center"
                        style={{ position: 'sticky', top: 7, zIndex: 1000 }}
                    >
                        <p className="text-md font-normal">Welcome, {username || loggedUser?.username}</p>
                        <div className="flex space-x-5">
                            <div className="bg-white py-1.5 px-2.5 rounded-md">
                                <BellOutlined />
                            </div>
                            <div className="flex items-center gap-3">
                                {loggedUser?.pfp ? (
                                    <Avatar size={35} src={Image || loggedUser?.pfp} />
                                ) : (
                                    <Avatar size={35} icon={<UserOutlined />} />
                                )}
                                <Popover
                                    open={open}
                                    onOpenChange={(newOpen: boolean) => {
                                        setOpen(newOpen);
                                    }}
                                    placement="bottomRight"
                                    trigger={'click'}
                                    content={
                                        <div className="font-[Outfit] w-72 p-4 bg-gradient-to-b from-blue-500/10 to-white backdrop-blur-lg rounded-[6px] ">
                                            <div className="text-center mx-auto">
                                                {loggedUser.pfp ? (
                                                    <div className='mx-auto border-2 border-blue-800 rounded-full w-[92px] h-[92px] flex items-center justify-center'>
                                                        <Avatar size={80} src={Image || loggedUser?.pfp} />
                                                    </div>
                                                ) : (
                                                    <div className='mx-auto border-2 border-blue-800 rounded-full w-[90px] h-[90px] flex items-center justify-center'>
                                                        <Avatar size={80} icon={<UserOutlined />} />
                                                    </div>
                                                )}
                                                <div className="flex flex-col gap-2 mt-2">
                                                    <p className="text-xl">{loggedUser?.username}</p>
                                                    <p className="text-blue-700 bg-blue-100 rounded-xl"
                                                    >
                                                        {loggedUser?.email}
                                                    </p>
                                                </div>
                                            </div>
                                            {loggedUser?.role === "ADMIN" ?
                                                <div className='mt-6 '>
                                                    <Button type="text"
                                                        className="w-full flex justify-start gap-5 text-12 bg-slate-100 text-gray-600 border-none"
                                                        onClick={() => {
                                                            if (isAdmin) {
                                                                dispatch(setIsAdminPanel(false));
                                                                dispatch(setSelectedKey('/home'));
                                                                navigate('/home');
                                                                setOpen(false);
                                                            } else {
                                                                dispatch(setIsAdminPanel(true));
                                                                dispatch(setSelectedKey('/adminDashboard'));
                                                                navigate('/adminDashboard');
                                                                setOpen(false);
                                                            }
                                                        }}
                                                    >
                                                        <User size={24} className='p-1 bg-white rounded' />
                                                        <span className='font-[Outfit]'>{isAdmin ? "Employee Panel" : "Admin Panel"}</span>
                                                    </Button>
                                                </div>
                                                : null
                                            }
                                            <div className="flex flex-col gap-2 my-3 ">
                                                <p>Account</p>
                                                <Button
                                                    type="text"
                                                    onClick={() => setmodalOpen(true)}
                                                    className="w-full font-[Outfit] flex justify-start gap-5 text-12 bg-slate-100 text-gray-600 border-none"
                                                >
                                                    <SquareAsterisk size={24} className='p-1 bg-white rounded' />
                                                    Change Password
                                                </Button>
                                            </div>
                                            <div className="flex justify-end mt-5">
                                                <Button className='custom-red-hover text-red-600 bg-red-100 border-none' onClick={handleLogout}>
                                                    <LogOut size={18} />
                                                    Logout
                                                </Button>
                                                <Modal
                                                    title="Change Password"
                                                    centered
                                                    open={modalOpen}
                                                    onCancel={() => setmodalOpen(false)}
                                                    footer={null}
                                                >
                                                    <Form
                                                        name="basic"
                                                        labelCol={{ span: 8 }}
                                                        wrapperCol={{ span: 16 }}
                                                        onFinish={handleChangePassword}
                                                        autoComplete="off"
                                                        style={{ padding: '10px' }}
                                                    >
                                                        <Form.Item
                                                            label="Current Password"
                                                            name="currentPassword"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Please input your Current Password!',
                                                                },
                                                            ]}
                                                        >
                                                            <Input.Password />
                                                        </Form.Item>

                                                        <Form.Item
                                                            label="New Password"
                                                            name="updatedPassword"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Please input your new password!',
                                                                },
                                                            ]}
                                                        >
                                                            <Input.Password />
                                                        </Form.Item>

                                                        <Form.Item className="flex justify-end">
                                                            <Button type="primary" htmlType="submit">
                                                                Submit
                                                            </Button>
                                                        </Form.Item>
                                                    </Form>
                                                </Modal>
                                            </div>
                                        </div>
                                    }
                                >
                                    <div className='flex gap-3 cursor-pointer'
                                        onClick={() => setOpen(open === false ? true : false)}>
                                        {username || loggedUser?.username}
                                        <DownOutlined />
                                    </div>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 w-full" style={{ height: '93vh' }}>
                        <Routes>
                            <Route path="/home" element={<Home />} />
                            <Route path="/leaves" element={<Leaves />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/adminDashboard" element={<AdminDashboard />} />
                            <Route path="/request" element={<Request />} />
                            <Route path='/attendance' element={<Attendance />} />
                            <Route path='/employees' element={<Employees />} />
                        </Routes>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default Dashboard;