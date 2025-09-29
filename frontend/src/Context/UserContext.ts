import { createContext } from "react";
import { IcurrentUserDetails, IFullDetails } from "../Interfaces/FulldetailsInterface";
import { EPageName } from "../Component/Details/DetailsEnum/detailsEnum";
import { IbordingProcess } from "../Interfaces/BordingInterface";
import { EprofilePageEnum } from "../Component/Dashboard/DashboardComponents/Profile/ProfileEnum/ProfileEnum";
import { IleaveRequest } from "../Component/Dashboard/DashboardComponents/Leaves/Leaves";
import { leaveStatusEnum } from "../Component/Dashboard/DashboardComponents/Leaves/LeavesType/LTEnum/LeavesTypeEnum";
import { IContext } from "./UserContextInterface";
import { bool, boolean } from "yup";
import { ESelected } from "../Component/Dashboard/DashboardComponents/EmployeeComponents/Reports";

const UserContext = createContext<IContext>({
    bordingProcess: {} as IbordingProcess,
    setBordingProcess: () => { },
    activePage: EPageName.empDetails,
    setActivePage: () => { },
    data: {} as IFullDetails,
    setData: () => { },
    agree: false,
    setAgree: () => { },
    currentUserFullDetails: {} as IFullDetails,
    setCurrentUserFullDetails: () => { },
    profileEnum: EprofilePageEnum.personalInformationProfile,
    setProfileEnum: () => { },
    isDisable: false,
    setIsDisable: () => { },
    refresh: false,
    setRefresh: () => { },
    Image: "",
    setImage: () => { },
    leaveRequest: [],
    setLeaveRequest: () => { },
    ERequstName: leaveStatusEnum.All,
    setERequestName: () => { },
    isModalOpen: false,
    setIsModalOpen: () => { },
    isAttendanceFormModalOpen: false,
    setIsAttendanceFormModalOpen: () => { },
    currentLeaveRequest: {} as IleaveRequest,
    setCurrentLeaveRequest: () => { },
    loggedUser: {} as IcurrentUserDetails,
    setLoggedUser: () => { },
    loading: false,
    currentMonthReports: undefined,
    setCurrentMonthReports: () => { },
    selected: ESelected.Table,
    setSelected: () => { }
});


export default UserContext;