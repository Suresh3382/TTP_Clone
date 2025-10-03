import { Avatar, Button, DatePicker, Input, Modal, Popover, Skeleton, Table } from 'antd'
import { AlignJustify, ArrowDownLeft, ArrowUpRight, CalendarClock, ChevronDown, ChevronLeft, ChevronRight, Circle, CircleAlert, CircleCheck, CircleX, Clock, ClockFading, Filter, Info, LayoutGrid, Mail, RotateCw, Search, TentTree } from 'lucide-react'
import { useCallApi } from '../../../../../Utlits/AxiosConifg'
import { baseURL } from '../../../../../baseURL'
import { useContext, useEffect, useState } from 'react'
import { IcurrentUserDetails } from '../../../../../Interfaces/FulldetailsInterface'
import dayjs, { Dayjs } from 'dayjs'
import { EReportsStatus, ESelected, IReports } from '../../EmployeeComponents/Reports'
import UserContext from '../../../../../Context/UserContext'
import AttendanceForm from './AttendanceForm'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, setcurrentReportDate, setSelectedUser } from '../../../../Redux/Store'
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const convertDecimalToTimeDirect = (decimalHours: number): string => {
    const minutes = decimalHours * 60;
    const durationObj = dayjs.duration(minutes, 'minutes');
    return durationObj.format('HH:mm:ss');
};


export const convertDecimalToTimeDirectForMonth = (decimalHours: number): string => {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const Attendance = () => {
    const { callApi } = useCallApi();
    const [users, setUsers] = useState<IcurrentUserDetails[]>([]);
    const [refresh, setRefresh] = useState<boolean>();
    const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
    const { setCurrentMonthReports, isAttendanceFormModalOpen, currentMonthReports, setSelected, selected, setIsAttendanceFormModalOpen } = useContext(UserContext);
    const SelectedUser = useSelector((state: RootState) => state.localStates.selectedUser);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userListLoading, setUserListLoading] = useState<boolean>(false);
    const [nameFilterLeaves, setNameFilterLeaves] = useState<string>();
    const dispatch = useDispatch();

    const getAllUser = () => {
        setIsLoading(true);
        callApi({
            requestEndpoint: `${baseURL}user/getAllUsers`,
            method: "get",
        }).then((res) => {
            setUsers(res.data.response);
            dispatch(setSelectedUser(res.data.response[0]));
            setIsLoading(false);
        });
    };

    const handleNameValues = (w: any) => {
        if (w.key === "Enter") {
            // setUserListLoading(true);
            setNameFilterLeaves(w.target.value);
        }
    }

    const columns = [
        {
            title: 'DATE',
            dataIndex: 'date',
            key: 'date',
            width: 180,
            render: (dateStr: string) =>
                isLoading ? (
                    <Skeleton.Input style={{ width: 140, height: 20 }} active size="small" />
                ) : (
                    (() => {
                        const today = dayjs();
                        const parsedDate = dayjs(dateStr);
                        if (!parsedDate.isValid()) return 'Invalid Date';
                        if (parsedDate.isSame(today, 'day')) {
                            return <span className="text-blue-600">Today</span>;
                        }
                        return parsedDate.format('ddd, MMM DD, YYYY');
                    })()
                ),
        },
        {
            title: 'CHECK IN',
            dataIndex: 'checkIn',
            key: 'checkIn',
            width: 130,
            render: (_: any, record: any) =>
                isLoading ? (
                    <Skeleton.Input style={{ width: 30, height: 20 }} active size="small" />
                ) : (
                    (() => {
                        const checkInTime = record.dayTrans ? record.dayTrans[0] : null;
                        if (checkInTime) {
                            return (
                                <Popover
                                    className="custom-popover"
                                    trigger={'click'}
                                    content={
                                        <div className="font-[Outfit] p-1 space-y-1 w-80">
                                            <span className="flex gap-2 text-base font-[500] px-2 justify-between">
                                                {dayjs(record.date).format('MMM DD, YYYY')}
                                                <span className="flex items-center text-xs font-medium gap-1">
                                                    <Circle
                                                        size={10}
                                                        className={
                                                            record.onTime === true ? 'text-green-600' : 'text-red-600'
                                                        }
                                                    />
                                                    {record.onTime === true ? 'On Time' : 'Not On Time'}
                                                </span>
                                            </span>
                                            {record.dayTrans.map((dayTrans: string, index: number) => {
                                                return (
                                                    <div className="space-y-1" key={index}>
                                                        <div className="px-2 flex items-center gap-2">
                                                            {index % 2 === 0 ? (
                                                                <>
                                                                    <ArrowDownLeft
                                                                        strokeWidth={3}
                                                                        size={14}
                                                                        className="text-green-600 border-2 border-green-600 rounded hover:bg-green-100 cursor-pointer"
                                                                    />
                                                                    <span>{dayTrans ? dayjs(dayTrans).format('hh:mm:ss A') : 'No Check-out'}</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ArrowUpRight
                                                                        strokeWidth={3}
                                                                        size={14}
                                                                        className="text-red-600 border-2 border-red-600 rounded hover:bg-red-100 cursor-pointer"
                                                                    />
                                                                    <span>{dayTrans ? dayjs(dayTrans).format('hh:mm:ss A') : 'No Check-out'}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div className="space-y-1 bg-gray-100 rounded p-2">
                                                <p className="text-xs flex justify-between">
                                                    <span>Total Working: </span>
                                                    <span>{convertDecimalToTimeDirect(record.workingHours)}</span>
                                                </p>
                                                <p className="text-xs flex justify-between">
                                                    <span>Extra Hour: </span>
                                                    <span>{convertDecimalToTimeDirect(record.extraHours)}</span>
                                                </p>
                                            </div>
                                        </div>
                                    }
                                >
                                    <span className="flex gap-2 items-center cursor-pointer">
                                        <ArrowDownLeft
                                            strokeWidth={3}
                                            size={16}
                                            className="text-green-600 border-2 border-green-600 rounded"
                                        />
                                        {checkInTime ? dayjs(checkInTime).format('hh:mm A') : ''}
                                    </span>
                                </Popover>
                            );
                        }
                    })()
                ),
        },
        {
            title: 'CHECK OUT',
            dataIndex: 'checkOut',
            key: 'checkOut',
            width: 130,
            render: (_: any, record: any) =>
                isLoading ? (
                    <Skeleton.Input style={{ width: 0, height: 20 }} active size="small" />
                ) : (
                    (() => {
                        const arrLength = record.dayTrans?.length || 0;
                        const isDayTransEven = arrLength % 2 === 0;
                        const checkOutTime =
                            arrLength > 0 && isDayTransEven ? record.dayTrans[arrLength - 1] : null;
                        if (checkOutTime) {
                            return (
                                <Popover
                                    className="custom-popover"
                                    trigger="click"
                                    content={
                                        <div className="font-[Outfit] p-1 space-y-1 w-80">
                                            <span className="flex gap-2 text-base font-[500] px-2 justify-between">
                                                {dayjs(record.date).format('MMM DD, YYYY')}
                                                <span className="flex items-center text-xs font-medium gap-1">
                                                    <Circle
                                                        size={10}
                                                        className={
                                                            record.onTime === true ? 'text-green-600' : 'text-red-600'
                                                        }
                                                    />
                                                    {record.onTime === true ? 'On Time' : 'Not On Time'}
                                                </span>
                                            </span>
                                            {record.dayTrans?.map((dayTrans: string, index: number) => {
                                                const isCheckIn = index % 2 === 0;
                                                return (
                                                    <div key={index} className="space-y-1">
                                                        <div className="px-2 flex items-center gap-2">
                                                            {isCheckIn ? (
                                                                <>
                                                                    <ArrowDownLeft
                                                                        strokeWidth={3}
                                                                        size={14}
                                                                        className="text-green-600 border-2 border-green-600 rounded hover:bg-green-100 cursor-pointer"
                                                                    />
                                                                    <span>
                                                                        {dayTrans ? dayjs(dayTrans).format('hh:mm:ss A') : 'No Check-out'}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ArrowUpRight
                                                                        strokeWidth={3}
                                                                        size={14}
                                                                        className="text-red-600 border-2 border-red-600 rounded hover:bg-red-100 cursor-pointer"
                                                                    />
                                                                    <span>
                                                                        {dayTrans ? dayjs(dayTrans).format('hh:mm:ss A') : 'No Check-out'}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div className="space-y-1 bg-gray-100 rounded p-2">
                                                <p className="text-xs flex justify-between">
                                                    <span>Total Working: </span>
                                                    <span>{convertDecimalToTimeDirect(record.workingHours)}</span>
                                                </p>
                                                <p className="text-xs flex justify-between">
                                                    <span>Extra Hour: </span>
                                                    <span>{convertDecimalToTimeDirect(record.extraHours)}</span>
                                                </p>
                                            </div>
                                        </div>
                                    }
                                >
                                    <span className="flex gap-2 items-center cursor-pointer">
                                        <ArrowUpRight
                                            strokeWidth={3}
                                            size={16}
                                            className="text-red-600 border-2 border-red-600 rounded"
                                        />
                                        {checkOutTime ? dayjs(checkOutTime).format('hh:mm A') : 'No Check-out'}
                                    </span>
                                </Popover>
                            );
                        }
                    })()
                ),
        },
        {
            title: 'REQUIRED HOURS',
            dataIndex: 'requiredHours',
            key: 'requiredHours',
            width: 140,
            render: (requiredHours: number) =>
                isLoading ? (
                    <Skeleton.Input style={{ width: 20, height: 20 }} active size="small" />
                ) : (
                    requiredHours !== undefined && requiredHours !== 0 && <span>{convertDecimalToTimeDirect(requiredHours)}</span>
                ),
        },
        {
            title: 'WORKING HOURS',
            dataIndex: 'workingHours',
            key: 'workingHours',
            width: 140,
            render: (workingHours: number) =>
                isLoading ? (
                    <Skeleton.Input style={{ width: 20, height: 20 }} active size="small" />
                ) : (
                    workingHours !== undefined && workingHours !== 0 && <span>{convertDecimalToTimeDirect(workingHours)}</span>
                ),
        },
        {
            title: 'EXTRA HOURS',
            dataIndex: 'extraHours',
            key: 'extraHours',
            width: 120,
            render: (extraHours: number) =>
                isLoading ? (
                    <Skeleton.Button style={{ height: 20, width: 100 }} active />
                ) : (
                    extraHours !== undefined && extraHours !== 0 && <span>{convertDecimalToTimeDirect(extraHours)}</span>
                ),
        },
        {
            title: 'SHORT HOURS',
            dataIndex: 'shortHours',
            key: 'shortHours',
            width: 120,
            render: (shortHours: number) =>
                isLoading ? (
                    <Skeleton.Button style={{ height: 20, width: 100 }} active />
                ) : (
                    shortHours !== undefined && shortHours !== 0 && <span>{convertDecimalToTimeDirect(shortHours)}</span>
                ),
        },
        {
            title: 'ON TIME/NOT ON TIME',
            dataIndex: 'onTime',
            key: 'onTime',
            width: 180,
            render: (onTime: boolean, record: any) =>
                isLoading ? (
                    <Skeleton.Button style={{ height: 20, width: 150 }} active />
                ) : (
                    record.dayTrans.length !== 0 && (
                        onTime === true ? (
                            <span className="flex items-center gap-1">
                                <Circle className="text-green-600" size={14} />
                                On Time
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">
                                <Circle className="text-red-600" size={14} />
                                Not On Time
                            </span>
                        )
                    )
                ),
        },
        {
            title: '',
            dataIndex: 'status',
            key: 'status',
            width: 130,
            render: (status: EReportsStatus, record: any, dayRecords: any) =>
                isLoading ? (
                    <Skeleton.Button style={{ width: 60, height: 20 }} active size="small" />
                ) : (
                    (() => {
                        const today = dayjs();
                        const recordDate = dayjs(record.date);
                        const isAfterToday = recordDate.isAfter(today);
                        switch (status) {
                            case EReportsStatus.Present:
                                return (
                                    <button
                                        onClick={() => {
                                            const recordDate = dayjs(record.date);
                                            const finalValues = {
                                                date: recordDate,
                                                status: record.status,
                                            };
                                            setIsAttendanceFormModalOpen(true);
                                            dispatch(setcurrentReportDate(finalValues));
                                        }}
                                        className="flex gap-2 w-16 cursor-pointer justify-center py-1 bg-green-100 text-green-600 rounded-sm items-center text-xs"
                                    >
                                        Present
                                    </button>
                                );
                            case EReportsStatus.Absent:
                                return (
                                    <button
                                        onClick={() => {
                                            const recordDate = dayjs(record.date);
                                            const finalValues = {
                                                date: recordDate,
                                                status: record.status,
                                            };
                                            setIsAttendanceFormModalOpen(true);
                                            dispatch(setcurrentReportDate(finalValues));
                                        }}
                                        disabled={isAfterToday}
                                        style={{ cursor: isAfterToday ? 'not-allowed' : '', fontSize: '12px' }}
                                        className="flex gap-2 w-16 cursor-pointer justify-center py-1 bg-red-100 text-red-600 rounded-sm items-center"
                                    >
                                        Absent
                                    </button>
                                );
                            case EReportsStatus.FullLeave:
                                return (
                                    <button
                                        onClick={() => {
                                            const recordDate = dayjs(record.date);
                                            const finalValues = {
                                                date: recordDate,
                                                status: record.status,
                                            };
                                            setIsAttendanceFormModalOpen(true);
                                            dispatch(setcurrentReportDate(finalValues));
                                        }}
                                        disabled={isAfterToday}
                                        style={{ cursor: isAfterToday ? 'not-allowed' : '' }}
                                        className="flex gap-2 w-20 cursor-pointer justify-center py-1 bg-purple-100 text-purple-600 rounded-sm items-center text-xs"
                                    >
                                        Full Leave
                                    </button>
                                );
                            case EReportsStatus.HalfLeave:
                                return (
                                    <button
                                        onClick={() => {
                                            const recordDate = dayjs(record.date);
                                            const finalValues = {
                                                date: recordDate,
                                                status: record.status,
                                            };
                                            setIsAttendanceFormModalOpen(true);
                                            dispatch(setcurrentReportDate(finalValues));
                                        }}
                                        disabled
                                        style={{ cursor: 'not-allowed' }}
                                        className="flex gap-2 w-20 cursor-pointer justify-center py-1 bg-orange-100 text-orange-600 rounded-sm items-center text-xs"
                                    >
                                        Half Leave
                                    </button>
                                );
                            case EReportsStatus.WeekOff:
                                return (
                                    <button
                                        disabled
                                        style={{ cursor: 'not-allowed' }}
                                        className="flex gap-2 w-24 cursor-pointer justify-center py-1 bg-gray-100 text-gray-600 rounded-sm items-center text-xs"
                                    >
                                        Weekend Off
                                    </button>
                                );
                            default:
                                return 'Unknown';
                        }
                    })()
                ),
        },
    ];


    const dataSource = currentMonthReports
        ? currentMonthReports.attendances.map((attendance) => ({
            date: attendance.date,
            status: attendance.status,
            dayTrans: attendance.dayTrans,
            requiredHours: attendance.requiredHours,
            workingHours: attendance.workingHours,
            extraHours: attendance.extraHours,
            shortHours: attendance.shortHours,
            onTime: attendance.onTime
        }))
        : [];


    const getReports = (e: Dayjs) => {
        const date = e.toDate();
        const month = (date.getMonth() + 1)
        const year = date.getFullYear();
        callApi({
            requestEndpoint: `${baseURL}user/getReports`,
            method: 'post',
            body: {
                currentMonth: month,
                currentYear: year,
                id: SelectedUser?._id
            }
        }).then((res) => {
            setCurrentMonthReports(res?.data?.data);
            console.log(res);
        });
    };

    useEffect(() => {
        getAllUser();
    }, []);

    useEffect(() => {
        if (SelectedUser && selectedMonth) {
            getReports(selectedMonth);
        }
    }, [SelectedUser, isAttendanceFormModalOpen, refresh]);

    return (
        <div className='w-full h-full relative flex gap-2 border-t'>
            <div className="w-1/5 h-[91.5vh] border-r pr-2.5 overflow-y-auto clean-scrollbar">
                <div className="sticky top-0 bg-white z-10 py-2.5 flex gap-2 justify-center items-center">
                    <Input suffix={<Search size={16} />} placeholder='Search Employee...' onKeyDown={handleNameValues} onChange={(e: any) => { e.target.value === "" && setNameFilterLeaves('') }} />
                    <span className='bg-blue-200 rounded p-2'>
                        <Filter size={16} className='text-blue-500' />
                    </span>
                </div>
                {userListLoading ? <Skeleton active title={false} paragraph={{ rows: 18, width: '100%' }} className="custom-skeleton" /> :
                    <div className='px-0.5 flex flex-col gap-1.5'>
                        {users.map((user: any) => (
                            <div
                                key={user._id}
                                className={`flex items-center gap-3 py-1 ps-2 rounded cursor-pointer transition
                             ${SelectedUser?._id === user?._id ? 'border-l-4 border-blue-500 text-blue-500' : 'border-l-4 border-white hover:bg-gray-100'} `}
                                style={SelectedUser?._id === user?._id ? {
                                    background: 'linear-gradient(90deg, rgb(231, 241, 255) 0%, rgb(255, 255, 255) 100%)'
                                } : {}}
                                onClick={() => { dispatch(setSelectedUser(user)) }}
                            >
                                <div className="rounded-full w-8 h-8 bg-gray-100 flex justify-center items-center">
                                    {user?.pfp ? (
                                        <img src={user?.pfp} className="rounded-full w-8 h-8" alt="User Avatar" />
                                    ) : (
                                        <div className="flex justify-center items-center text-blue-600 font-semibold text-xs">
                                            <span>{user?.firstName?.charAt(0)?.toUpperCase() || '?'}</span>
                                            <span>{user?.lastName?.charAt(0)?.toUpperCase() || '?'}</span>
                                        </div>
                                    )}
                                </div>
                                <span className='text-sm'>{user.firstName} {user.lastName}</span>
                            </div>

                        ))}
                    </div>
                }
            </div>

            <div className='w-4/5'>
                <div className='w-full px-1.5'>
                    <div className='flex items-center justify-between py-2'>
                        <div className='w-[49%] flex justify-between items-center'>
                            <span>Attendance</span>
                            <span className='flex items-center text-sm gap-2'><span className=' border-l-[3px] border-blue-700 ps-2 text-xs text-gray-400'>
                                Shift Timing :
                            </span>
                                10:00 AM - 08:00 PM <Info size={15} className='text-gray-400' />
                            </span>
                        </div>
                        <div className='w-[49%] flex justify-between items-center'>
                            <div className='flex items-center'>
                                <ChevronLeft size={28} onClick={() => { setSelectedMonth(selectedMonth.add(-1, 'M')), getReports(selectedMonth.add(-1, 'M')) }} className='bg-gray-200 rounded-sm text-gray-600' />
                                <DatePicker
                                    allowClear={false}
                                    value={selectedMonth}
                                    onChange={(e) => {
                                        if (e) {
                                            setSelectedMonth(e);
                                            getReports(e);
                                        }
                                    }}
                                    picker="month" format={'MMMM YYYY'} className='my-first-datepicker mx-2 flex justify-center border-0 font-[Outfit]' suffixIcon={<ChevronDown className='text-black' size={22} />} />
                                <ChevronRight size={28} onClick={() => { setSelectedMonth(selectedMonth.add(1, 'M')), getReports(selectedMonth.add(1, 'M')) }} className='bg-gray-200 rounded-sm text-gray-600' />
                            </div>
                            <div className='flex gap-1'>
                                <RotateCw size={32} className='cursor-pointer p-1.5 rounded bg-blue-100 text-blue-500' onClick={() => { setRefresh(prevRefresh => !prevRefresh) }} />
                                <LayoutGrid size={32} onClick={() => setSelected(ESelected.Layout)} className={selected === ESelected.Layout ? 'cursor-pointer p-1 text-blue-500' : 'cursor-pointer p-1 text-gray-500'} />
                                <AlignJustify size={32} onClick={() => setSelected(ESelected.Table)} className={selected === ESelected.Table ? 'cursor-pointer p-1 text-blue-500' : 'cursor-pointer p-1 text-gray-500'} />
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-3 p-2 rounded-md bg-gray-200'>
                        {isLoading ?
                            <div className="w-1/3 flex gap-3 items-center">
                                <div className="w-1/3 flex gap-2 items-center">
                                    <Skeleton.Avatar active size={96} shape="circle" />
                                    <div className="flex flex-col gap-1 w-3/4">
                                        <Skeleton.Input active className="w-1/2" style={{ height: '18px' }} />
                                        <div className="flex gap-2">
                                            <Skeleton.Input active size='large' style={{ height: '18px' }} />
                                            <Skeleton.Button active style={{ height: '18px', width: "20px" }} />
                                        </div>
                                        <Skeleton.Input active className="w-2/3" style={{ height: '18px' }} />
                                    </div>
                                </div>
                            </div>
                            :
                            <div className='w-1/3 flex gap-3 items-center'>
                                <div className="rounded-full w-24 h-24 bg-gray-400 flex justify-center items-center">
                                    {SelectedUser?.pfp ? (
                                        <img src={SelectedUser.pfp} alt="Profile" className="rounded-full w-24 h-24" />
                                    ) : (
                                        <div className="flex justify-center items-center text-white text-4xl">
                                            <span>{SelectedUser?.firstName?.charAt(0)?.toUpperCase() || '?'}</span>
                                            <span>{SelectedUser?.lastName?.charAt(0)?.toUpperCase() || '?'}</span>
                                        </div>
                                    )}
                                </div>

                                <div className='flex flex-col' >
                                    <span className='text-lg'>{SelectedUser?.firstName} {SelectedUser?.lastName}</span>
                                    <div className='space-x-2 mb-1.5'>
                                        <span className='rounded-md text-xs bg-white px-2 py-1'>Assistant System Engineer - L2
                                        </span>
                                        <span className='rounded-md bg-green-50 text-xs text-blue-700 px-2 py-1'>TTP003</span>
                                    </div>
                                    <span className='flex gap-2 items-center text-xs'><Mail size={16} className='text-gray-400' /> {SelectedUser?.email}</span>
                                </div>
                            </div>
                        }
                        <div className='w-2/3 overflow-x-auto clean-scrollbar'>
                            <div className='w-max flex justify-center rounded-lg gap-2'>
                                <div className='bg-white flex flex-col gap-1 w-40 text-center py-3 rounded-lg'>
                                    {isLoading ?
                                        <Skeleton.Button size='small' className='py-[5.5px]' style={{ height: '20px' }} /> :
                                        <p className='text-2xl'>{currentMonthReports ? currentMonthReports?.dayRecords?.totalMonthPresence : '0'}</p>
                                    }
                                    <p className='flex bg-green-50 text-xs rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'><Circle className='text-green-500' size={12} />Presence</p>
                                </div>
                                <div className='bg-white flex flex-col gap-1 w-40 text-center py-3 rounded-lg'>
                                    {isLoading ?
                                        <Skeleton.Button size='small' className='py-[5.5px]' style={{ height: '20px' }} /> :
                                        <p className='text-2xl'>{currentMonthReports ? currentMonthReports?.dayRecords?.totalMonthAbsent : '0'}</p>
                                    }
                                    <p className='flex bg-red-50 text-xs rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'><Circle className='text-red-500' size={12} />Absent</p>
                                </div>
                                <div className='bg-white flex flex-col gap-1 w-40 text-center py-3 rounded-lg'>
                                    {isLoading ?
                                        <Skeleton.Button size='small' className='py-[5.5px]' style={{ height: '20px' }} /> :
                                        <p className='text-2xl'>{currentMonthReports ? currentMonthReports?.dayRecords?.totalMonthLeaveToken : '0'}</p>
                                    }
                                    <p className='flex bg-purple-50 text-xs rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'><Circle className='text-purple-500' size={12} />Leave Token</p>
                                </div>
                                <div className='bg-white flex flex-col gap-1 w-40 text-center py-3 rounded-lg'>
                                    {isLoading ?
                                        <Skeleton.Button size='small' className='py-[5.5px]' style={{ height: '20px' }} /> :
                                        <p className='text-2xl'>{currentMonthReports ? currentMonthReports?.dayRecords?.totalMonthOnTime : '0'}</p>
                                    }
                                    <p className='flex bg-green-50 text-xs rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'><Circle className='text-green-500' size={12} />On Time</p>
                                </div>
                                <div className='bg-white flex flex-col gap-1 w-40 text-center py-3 rounded-lg'>
                                    {isLoading ?
                                        <Skeleton.Button size='small' className='py-[5.5px]' style={{ height: '20px' }} /> :
                                        <p className='text-2xl'>{currentMonthReports ? currentMonthReports?.dayRecords?.totalMonthNotOnTime : '0'}</p>
                                    }
                                    <p className='flex bg-red-50 text-xs rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'><Circle className='text-red-500' size={12} />Not On Time</p>
                                </div>
                                <div className='bg-white flex flex-col gap-1 w-40 text-center py-3 rounded-lg'>
                                    {isLoading ?
                                        <Skeleton.Button size='small' className='py-[5.5px]' style={{ height: '20px' }} /> :
                                        <p className='text-2xl'>{currentMonthReports ? convertDecimalToTimeDirectForMonth(currentMonthReports?.dayRecords?.totalMonthWokringHours) : '00:00'}</p>
                                    }
                                    <p className='flex bg-blue-50 text-xs rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'><Circle className='text-blue-500' size={12} />Working Hours</p>
                                </div>
                                <div className='bg-white flex flex-col gap-1 w-40 text-center py-3 rounded-lg'>
                                    {isLoading ?
                                        <Skeleton.Button size='small' className='py-[5.5px]' style={{ height: '20px' }} /> :
                                        <p className='text-2xl'>{currentMonthReports ? convertDecimalToTimeDirectForMonth(currentMonthReports?.dayRecords?.totalMonthShortHours) : '00:00'}</p>
                                    }
                                    <p className='flex bg-red-50 text-xs rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'><Circle className='text-red-500' size={12} />Short Hours</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-2'>
                        <Table rowClassName={(record) => {
                            const today = dayjs();
                            const parsedDate = dayjs(record.date, 'DD-MM-YYYY');
                            return parsedDate.isSame(today, 'day') ? 'today-row' : '';
                        }} className='my-table-styling2' scroll={{ y: 60 * 10, x: '100%', }} dataSource={dataSource || []} columns={columns} rowKey="_id" pagination={false} />
                    </div>
                    <div className='flex gap-5 absolute bottom-0 rounded pb-1.5 px-2 bg-white w-[74vw]'>
                        <p className='flex gap-2 items-center text-sm'><TentTree size={16} color='blue' />Holiday</p>
                        <p className='flex gap-2 items-center text-sm'><CircleCheck size={16} color='green' />Present</p>
                        <p className='flex gap-2 items-center text-sm'><CircleCheck size={16} color='yellow' />Half Day</p>
                        <p className='flex gap-2 items-center text-sm'><CircleAlert size={16} color='orange' />Missing Time</p>
                        <p className='flex gap-2 items-center text-sm'><CalendarClock size={16} color='purple' />Full Leave</p>
                        <p className='flex gap-2 items-center text-sm'><CircleCheck size={16} color='orange' />Half Leave</p>
                        <p className='flex gap-2 items-center text-sm'><CircleCheck size={16} color='purple' />WFH</p>
                        <p className='flex gap-2 items-center text-sm'><CircleX size={16} color='red' />Absent</p>
                    </div>
                    <Modal
                        title={
                            <div className='flex gap-2 font-medium'>
                                <span>Attendance</span>
                                <span className='text-blue-600 font-normal'>{SelectedUser?.firstName} {SelectedUser?.lastName}</span>
                                <span className='rounded-md bg-green-100 text-xs text-blue-700 px-4 py-1'>TTP003</span>
                            </div>
                        }
                        closable={{ 'aria-label': 'Custom Close Button' }}
                        style={{ fontFamily: 'Outfit' }}
                        open={isAttendanceFormModalOpen}
                        onCancel={() => setIsAttendanceFormModalOpen(false)}
                        footer={null}
                        destroyOnHidden
                    >
                        <AttendanceForm />
                    </Modal>

                </div>
            </div>
        </div>
    )
}

export default Attendance
