import React, { useEffect, useState } from 'react'
import { EPageName } from '../Component/Details/DetailsEnum/detailsEnum';
import { IcurrentUserDetails, IFullDetails } from '../Interfaces/FulldetailsInterface';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../Component/Details/Layout/Layout';
import Login from '../Component/LoginSignUp/Content/Login';
import Signup from '../Component/LoginSignUp/Content/Signup';
import UserContext from '../Context/UserContext';
import { currentUserDetilsInitialValue, initialIFullDetailsValues } from './InitialValues';
import { IbordingProcess } from '../Interfaces/BordingInterface';
import Dashboard from '../Component/Dashboard/Dashboard';
import { EprofilePageEnum } from '../Component/Dashboard/DashboardComponents/Profile/ProfileEnum/ProfileEnum';
import Leaves, { IleaveRequest } from '../Component/Dashboard/DashboardComponents/Leaves/Leaves';
import { leaveStatusEnum } from '../Component/Dashboard/DashboardComponents/Leaves/LeavesType/LTEnum/LeavesTypeEnum';
import ProtectedRoute from './ProtectedRoutes';
import { Home } from 'lucide-react';
import AdminDashboard from '../Component/Dashboard/DashboardComponents/AdminDashboardComponents/AdminDashboard';
import Profile from '../Component/Dashboard/DashboardComponents/Profile/Profile';
import RequestPage from '../Component/Dashboard/DashboardComponents/AdminDashboardComponents/Request';
import Reports, { ESelected, IReports } from '../Component/Dashboard/DashboardComponents/EmployeeComponents/Reports';

import { baseURL } from '../baseURL';
import { Spin } from 'antd';
import Attendance from '../Component/Dashboard/DashboardComponents/AdminDashboardComponents/Attendance/Attendance';
import Test from './Test';
import { useCallApi } from '../Utlits/AxiosConifg';
import { useSelector } from 'react-redux';
import { RootState } from '../Component/Redux/Store';

export const defaultLeaveRequestValues = {
  _id: '',
  leaveType: undefined,
  from: null,
  to: null,
  dayType: 0,
  isFirstHalf: false,
  isSecondHalf: false,
  reason: '',
  document: {
    name: '',
    document: ''
  },
  status: 0
}

const AppRoutes = () => {
  const { callApi } = useCallApi();
  const [data, setData] = useState<IFullDetails>(initialIFullDetailsValues);
  const [agree, setAgree] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<EPageName>(EPageName.empDetails);
  const [currentUserFullDetails, setCurrentUserFullDetails] = useState<IFullDetails>(initialIFullDetailsValues);
  const [profileEnum, setProfileEnum] = useState<EprofilePageEnum>(EprofilePageEnum.personalInformationProfile);
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(true);
  const [Image, setImage] = useState<string>('');
  const [leaveRequest, setLeaveRequest] = useState<IleaveRequest[]>([]);
  const [ERequstName, setERequestName] = useState<leaveStatusEnum>(leaveStatusEnum.All);
  const [currentLeaveRequest, setCurrentLeaveRequest] = useState<IleaveRequest>(defaultLeaveRequestValues);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loggedUser, setLoggedUser] = useState<IcurrentUserDetails>({ _id: '', username: '', email: '', password: '', role: "USER", pfp: "" });
  const [loading, setLoading] = useState<boolean>(false); //free to use
  const [selected, setSelected] = useState<ESelected>(ESelected.Table);
  const [currentMonthReports, setCurrentMonthReports] = useState<IReports | undefined>();
  const [isAttendanceFormModalOpen, setIsAttendanceFormModalOpen] = useState(false);
  const AccessToken = useSelector((state: RootState) => state.authLogin.accessToken);
  // const setGlobalState =(values : any, key : string)=> {
  //       setData({...data, [key] : values})
  // }

  const [bordingProcess, setBordingProcess] = useState<IbordingProcess>({
    basicEmployeeDetail: {
      isActive: true,
      hasAccess: true,
      isSubmited: false
    },
    EmployeesKyc: {
      isActive: false,
      hasAccess: false,
      isSubmited: false
    },
    CabRequest: {
      isActive: false,
      hasAccess: false,
      isSubmited: false
    }
  })

  useEffect(() => {
    setLoading(true);
    callApi({ requestEndpoint: `${baseURL}user/getUser`, method: "get" }).then((res) => {
      setLoggedUser(res.data.existingUser)
      setLoading(false);
    }).catch((err) => { console.log(err, "Error getting user") })
  }, [AccessToken])

  return (
    <div>
      <UserContext.Provider value={{ loggedUser, setLoggedUser, selected, isAttendanceFormModalOpen, setIsAttendanceFormModalOpen, setSelected, currentMonthReports, setCurrentMonthReports, bordingProcess, profileEnum, leaveRequest, loading, currentLeaveRequest, setCurrentLeaveRequest, isModalOpen, setIsModalOpen, setLeaveRequest, ERequstName, setERequestName, setProfileEnum, setImage, Image, setBordingProcess, activePage, currentUserFullDetails, setCurrentUserFullDetails, setActivePage, data, setData, agree, setAgree, setIsDisable, isDisable, refresh, setRefresh }}>
        {/* <Route path='/' element={<Dashboard />} /> */}
        {/* <Route path='/' element={authorized ? onbordingComplete ? role === 'ADMIN' ? <ADMINDashboard /> : <USERDashboard /> : <Onboarding /> : <Login />} /> */}
        {/* <Route path="/onboarding" element={<Layout />} /> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/example' element={<Test />} />
          <><Route
            path="/"
            element={<ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>}
          >
            <Route path="/home" element={<Home />} />
            <Route path="/leaves" element={<Leaves />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="request" element={<RequestPage />} />
            <Route path='/attendance' element={<Attendance />} />
          </Route><Route
              path="/onboarding"
              element={<ProtectedRoute>
                <Layout />
              </ProtectedRoute>} /></>
        </Routes>

      </UserContext.Provider>
    </div>
  )
}

export default AppRoutes

