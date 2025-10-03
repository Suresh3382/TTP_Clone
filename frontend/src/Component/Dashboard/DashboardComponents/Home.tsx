import { Progress } from 'antd';
import { ArrowDownLeft, ArrowUpRight, Calendar, CalendarClock, CalendarPlus, CalendarX, Circle, CircleCheck, CircleX, Hourglass, TentTree, Timer, X } from 'lucide-react';
import { EReportsStatus } from './EmployeeComponents/Reports';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setLoggedUserReports, setSelectedKey } from '../../Redux/Store';
import dayjs, { Dayjs } from 'dayjs';
import { useContext, useEffect } from 'react';
import { baseURL } from '../../../baseURL';
import { useCallApi } from '../../../Utlits/AxiosConifg';
import UserContext from '../../../Context/UserContext';
import { IContext } from '../../../Context/UserContextInterface';
import { convertDecimalToTimeDirectForMonth } from './AdminDashboardComponents/Attendance/Attendance';
import { leaveStatusEnum, leaveTypeEnum } from './Leaves/LeavesType/LTEnum/LeavesTypeEnum';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { LegendComponent, TooltipComponent, GridComponent } from 'echarts/components';
echarts.use([LegendComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer]);

const Home = () => {
    const { callApi } = useCallApi();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loggedUser, ERequstName, setLeaveRequest, leaveRequest } = useContext<IContext>(UserContext);
    const id = useSelector((state: RootState) => state.authLogin.id);
    const currentMonthReports = useSelector((state: RootState) => state.localStates.loggedUserReport);
    const chartRef = useRef(null);

    const convertDecimalToTime = (decimalHours: number) => {
        const minutes = decimalHours * 60;
        const durationObj = dayjs.duration(minutes, 'minutes');
        const hours = String(durationObj.hours()).padStart(2, '0');
        const minutesFormatted = String(durationObj.minutes()).padStart(2, '0');
        const seconds = String(durationObj.seconds()).padStart(2, '0');
        return {
            hoursAndMinutes: `${hours}:${minutesFormatted}:`,
            seconds
        };
    };


    let status, workingHours, requiredHours, workingHoursProgress, onTime;
    let dayTrans: Dayjs[] = [];

    currentMonthReports?.attendances.map((att) => {
        if (dayjs().isSame(att.date, 'date')) {
            status = att.status;
            workingHours = att.workingHours;
            requiredHours = att.requiredHours;
            onTime = att.onTime;
            dayTrans = att.dayTrans;
        }
    })

    workingHoursProgress = workingHours && requiredHours && (workingHours / requiredHours * 100);


    useEffect(() => {
        const myChart = echarts.init(chartRef.current);
        const sevenDays: any[] = [];

        currentMonthReports?.attendances.forEach((attends) => {
            const today = dayjs();
            if (attends && attends.workingHours) {
                if (today.diff(attends.date, 'date') >= 7) {
                    sevenDays.push(attends);
                }
            }
        });

        const workingHoursData = sevenDays.map((day) => day.workingHours || 0);
        const shortHoursData = sevenDays.map((day) => day.shortHours || 0);

        const option = {
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                top: 10,
                right: 10,
                selectedMode: false,
            },
            xAxis: {
                type: 'category',
                data: sevenDays.map((day) => dayjs(day.date).format('DD MMM')),
                axisLabel: {
                    fontFamily: 'Outfit',
                    fontSize: 14,
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    fontFamily: 'Outfit',
                    fontSize: 14,
                },
            },
            series: [
                {
                    name: "Working Hours",
                    data: sevenDays.map((day, index) => {
                        return shortHoursData.length > 0 ? workingHoursData[index] : 0;
                    }),
                    type: 'bar',
                    itemStyle: {
                        color: (params: any) => {
                            return shortHoursData[params.dataIndex] > 0 ? '#ffb9cc' : '#226fffff';
                        },
                        borderRadius: [5, 5, 0, 0],
                    },
                },
            ],
        };

        myChart.setOption(option);

        return () => {
            myChart.dispose();
        };
    }, [currentMonthReports]);



    const getReports = (e: Dayjs) => {
        const date = dayjs().toDate();
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

    const getLeaves = () => {
        callApi({
            requestEndpoint: `${baseURL}user/getLeaveRequest`, method: 'post', body: { status: ERequstName }
        }).then((res) => {
            setLeaveRequest(res.data.data);
        }).catch((err) => {
            console.log('Error', err);
        });
    }

    useEffect(() => {
        getReports(dayjs())
        getLeaves()
    }, [])

    return (
        <div className='w-full flex gap-3'>
            <div className='w-3/4'>
                <div className='border rounded-xl flex'>
                    <div className='flex gap-3.5 flex-col p-4 w-2/3 border-r'>
                        <div className='flex gap-3.5 flex-col'>
                            <div className='flex justify-between items-center'>
                                <div className='flex gap-4 items-center'>
                                    <Progress percent={Math.round(workingHoursProgress ? workingHoursProgress : 0)} type="circle" size={120} strokeWidth={12} />
                                    <div className='flex flex-col gap-1'>
                                        <span className='text-sm'>
                                            {dayjs().format('ddd, MMM DD, YYYY')}
                                        </span>
                                        <span className={status === EReportsStatus.Present ? 'flex items-end text-5xl text-blue-600' : 'flex items-end text-5xl text-gray-600'}>
                                            {workingHours && convertDecimalToTime(workingHours).hoursAndMinutes}
                                            <span className='text-xl'>{workingHours && (convertDecimalToTime(workingHours).seconds)}</span>
                                            <span className='text-sm'>{onTime ?
                                                <>
                                                    <p className='flex bg-green-50 rounded-3xl mx-3 flex justify-center items-center gap-1 px-2 text-black py-0.5 text-xs'>
                                                        <Circle className='text-green-500' size={10} />On Time
                                                    </p>
                                                </> :
                                                <>
                                                    <p className='flex bg-green-50 rounded-3xl mx-3 flex justify-center items-center gap-1 px-2 text-black py-0.5 text-xs'>
                                                        <Circle className='text-red-500' size={10} />Not On Time
                                                    </p>
                                                </>}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <img className='rounded-full w-[105px] h-[105px] border-8' src={loggedUser.pfp} />
                            </div>
                            <div className='flex gap-6'>
                                <span className='flex items-center text-sm gap-2'><span className='border-l-[3px] border-green-700 ps-2 text-xs text-gray-400'>
                                    Today's Required Hour
                                </span>
                                    {requiredHours ? `${convertDecimalToTimeDirectForMonth(requiredHours)} Hrs` : '00:00 Hrs'}
                                </span>
                                <span className='flex items-center text-sm gap-2'><span className='border-l-[3px] border-sky-400 ps-2 text-xs text-gray-400'>
                                    Average Working
                                </span>
                                    {workingHours ? `${convertDecimalToTimeDirectForMonth(workingHours)} Hrs` : '00:00 Hrs'}
                                </span>
                                <span className='flex items-center text-sm gap-2'><span className='border-l-[3px] border-blue-700 ps-2 text-xs text-gray-400'>
                                    Shift Timing
                                </span>
                                    10:00 AM - 08:00 PM
                                </span>
                            </div>
                        </div>
                        {status === EReportsStatus.Absent &&
                            <div className='bg-red-50 h-[70px] flex justify-center items-center rounded'>
                                <span className='flex gap-1 items-center text-sm'>
                                    <X className='text-red-700 border-2 rounded-full border-red-700' size={15} />
                                    <span className='pt-0.5'>Absent</span>
                                </span>
                            </div>
                        }
                        {status === EReportsStatus.Present && (
                            <div
                                className={`bg-gray-200 h-[78px] px-2.5 flex gap-2 items-center rounded-xl ${dayTrans.length > 6 ? 'overflow-x-scroll clean-scrollbar' : ''}`}
                            >
                                {dayTrans.map((dayTrans: Dayjs, index: number) => {
                                    return (
                                        <div className="space-y-1" key={index}>
                                            <div className="px-5 py-2.5 rounded-xl flex items-center gap-2.5 bg-white">
                                                {index % 2 === 0 ? (
                                                    <div className='flex flex-col text-sm'>
                                                        <span>Check In</span>
                                                        <span className='flex gap-1 items-center text-sm'>
                                                            <ArrowDownLeft
                                                                strokeWidth={3}
                                                                size={14}
                                                                className="text-green-600 border-2 border-green-600 rounded hover:bg-green-100 cursor-pointer"
                                                            />
                                                            <span>{dayTrans ? dayjs(dayTrans).format('hh:mm A') : 'No Check-out'}</span>
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className='flex flex-col text-sm'>
                                                        <span>Check Out</span>
                                                        <span className='flex gap-1 items-center text-sm'>
                                                            <ArrowUpRight
                                                                strokeWidth={3}
                                                                size={14}
                                                                className="text-red-600 border-2 border-red-600 rounded hover:bg-red-100 cursor-pointer"
                                                            />
                                                            <span>{dayTrans ? dayjs(dayTrans).format('hh:mm A') : 'No Check-out'}</span>
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {status === EReportsStatus.FullLeave || status === EReportsStatus.HalfLeave &&
                            <div className='bg-purple-50 h-[70px] flex justify-center items-center rounded'>
                                <span className='flex gap-1 items-center text-sm'>
                                    <CalendarClock className='text-red-700 border-2 rounded-full border-purple-700' size={15} />
                                    <span className='pt-0.5'>Leave</span>
                                </span>
                            </div>
                        }
                    </div>
                    <div className='p-4 w-1/3'>
                        <div className='bg-gray-100 p-2 rounded flex justify-center'>
                            {/* <Radio.Group defaultValue={1} buttonStyle='solid'>
                                <Radio.Button value={1}>Attendance Statistics</Radio.Button>
                                <Radio.Button value={2}>Timing Details</Radio.Button>
                            </Radio.Group> */}
                        </div>
                    </div>
                </div>
                <div className='mt-2 py-2 px-4 border rounded'>
                    <span className='flex gap-0.5 pb-1 items-center'>
                        Statistics
                        <span className='text-xs text-gray-400'>
                            (This month)
                        </span>
                    </span>
                    <div className='bg-[#F0F3F8] flex justify-center p-3 rounded-lg gap-3'>
                        <div className='bg-white flex flex-col gap-2 w-48 text-center py-3 rounded-lg'>
                            <div className='flex justify-center items-center'>
                                <div className='bg-green-50 rounded-full p-2.5'>
                                    <Calendar className='text-green-500' size={24} />
                                </div>
                            </div>
                            <p className='text-2xl'>{currentMonthReports ? currentMonthReports?.dayRecords?.totalMonthPresence : '0'}</p>
                            <p className='flex bg-green-50 rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'>
                                <Circle className='text-green-500' size={12} />Presence
                            </p>
                        </div>

                        <div className='bg-white flex flex-col gap-2 w-48 text-center py-3 rounded-lg'>
                            <div className='flex justify-center items-center'>
                                <div className='bg-red-50 rounded-full p-2.5'>
                                    <CalendarX className='text-red-500' size={24} />
                                </div>
                            </div>
                            <p className='text-2xl'>{currentMonthReports ? currentMonthReports?.dayRecords?.totalMonthAbsent : '0'}</p>
                            <p className='flex bg-red-50 rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'>
                                <CalendarX className='text-red-500' size={12} />Absent
                            </p>
                        </div>

                        <div className='bg-white flex flex-col gap-2 w-48 text-center py-3 rounded-lg'>
                            <div className='flex justify-center items-center'>
                                <div className='bg-purple-50 rounded-full p-2.5'>
                                    <CalendarPlus className='text-purple-500' size={24} />
                                </div>
                            </div>
                            <p className='text-2xl'>{currentMonthReports ? currentMonthReports?.dayRecords?.totalMonthOnTime : '0'}</p>
                            <p className='flex bg-purple-50 rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'>
                                <Circle className='text-purple-500' size={12} />Leave
                            </p>
                        </div>

                        <div className='bg-white flex flex-col gap-2 w-48 text-center py-3 rounded-lg'>
                            <div className='flex justify-center items-center'>
                                <div className='bg-green-50 rounded-full p-2.5'>
                                    <Timer className='text-green-500' size={24} />
                                </div>
                            </div>
                            <p className='text-2xl'>{currentMonthReports ? currentMonthReports?.dayRecords?.totalMonthOnTime : '0'}</p>
                            <p className='flex bg-green-50 rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'>
                                <Circle className='text-green-500' size={12} />On Time
                            </p>
                        </div>

                        <div className='bg-white flex flex-col gap-2 w-48 text-center py-3 rounded-lg'>
                            <div className='flex justify-center items-center'>
                                <div className='bg-red-50 rounded-full p-2.5'>
                                    <Timer className='text-red-500' size={24} />
                                </div>
                            </div>
                            <p className='text-2xl'>{currentMonthReports ? currentMonthReports?.dayRecords?.totalMonthNotOnTime : '0'}</p>
                            <p className='flex bg-red-50 rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'>
                                <Circle className='text-red-500' size={12} />Not On Time
                            </p>
                        </div>

                        <div className='bg-white flex flex-col gap-2 w-48 text-center py-3 rounded-lg'>
                            <div className='flex justify-center items-center'>
                                <div className='bg-red-50 rounded-full p-2.5'>
                                    <Hourglass className='text-red-500' size={24} />
                                </div>
                            </div>
                            <p className='text-2xl'>
                                {currentMonthReports
                                    ? convertDecimalToTimeDirectForMonth(currentMonthReports?.dayRecords?.totalMonthShortHours)
                                    : '00:00'}
                            </p>
                            <p className='flex bg-red-50 rounded-lg mx-2 flex justify-center items-center gap-2 px-4 py-1 text-sm'>
                                <Circle className='text-red-500' size={12} />Short Hours
                            </p>
                        </div>

                    </div>
                </div>
                <div className='flex gap-2 mt-2 flex-grow w-full justify-center'>
                    <div className='border rounded w-full'>
                        <div className='my-2 mx-4'>
                            <span className='text-gray-700'>
                                Leave Histroy
                            </span>
                        </div>
                        <div className={`px-4 h-64 ${leaveRequest.length > 2 ? 'overflow-y-scroll clean-scrollbar' : ''}`}>
                            {leaveRequest && leaveRequest.length > 0 ?
                                leaveRequest.toReversed().map((leave, index) => {
                                    return (
                                        index <= 4 &&
                                        <div key={index} className='mb-1 border-b'>
                                            <div className='flex justify-between'>
                                                <span className='underline text-xs flex gap-1 items-center'>
                                                    <Circle fill='red' className='text-red-700' size={7} /> {leave.leaveType === leaveTypeEnum.CasualLeave ? 'Casual Leave' : 'Sick Leave'}
                                                </span>
                                                <span className='text-xs'>{dayjs(leave.from).format('DD/MM/YYYY')}</span>
                                            </div>
                                            <div>
                                                <span className='text-xs'>{leave.reason}</span>
                                                <div className='flex justify-between items-center'>
                                                    <span className='text-xs text-gray-400'>
                                                        Applied On: {dayjs(leave.createdAt).format('DD/MM/YYYY')}
                                                    </span>
                                                    <span
                                                        className={`text-xs font-medium px-2 mb-2 py-0.5 rounded ${leave.status === leaveStatusEnum.Approved
                                                            ? 'bg-green-100 text-green-700'
                                                            : leave.status === leaveStatusEnum.Rejected
                                                                ? 'bg-red-100 text-red-700'
                                                                : leave.status === leaveStatusEnum.Pending
                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                    : ''
                                                            }`}
                                                    >
                                                        {leave.status === leaveStatusEnum.Approved && "Approved"}
                                                        {leave.status === leaveStatusEnum.Rejected && "Rejected"}
                                                        {leave.status === leaveStatusEnum.Pending && "Pending"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }) :
                                <span className='flex flex-col justify-center items-center py-1 my-12'>
                                    <img src="/vec.jpg" className='w-40 h-40' />
                                    <p className='text-gray-400'>No Data Found</p>
                                </span>
                            }
                        </div>
                        <div className='flex justify-end p-2 cursor-pointer'>
                            <span className='underline text-xs' onClick={() => { dispatch(setSelectedKey('/leaves')), navigate('/leaves') }}>View All</span>
                        </div>

                    </div>
                    <div className='border rounded w-full'>
                        <div className='my-2 mx-4'>
                            <span className='flex justify-between items-center text-gray-700'>
                                Working Hours
                                <span className='text-xs text-gray-400'>Last 7 Working days</span>
                            </span>
                        </div>
                        {
                            <span>
                                <div ref={chartRef} style={{ width: '100%', height: '280px' }} id="main"></div>
                            </span>

                            // <span className='flex flex-col justify-center items-center py-1 my-12'>
                            //     <img src="/vec.jpg" className='w-40 h-40' />
                            //     <p className='text-gray-400'>No Data Found</p>
                            // </span>
                        }
                    </div>
                    <div className='border rounded w-full'>
                        <div className='my-2 mx-4'>
                            <span className='text-gray-700'>
                                Upcoming Birthday
                            </span>
                        </div>
                        <span className='flex flex-col justify-center items-center py-1 my-12'>
                            <img src="/vec.jpg" className='w-40 h-40' />
                            <p className='text-gray-400'>No Data Found</p>
                        </span>
                    </div>
                </div>
            </div>
            <div className='w-1/4 bg-gray-200 rounded '>
                <div className='flex justify-between items-center px-3 py-3'>
                    <span>Attendences</span>
                    <span className='text-sm text-gray-600'>This Month</span>
                </div>
                <div className="flex flex-col overflow-y-scroll clean-scrollbar h-[81vh]">
                    {currentMonthReports && currentMonthReports.attendances.length > 0 ? (
                        currentMonthReports.attendances.map((att, index) => (
                            att.status !== EReportsStatus.WeekOff ? (
                                <div key={index} className='bg-white flex mx-2 my-0.5 p-1 gap-4 items-center w-100 rounded'>
                                    <div className='font-[Outfit] flex flex-col items-center text-sm bg-gray-200 p-1 rounded w-1/5'>
                                        <span className='text-sm'>{dayjs(att.date).format('ddd')}</span>
                                        <span className='text-sm'>{dayjs(att.date).format('MMM DD')}</span>
                                    </div>
                                    <div>
                                        <span className='text-sm w-4/5'>
                                            {att.status === EReportsStatus.Absent && <span className='flex gap-1 items-center text-sm'>
                                                <CircleX size={14} color='red' />
                                                Absent
                                            </span>}
                                            {att.status === EReportsStatus.Present && (
                                                <span className='flex gap-1 items-center text-sm'>
                                                    {dayTrans.map((day: Dayjs, index: number) => {
                                                        return (
                                                            <div className="space-y-1" key={index}>
                                                                <div className="rounded-xl flex items-center mr-3">
                                                                    {index === 0 && (
                                                                        <div className='flex flex-col text-sm'>
                                                                            <span className='flex gap-1 items-center text-sm'>
                                                                                <ArrowDownLeft
                                                                                    strokeWidth={3}
                                                                                    size={14}
                                                                                    className="text-green-600 border-2 border-green-600 rounded hover:bg-green-100 cursor-pointer"
                                                                                />
                                                                                <span>{day ? dayjs(day).format('hh:mm A') : 'No Check-out'}</span>
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {index === dayTrans.length - 1 && (
                                                                        <div className='flex flex-col text-sm'>
                                                                            <span className='flex gap-1 items-center text-sm'>
                                                                                <ArrowUpRight
                                                                                    strokeWidth={3}
                                                                                    size={14}
                                                                                    className="text-red-600 border-2 border-red-600 rounded hover:bg-red-100 cursor-pointer"
                                                                                />
                                                                                <span>{day ? dayjs(day).format('hh:mm A') : 'No Check-out'}</span>
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </span>
                                            )}
                                            {att.status === EReportsStatus.FullLeave || att.status === EReportsStatus.HalfLeave && <span className='flex gap-1 items-center text-sm'>
                                                <CalendarClock size={14} color='purple' />
                                                Leave
                                            </span>}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className='bg-white flex mx-2 my-0.5 p-1 gap-4 items-center justify-center text-gray-500 py-3.5 w-100 rounded'>
                                    <div className='flex flex-col items-center text-sm p-1 rounded'>
                                        WEEKEND - {dayjs(att.date).format('ddd, MMM DD')}
                                    </div>
                                </div>
                            )
                        ))
                    ) : (
                        <p className="text-gray-500 italic px-3">No reports for the current month.</p>
                    )}
                </div>
                <div className='flex justify-between px-3 py-3'>
                    <p className='flex gap-1.5 items-center text-xs'><CircleCheck size={16} color='green' />Present</p>
                    <p className='flex gap-1.5 items-center text-xs'><CircleX size={16} color='red' />Absent</p>
                    <p className='flex gap-1.5 items-center text-xs'><CalendarClock size={16} color='purple' />Full Leave</p>
                    <p className='flex gap-1.5 items-center text-xs'><TentTree size={16} color='blue' />Holiday</p>
                </div>
            </div>
        </div>
    )
}

export default Home

