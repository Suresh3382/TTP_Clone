import { Avatar, Button, Checkbox, Col, Collapse, Image, CollapseProps, Modal, Select, Table, DatePicker, Input, Skeleton, Spin, Pagination, Popover, DatePickerProps, TimeRangePickerProps } from 'antd'
import { useContext, useEffect, useState } from 'react';
import { IleaveRequest } from '../Leaves/Leaves';
import { baseURL } from '../../../../baseURL';
import dayjs, { Dayjs } from 'dayjs';
import { dayTypeEnum, leaveStatusEnum, leaveTypeEnum } from '../Leaves/LeavesType/LTEnum/LeavesTypeEnum';
import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined';
import { Formik } from 'formik';
import UserContext from '../../../../Context/UserContext';
import { Paperclip, RotateCw, Search } from 'lucide-react';
import { RangePickerProps } from 'antd/es/date-picker';
import { IContext } from '../../../../Context/UserContextInterface';
import { useCallApi } from '../../../../Utlits/AxiosConifg';
import { EReportsStatus } from '../EmployeeComponents/Reports';

interface ILeaveRequestEdit {
    _id?: string
    User?: {
        userId: string,
        username: string
    }
    leaveType: leaveTypeEnum | undefined,
    from: Dayjs | null | undefined,
    to: Dayjs | null | undefined,
    dayType: dayTypeEnum,
    isFirstHalf: boolean,
    isSecondHalf: boolean,
    reason: string,
    document: string,
    status: leaveStatusEnum
    isChecked?: boolean,
    createdAt?: string,
    updatedAt?: string,
    processedBy?: {
        userId: string,
        username: string
    },
    user?: {
        contactFeilds?: {
            image?: string
        }
    }
    remark: string;
}

interface IInitialUpdateReports {
    status: leaveStatusEnum,
    remark: string,
}

interface SubmitHelpers {
    setSubmitting: (isSubmitting: boolean) => void;
    resetForm: () => void;
}

const Request = () => {
    const { callApi } = useCallApi();
    const [currentPage, setCurrentPage] = useState(1);
    const [filterLeaveType, setFilterLeaveType] = useState<leaveTypeEnum[]>([]);
    const [filterDateLeave, setFilterDateLeave] = useState<any>();
    const [filterLeaveStatus, setFilterLeaveStatus] = useState<leaveStatusEnum[]>([]);
    const [nameFilterLeaves, setNameFilterLeaves] = useState<string>();
    const [allLeavesData, setAllLeavesData] = useState<IleaveRequest[]>([]);
    const [currentLeaveEdit, setCurrentLeaveEdit] = useState<ILeaveRequestEdit>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { loggedUser } = useContext<IContext>(UserContext);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [visible, setVisible] = useState(false);
    const [total, setTotal] = useState<number>(0);


    const InitialUpdateReports: IInitialUpdateReports = {
        status: currentLeaveEdit?.status || leaveStatusEnum.Pending,
        remark: '',
    }


    const handleChange = (pagination: any) => {
        setIsLoading(true);
        setCurrentPage(pagination);
        setRefresh(prevRefresh => !prevRefresh)
    };

    const rangePresets: TimeRangePickerProps['presets'] = [
        { label: <span className='font-[Outfit] text-[13px]'>Today</span>, value: [dayjs(), dayjs()] },
        { label: <span className='font-[Outfit] text-[13px]'>Tomorrow</span>, value: [dayjs().add(1, 'd'), dayjs().add(1, 'd')] },
        { label: <span className='font-[Outfit] text-[13px]'>Next 7 Days</span>, value: [dayjs().add(7, 'd'), dayjs()] },
        { label: <span className='font-[Outfit] text-[13px]'>Next 14 Days</span>, value: [dayjs().add(14, 'd'), dayjs()] },
        { label: <span className='font-[Outfit] text-[13px]'>This Month</span>, value: [dayjs().startOf('month'), dayjs().endOf('month')] },
        { label: <span className='font-[Outfit] text-[13px]'>Next Month</span>, value: [dayjs().add(1, 'month').startOf('month'), dayjs().add(1, 'month').endOf('month')] },
    ];

    // const deboucingExample = () => {
    //     console.log("as");
    // }

    // function createDebouncing(fun, t) {
    //     let time;
    //     if (time) clearTimeout(time)
    //     return () => {
    //         setTimeout(() => {
    //             fun()
    //         }, t)
    //     }

    // }

    // const getVal = createDebouncing(deboucingExample, 2000)

    const handleNameValues = (w: any) => {
        if (w.key === "Enter") {
            setIsLoading(true);
            setNameFilterLeaves(w.target.value);
        }
    }

    const skeletonData = Array.from({ length: 14 }, (_, i) => ({
        key: i,
        User: {},
        user: { contactFeilds: {} },
    }));


    const handleLeaveType = (e: any[]) => {
        setIsLoading(true);
        setFilterLeaveType(e);
        setCurrentPage(1);
    }

    const handleLeaveStatus = (e: any[]) => {
        setIsLoading(true);
        setFilterLeaveStatus(e);
        setCurrentPage(1);
    }

    const handleOpenLeaveRequest = (record: ILeaveRequestEdit) => {
        setIsModalOpen(true);
        setCurrentLeaveEdit(record);
    }

    const onChange = (date: Dayjs | (Dayjs | null)[] | null) => {
        setIsLoading(true);
        setFilterDateLeave(date);
        setCurrentPage(1);
    };

    const getAllLeaveRequests = () => {
        callApi({
            requestEndpoint: `${baseURL}user/getAllLeaveRequests`, method: 'post', body: { status: filterLeaveStatus, leaveType: filterLeaveType, name: nameFilterLeaves, pagination: { currentPage: currentPage, limit: 14 }, date: filterDateLeave }
        }).then((res) => {
            setAllLeavesData(res?.data?.data?.data || []);
            setTotal(res?.data?.data?.total > 0 ? res?.data?.data?.total : 0);
            setIsLoading(false);
        }).catch((err) => {
            console.error("Error fetching leave requests:", err);
        });
    }

    useEffect(() => {
        getAllLeaveRequests();
    }, [filterLeaveStatus, filterLeaveType, nameFilterLeaves, refresh, filterDateLeave]);

    const handleSubmit = (values: IInitialUpdateReports, { setSubmitting, resetForm }: SubmitHelpers) => {

        console.log(values)
        const val = {
            ...values,
            processedBy: {
                userId: loggedUser?._id,
                username: loggedUser?.username
            }
        }
        callApi({ requestEndpoint: `${baseURL}user/updateLeaveRequest/${currentLeaveEdit?._id}`, method: 'post', body: val }).then((res) => {
            setSubmitting(false);
            resetForm();
            setIsModalOpen(false);
            getAllLeaveRequests();
        }
        ).catch((err) => {
            console.log('Error', err);
        });
    }

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'LeaveType',
            children: <>
                <div>
                    <Checkbox.Group style={{ width: '100%' }} onChange={handleLeaveType}>
                        <Col span={16}>
                            <Checkbox value={leaveTypeEnum.SickLeave}>Sick Leave</Checkbox>
                            <Checkbox value={leaveTypeEnum.CasualLeave}>Casual Leave</Checkbox>
                        </Col>
                    </Checkbox.Group>
                </div>
            </>
        },
        {
            label: 'Status',
            key: '2',
            children: <>
                <div>
                    <Checkbox.Group style={{ width: '100%' }} onChange={handleLeaveStatus}>
                        <Col span={16}>
                            <Checkbox value={leaveStatusEnum.Pending}>Pending</Checkbox>
                            <Checkbox value={leaveStatusEnum.Approved}>Approved</Checkbox>
                            <Checkbox value={leaveStatusEnum.Rejected}>Rejected</Checkbox>
                        </Col>
                    </Checkbox.Group>
                </div>
            </>
        }
    ];

    const columns = [
        {
            title: '',
            dataIndex: 'image',
            key: 'image',
            width: '5%',
            render: (_: any, record: any) =>
                isLoading ? (
                    <Skeleton.Avatar active size="small" className='py-1' shape="circle" />
                ) : (
                    <div className="rounded-full w-8 h-8 flex justify-center items-center bg-gray-100">
                        {record?.user?.contactFeilds?.image ? (
                            <img src={record?.user?.contactFeilds?.image} className='rounded-full' alt="User Avatar" />
                        ) : (
                            <div className="flex justify-center items-center text-blue-600 font-semibold text-md">
                                <span>{record?.User?.username.charAt(0)?.toUpperCase() || '?'}</span>
                            </div>
                        )}
                    </div>
                ),
        },
        {
            title: 'NAME',
            dataIndex: 'name',
            key: 'name',
            render: (_: any, record: any) =>
                isLoading ? (
                    <Skeleton.Input style={{ width: 100, height: 20 }} active size="small" />
                ) : (
                    record.User?.username
                ),
        },
        {
            title: 'APPLIED',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (item: any) =>
                isLoading ? (
                    <Skeleton.Input style={{ width: 120, height: 20 }} active size="small" />
                ) : (
                    <div className="flex gap-1 items-baseline">
                        <span>{dayjs(item).format('DD MMM YYYY')}</span>
                        <span className="flex text-gray-400 text-[11px] ms-1">
                            {dayjs(item).format('HH:mm A')}
                        </span>
                    </div>
                ),
        },
        {
            title: 'TYPE',
            dataIndex: 'type',
            key: 'type',
            render: (_: any, record: any) => {
                if (isLoading) {
                    return <Skeleton.Input style={{ width: 90, height: 20 }} active size="small" />;
                }

                const leaveLabel =
                    record.leaveType === leaveTypeEnum.SickLeave
                        ? 'Sick Leave'
                        : record.leaveType === leaveTypeEnum.CasualLeave
                            ? 'Casual Leave'
                            : '';

                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {leaveLabel}
                        {record?.document?.document && (
                            <>
                                <Popover
                                    content={<div className='mx-2'>
                                        <p className='hover:text-blue-800 cursor-pointer' onClick={() => setVisible(true)}>{record?.document?.name}</p>
                                    </div>}
                                    trigger="click"
                                    open={visible === true ? false : undefined}
                                >
                                    <Button
                                        icon={<Paperclip color="gray" size={14} />}
                                        size="small"
                                    />
                                </Popover>
                                <Image
                                    style={{ display: 'none' }}
                                    src={record?.document}
                                    preview={{
                                        visible,
                                        src: `${record?.document?.document}`,
                                        onVisibleChange: (value) => {
                                            setVisible(value);
                                        },
                                    }}
                                />
                            </>
                        )
                        }
                    </div >
                );
            }
        },
        {
            title: 'DAYS',
            dataIndex: 'days',
            key: 'days',
            render: (_: any, record: any) => {
                if (isLoading) {
                    return <Skeleton.Input style={{ width: 40, height: 20 }} active size="small" />;
                }
                let days = 0;
                if (record?.from && record?.to) {
                    const fromDate = dayjs(record.from);
                    const toDate = dayjs(record.to);
                    days = toDate.diff(fromDate, 'day') + 1;
                }
                return <span>{days === 0 ? 1 : days}</span>;
            },
        },
        {
            title: 'DATE',
            dataIndex: 'date',
            key: 'date',
            render: (_: any, record: any) =>
                isLoading ? (
                    <Skeleton.Input style={{ width: 140, height: 20 }} active size="small" />
                ) : record?.from && record?.to ? (
                    record.from === record.to ? (
                        <span>{dayjs(record.from).format('DD MMM YYYY')}</span>
                    ) : (
                        <span>
                            {dayjs(record.from).format('DD MMM YYYY')} -{' '}
                            {dayjs(record.to).format('DD MMM YYYY')}
                        </span>
                    )
                ) : null,
        },
        {
            title: 'REASON',
            dataIndex: 'reason',
            key: 'reason',
            render: (_: any, record: any) =>
                isLoading ? (
                    <Skeleton.Input style={{ width: 180, height: 20 }} active size="small" />
                ) : (
                    record.reason
                ),
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            width: '8%',
            render: (_: any, record: any) => {
                if (isLoading) {
                    return <Skeleton.Button style={{ width: 80, height: 20 }} active size="small" />;
                }
                if (record?.status === leaveStatusEnum.Pending) {
                    return (
                        <div
                            onClick={() => handleOpenLeaveRequest(record)}
                            className="bg-[#FCEAD3] cursor-pointer text-orange-900 w-20 py-[4px] flex justify-center rounded-md text-xs"
                        >
                            Pending
                        </div>
                    );
                } else if (record?.status === leaveStatusEnum.Approved) {
                    return (
                        <div
                            onClick={() => handleOpenLeaveRequest(record)}
                            className="bg-[#dbfcd3] text-green-900 cursor-pointer w-20 py-[4px] flex justify-center rounded-md text-xs"
                        >
                            Approved
                        </div>
                    );
                } else if (record?.status === leaveStatusEnum.Rejected) {
                    return (
                        <div
                            onClick={() => handleOpenLeaveRequest(record)}
                            className="bg-[#fcd4d3] text-red-900 cursor-pointer w-20 py-[4px] flex justify-center rounded-md text-xs"
                        >
                            Rejected
                        </div>
                    );
                }
                return null;
            },
        },
    ];


    return (
        <div>
            <div className='flex flex-col w-[100%]'>
                <div className='mt-1 w-full justify-between flex items-center'>
                    <div></div>
                    {/* <Button color='primary' variant='outlined' >Leave Application</Button> */}
                    <div className='flex gap-2'>
                        <DatePicker.RangePicker presets={rangePresets} placeholder={["DD/MM/YYYY", "DD/MM/YYYY"]} format={'DD/MM/YY'} className='font-[Outfit] w-52' onChange={onChange} />
                        <RotateCw size={32} className='cursor-pointer p-1.5 rounded bg-blue-100 text-blue-500' onClick={() => { setIsLoading(true), setRefresh(prevRefresh => !prevRefresh) }} />
                        <Input onKeyDown={handleNameValues} onChange={(e: any) => { e.target.value === "" && setNameFilterLeaves('') }} placeholder="Search" style={{ width: 200 }} className='me-3' suffix={<Search size={18} />} />
                    </div>
                </div>
                <div className='w-100 flex mt-4'>
                    <div className='w-1/6 border-t-[1px] border-gray-200'>
                        <Collapse ghost items={items} />
                    </div>
                    <div className='w-5/6 border-l-[1px] border-t-[1px] border-gray-200 pb-3 p-3 min-h-[85vh]'>
                        <Table
                            className="my-table-styling"
                            dataSource={isLoading ? skeletonData : allLeavesData.length > 0 ? (allLeavesData) : ([])}
                            columns={columns}
                            rowKey={(record: any) => record._id || record.key}
                            pagination={false}
                        />
                        <div className='w-full flex justify-end mt-4 gap-2'>
                            <p className='text-xs flex items-center mt-1'>Total {total} Items</p>
                            <Pagination size="small"
                                pageSize={14}
                                total={total}
                                onChange={handleChange}
                                showQuickJumper
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Modal
                    title="Leave Request"
                    closable={{ 'aria-label': 'Custom Close Button' }}
                    footer={false}
                    open={isModalOpen}
                    onCancel={() => { setIsModalOpen(false) }}
                    width={900}
                    className='font-[Outfit]'
                    destroyOnHidden
                >
                    {currentLeaveEdit?.status === 1 ? (<div className='w-100% flex flex-row gap-4'>
                        <div className='w-2/5 border-r pt-10 flex flex-col gap-16'>
                            <div className='flex flex-col items-center gap-2'>
                                <div className="rounded-full bg-gray-100">
                                    {currentLeaveEdit?.user?.contactFeilds?.image ? (
                                        <img src={currentLeaveEdit?.user?.contactFeilds?.image} className='rounded-full h-24' alt="User Avatar" />
                                    ) : (
                                        <div className="flex justify-center items-center text-blue-600 font-semibold text-md">
                                            <span>{currentLeaveEdit?.User?.username.charAt(0)?.toUpperCase() || '?'}</span>
                                        </div>
                                    )}
                                </div>
                                <p className='text-xl'>{currentLeaveEdit?.User?.username}</p>
                            </div>
                            <div className="border-t-[1px] border-gray-200 grid grid-col-2 gap-4 px-2 pt-4">
                                <div>
                                    <p className="text-gray-400 text-xs">TYPE</p>
                                    <p>{currentLeaveEdit?.leaveType === leaveTypeEnum.SickLeave ? 'Sick Leave' : 'Casual Leave'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs">APPLIED DATE</p>
                                    <p>
                                        {currentLeaveEdit?.createdAt ? dayjs(currentLeaveEdit.createdAt).format('DD MMM YYYY, HH:mm A') : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs">LEAVE DURATION</p>
                                    <p>
                                        {currentLeaveEdit?.from
                                            ? `${dayjs(currentLeaveEdit.from).format('DD MMM YYYY')}`
                                            : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs">LEAVE DAYS</p>
                                    <p>
                                        {currentLeaveEdit?.from && currentLeaveEdit?.to
                                            ? dayjs(currentLeaveEdit.to).diff(dayjs(currentLeaveEdit.from), 'day') + 1
                                            : '-'}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-gray-400 text-xs font-medium">REASON</p>
                                    <p className="break-words">{currentLeaveEdit?.reason || '-'}</p>
                                </div>
                            </div>
                        </div>
                        <div className='w-3/5'>
                            <Formik
                                enableReinitialize
                                initialValues={InitialUpdateReports}
                                onSubmit={handleSubmit}
                            >
                                {({ values, setValues, handleSubmit, isSubmitting, resetForm }) => {
                                    return (
                                        <>
                                            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt">
                                                <div className='flex flex-col gap-4 h-96 px-6 w-100 border-gray-200 p-6'>
                                                    <div>
                                                        <label className="block text-xs font-semibold mb-1">Status</label>
                                                        <Select
                                                            placeholder='Select Status'
                                                            onChange={(value) => setValues({ ...values, status: value })}
                                                            options={[
                                                                { value: leaveStatusEnum.Approved, label: 'Approved' },
                                                                { value: leaveStatusEnum.Rejected, label: 'Rejected' }
                                                            ]}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold mb-1">Remark</label>
                                                        <textarea
                                                            name="remark"
                                                            value={values.remark}
                                                            onChange={(e) => setValues({ ...values, remark: e.target.value })}
                                                            className="w-full border rounded px-3 py-2 text-sm min-h-[80px]"
                                                            placeholder="Add remark"
                                                        />
                                                        <p className='text-gray-400 text-xs'>Note: This remark will be visible to requesting employee and the management.</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button className='px-7 py-2 text-xs' type="default" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                                                        Cancel
                                                    </Button>
                                                    <Button className='px-6 py-2 text-xs' onClick={() => setIsModalOpen((false))} htmlType="submit" type="primary" loading={isSubmitting}>
                                                        Save
                                                    </Button>
                                                </div>
                                            </form>
                                        </>
                                    )
                                }
                                }
                            </Formik>
                        </div>
                    </div>) : (
                        <div className='w-100% flex flex-row '>
                            <div className='w-2/5 pt-10 flex flex-col gap-14'>
                                <div className='flex flex-col items-center gap-2'>
                                    <div className="rounded-full flex justify-center w-24 h-24 text-4xl bg-gray-400">
                                        {currentLeaveEdit?.user?.contactFeilds?.image ? (
                                            <img src={currentLeaveEdit?.user?.contactFeilds?.image} className='rounded-full' alt="User Avatar" />
                                        ) : (
                                            <div className="flex justify-center items-center text-white font-semibold text-md">
                                                <span>{currentLeaveEdit?.User?.username.charAt(0)?.toUpperCase() || '?'}</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className='text-xl'>{currentLeaveEdit?.User?.username}</p>
                                </div>
                                <div className="border-t-[1px] border-gray-200 grid grid-col-2 gap-4 px-2 pt-4">
                                    <div>
                                        <p className="text-gray-400 text-xs">TYPE</p>
                                        <p>{currentLeaveEdit?.leaveType === leaveTypeEnum.SickLeave ? 'Sick Leave' : 'Casual Leave'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs">APPLIED DATE</p>
                                        <p>
                                            {currentLeaveEdit?.createdAt ? (
                                                <>
                                                    {dayjs(currentLeaveEdit.createdAt).format('DD MMM YYYY')},{' '}
                                                    <span className='text-gray-500 text-xs'>{dayjs(currentLeaveEdit.createdAt).format('HH:mm A')}</span>
                                                </>
                                            ) : (
                                                '-'
                                            )}
                                        </p>

                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs">LEAVE DURATION</p>
                                        <p>
                                            {currentLeaveEdit?.from
                                                ? `${dayjs(currentLeaveEdit.from).format('DD MMM YYYY')}`
                                                : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs">LEAVE DAYS</p>
                                        <p>
                                            {currentLeaveEdit?.from && currentLeaveEdit?.to
                                                ? dayjs(currentLeaveEdit.to).diff(dayjs(currentLeaveEdit.from), 'day') + 1
                                                : '-'}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-gray-400 text-xs font-medium">REASON</p>
                                        <p className="break-words">{currentLeaveEdit?.reason || '-'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='w-3/5 border-l-[1px] border-gray-200'>
                                <div className='px-4'>
                                    <p className='text-gray-400 text-xs'>STATUS</p>
                                    <div className='flex mt-1 gap-2'>
                                        {currentLeaveEdit?.status === leaveStatusEnum.Approved && (
                                            <div className='bg-[#dbfcd3] text-green-900 cursor-pointer w-20 py-[4px] flex justify-center rounded-md text-xs'>
                                                Approved
                                            </div>
                                        )}
                                        {currentLeaveEdit?.status === leaveStatusEnum.Rejected && (
                                            <div className='bg-[#fcd4d3] text-red-900 cursor-pointer w-20 py-[4px] flex justify-center rounded-md text-xs'>
                                                Rejected
                                            </div>
                                        )}
                                        <p className='text-gray-400 text-xs mt-1'>On {dayjs(currentLeaveEdit?.updatedAt).format("DD MMM YYYY, HH:mm A ")}</p>
                                    </div>
                                </div>
                                <div className='flex mt-3 px-4 gap-20'>
                                    <div className=' text-xs'>
                                        <p className='text-gray-400'>PROCESSED BY</p>
                                        <p>{currentLeaveEdit?.processedBy?.username}</p>
                                    </div>
                                    <div className='text-xs'>
                                        <p className='text-gray-400'>REMARK</p>
                                        <p>{currentLeaveEdit?.remark}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </Modal>
            </div >
        </div >
    )
}

export default Request
