import React, { useEffect, useState } from 'react'
import { DatePicker, Popover, Skeleton, Table } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { AlignJustify, ArrowDownLeft, ArrowUpRight, CalendarClock, ChevronDown, ChevronLeft, ChevronRight, Circle, CircleAlert, CircleCheck, CircleX, LayoutGrid, RotateCw, TentTree } from 'lucide-react'
import { useCallApi } from '../../../../Utlits/AxiosConifg'
import { baseURL } from '../../../../baseURL'
import { RootState, setcurrentReportDate, setLoggedUserReports } from '../../../Redux/Store'
import { convertDecimalToTimeDirect, convertDecimalToTimeDirectForMonth } from '../AdminDashboardComponents/Attendance/Attendance'
import { useDispatch, useSelector } from 'react-redux'

export enum ESelected {
    Layout,
    Table
}

export enum EReportsStatus {
    Present,
    Absent,
    FullLeave,
    HalfLeave,
    WeekOff
}

interface Attendances {
    shortHours: any
    date: string,
    dayTrans: [],
    status: EReportsStatus,
    workingHours?: number,
    requiredHours?: number,
    extraHours?: number,
    onTime?: boolean
}

export interface IReports {
    userId?: string,
    attendances: Attendances[],
    month: string,
    year: string,
    dayRecords: {
        totalMonthPresence: number,
        totalMonthAbsent: number,
        totalMonthLeaveToken: number,
        totalMonthOnTime: number,
        totalMonthNotOnTime: number,
        totalMonthWokringHours: number,
        totalMonthShortHours: number,
    }
}

const Reports = () => {
    const { callApi } = useCallApi();
    const [refresh, setRefresh] = useState<boolean>();
    const [selected, setSelected] = useState<ESelected>(ESelected.Table);
    const isLoading = false;
    const id = useSelector((state: RootState) => state.authLogin.id);
    const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
    const dispatch = useDispatch();
    const currentMonthReports = useSelector((state: RootState) => state.localStates.loggedUserReport);


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
                                        className="flex gap-2 w-16 cursor-pointer justify-center py-1 bg-green-100 text-green-600 rounded-sm items-center text-xs"
                                    >
                                        Present
                                    </button>
                                );
                            case EReportsStatus.Absent:
                                return (
                                    <button
                                        className="flex gap-2 text-xs w-16 cursor-pointer justify-center py-1 bg-red-100 text-red-600 rounded-sm items-center"
                                    >
                                        Absent
                                    </button>
                                );
                            case EReportsStatus.FullLeave:
                                return (
                                    <button
                                        className="flex gap-2 w-20 cursor-pointer justify-center py-1 bg-purple-100 text-purple-600 rounded-sm items-center text-xs"
                                    >
                                        Full Leave
                                    </button>
                                );
                            case EReportsStatus.HalfLeave:
                                return (
                                    <button
                                        className="flex gap-2 w-20 cursor-pointer justify-center py-1 bg-orange-100 text-orange-600 rounded-sm items-center text-xs"
                                    >
                                        Half Leave
                                    </button>
                                );
                            case EReportsStatus.WeekOff:
                                return (
                                    <button
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
                id: id
            }
        }).then((res) => {
            dispatch(setLoggedUserReports(res?.data?.data));
        });
    };

    useEffect(() => {
        getReports(dayjs())
    }, [refresh])

    return (
        <div className='w-full h-full relative'>
            <div className='flex justify-between mt-4 mb-2'>
                <div></div>
                <div className='flex items-center'>
                    <ChevronLeft size={28} onClick={() => { setSelectedMonth(selectedMonth.add(-1, 'M')), getReports(selectedMonth.add(-1, 'M')) }} className='cursor-pointer bg-gray-200 rounded-sm text-gray-600' />
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
                    <ChevronRight size={28} onClick={() => { setSelectedMonth(selectedMonth.add(1, 'M')), getReports(selectedMonth.add(1, 'M')) }} className='bg-gray-200 cursor-pointer rounded-sm text-gray-600' />
                </div>
                <div className='flex gap-1 items-center'>
                    <RotateCw size={32} className='cursor-pointer p-1.5 rounded bg-blue-100 text-blue-500' onClick={() => { setRefresh(prevRefresh => !prevRefresh) }} />
                    <LayoutGrid size={32} onClick={() => setSelected(ESelected.Layout)} className={selected === ESelected.Layout ? 'cursor-pointer p-1 text-blue-500' : 'cursor-pointer p-1 text-gray-500'} />
                    <AlignJustify size={32} onClick={() => setSelected(ESelected.Table)} className={selected === ESelected.Table ? 'cursor-pointer p-1 text-blue-500' : 'cursor-pointer p-1 text-gray-500'} />
                </div>
            </div>
            <div className='bg-[#F0F3F8] flex justify-center p-3 rounded-lg gap-3'>
                <div className='bg-white flex flex-col gap-1 w-48 text-center py-3 rounded-lg'>
                    <p className='text-2xl'>{currentMonthReports ? currentMonthReports?.dayRecords?.totalMonthPresence : '0'}</p>

                    <p className='flex bg-green-50 rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'><Circle className='text-green-500' size={12} />Presence</p>
                </div>
                <div className='bg-white flex flex-col gap-1 w-48 text-center py-3 rounded-lg'>
                    <p className='text-2xl'>{currentMonthReports ? currentMonthReports?.dayRecords?.totalMonthAbsent : '0'}</p>
                    <p className='flex bg-red-50 rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'><Circle className='text-red-500' size={12} />Absent</p>
                </div>
                <div className='bg-white flex flex-col gap-1 w-48 text-center py-3 rounded-lg'>
                    <p className='text-2xl'>{currentMonthReports ? currentMonthReports?.dayRecords?.totalMonthLeaveToken : '0'}</p>
                    <p className='flex bg-purple-50 rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'><Circle className='text-purple-500' size={12} />Leave Token</p>
                </div>
                <div className='bg-white flex flex-col gap-1 w-48 text-center py-3 rounded-lg'>
                    <p className='text-2xl'>{currentMonthReports ? currentMonthReports?.dayRecords?.totalMonthOnTime : '0'}</p>
                    <p className='flex bg-red-50 rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'><Circle className='text-red-500' size={12} />On Time</p>
                </div>
                <div className='bg-white flex flex-col gap-1 w-48 text-center py-3 rounded-lg'>
                    <p className='text-2xl'>{currentMonthReports ? convertDecimalToTimeDirectForMonth(currentMonthReports?.dayRecords?.totalMonthWokringHours) : '00:00'}</p>
                    <p className='flex bg-blue-50 rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'><Circle className='text-blue-500' size={12} />Working Hours</p>
                </div>
                <div className='bg-white flex flex-col gap-1 w-48 text-center py-3 rounded-lg'>
                    <p className='text-2xl'>{currentMonthReports ? convertDecimalToTimeDirectForMonth(currentMonthReports?.dayRecords?.totalMonthShortHours) : '00:00'}</p>
                    <p className='flex bg-red-50 rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'><Circle className='text-red-500' size={12} />Short Hours</p>
                </div>
            </div>
            <div className='mt-2'>
                {/* {dataSource.length === 0 ? (
                    <Skeleton active paragraph={{ rows: 5 }} />
                ) : (
                    <Table dataSource={dataSource || []} columns={columns} rowKey="_id" />
                )} */}
                <Table className='my-table-styling2' scroll={{ y: 61 * 10 }} dataSource={dataSource || []} columns={columns} rowKey="_id" pagination={false} />
            </div>
            <div className='flex gap-5 absolute bottom-0 rounded pb-3 pt-1 rounded px-1 bg-white w-full'>
                <p className='flex gap-2 items-center text-sm'><TentTree size={16} color='blue' />Holiday</p>
                <p className='flex gap-2 items-center text-sm'><CircleCheck size={16} color='green' />Present</p>
                <p className='flex gap-2 items-center text-sm'><CircleCheck size={16} color='yellow' />Half Day</p>
                <p className='flex gap-2 items-center text-sm'><CircleAlert size={16} color='orange' />Missing Time</p>
                <p className='flex gap-2 items-center text-sm'><CalendarClock size={16} color='purple' />Full Leave</p>
                <p className='flex gap-2 items-center text-sm'><CircleCheck size={16} color='orange' />Half Leave</p>
                <p className='flex gap-2 items-center text-sm'><CircleCheck size={16} color='purple' />WFH</p>
                <p className='flex gap-2 items-center text-sm'><CircleX size={16} color='red' />Absent</p>
            </div>
        </div>
    )
}

export default Reports