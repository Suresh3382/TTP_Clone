import { IleaveRequest } from "../Component/Dashboard/DashboardComponents/Leaves/Leaves";
import { leaveStatusEnum } from "../Component/Dashboard/DashboardComponents/Leaves/LeavesType/LTEnum/LeavesTypeEnum";
import { EprofilePageEnum } from "../Component/Dashboard/DashboardComponents/Profile/ProfileEnum/ProfileEnum";
import { ESelected, IReports } from "../Component/Dashboard/DashboardComponents/EmployeeComponents/Reports";
import { EPageName } from "../Component/Details/DetailsEnum/detailsEnum";
import { IbordingProcess } from "../Interfaces/BordingInterface";
import { IFullDetails, IcurrentUserDetails } from "../Interfaces/FulldetailsInterface";

export interface IContext {
    bordingProcess: IbordingProcess;
    setBordingProcess: (process: any) => void;
    activePage: EPageName;
    setActivePage: (page: EPageName) => void;
    data: IFullDetails;
    setData: (data: IFullDetails) => void;
    agree: boolean;
    setAgree: (agree: boolean) => void
    currentUserFullDetails: IFullDetails;
    setCurrentUserFullDetails: (currentUserFullDetails: IFullDetails) => void;
    profileEnum: EprofilePageEnum;
    setProfileEnum: (profileEnum: EprofilePageEnum) => void;
    isDisable: boolean;
    setIsDisable: (isDisable: boolean) => void;
    refresh: boolean;
    setRefresh: (refresh: boolean) => void;
    Image: string;
    setImage: (Image: string) => void;
    leaveRequest: IleaveRequest[];
    setLeaveRequest: (leaveRequest: IleaveRequest[]) => void;
    ERequstName: leaveStatusEnum;
    setERequestName: (ERequstName: leaveStatusEnum) => void;
    isModalOpen: boolean,
    setIsModalOpen: (isModelOpen: boolean) => void;
    isAttendanceFormModalOpen: boolean,
    setIsAttendanceFormModalOpen: (isAttendanceFormModalOpen: boolean) => void;
    currentLeaveRequest: IleaveRequest;
    setCurrentLeaveRequest: (currentLeaveRequest: IleaveRequest) => void;
    loggedUser: IcurrentUserDetails,
    setLoggedUser: (loggedUser: IcurrentUserDetails) => void,
    loading: boolean,
    currentMonthReports: IReports | undefined,
    setCurrentMonthReports: (currentMonthReports: IReports) => void,
    selected: ESelected,
    setSelected: (selected: ESelected) => void
}