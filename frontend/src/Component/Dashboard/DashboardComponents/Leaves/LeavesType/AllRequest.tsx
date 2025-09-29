import { Popconfirm, Popover, Table } from 'antd'
import { useContext } from 'react';
import UserContext from '../../../../../Context/UserContext';
import dayjs, { Dayjs } from 'dayjs';
import { EllipsisVertical, PenLine, Trash2 } from 'lucide-react';
import { IleaveRequest } from '../Leaves';
import { DeleteOutlined, EditTwoTone } from '@ant-design/icons';
import { useCallApi } from '../../../../../Utlits/AxiosConifg';
import { baseURL } from '../../../../../baseURL';
import { leaveStatusEnum } from './LTEnum/LeavesTypeEnum';
import { IContext } from '../../../../../Context/UserContextInterface';

enum leaveTypeEnum {
    sickLeave,
    casualLeave
}

const AllRequest = () => {
    const { callApi } = useCallApi();
    const { leaveRequest, setIsModalOpen, setCurrentLeaveRequest, refresh, setRefresh } = useContext<IContext>(UserContext);

    const columns = [
        {
            title: 'S.No.',
            dataIndex: 'index',
            key: 'SNo.',
            render(_: any, __: any, index: number) {
                return <span>{index + 1}</span>
            }
        },
        {
            title: 'Leave Type',
            dataIndex: 'leaveType',
            key: 'leaveType',
            sorter: (a: any, b: any) => a.leaveType - b.leaveType,
            width: '15%',
            render: (item: leaveTypeEnum) => {
                let leaveType = '';
                if (item === leaveTypeEnum.sickLeave) {
                    leaveType = 'Sick Leave';
                }
                else if (item === leaveTypeEnum.casualLeave) {
                    leaveType = 'Casual Leave';
                }
                return leaveType;
            }
        },
        {
            title: 'Applied',
            dataIndex: 'createdAt',
            key: 'applied',
            width: '15%',
            sorter: (a: any, b: any) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
            render: (item: Dayjs) => {
                const date = dayjs(item).format('DD MMM YYYY');
                const time = dayjs(item).format('HH:mm A');
                return <div className='flex gap-1 items-baseline'>
                    <span>{date}</span>
                    <span className='flex text-gray-400 text-[11px] ms-1'>{time}</span>
                </div>
            }
        },
        {
            title: 'Date',
            key: 'date',
            sorter: (a: any, b: any) => dayjs(a.from).unix() - dayjs(b.from).unix(),
            width: '18%',
            render: (_: any, record: IleaveRequest) => {
                if (record?.from && record?.to) {
                    if (record.from === record.to) {
                        return <div>
                            <span>{dayjs(record.from).format('DD MMM YYYY')}</span>
                        </div>
                    }
                    const fromDate = dayjs(record.from).format('DD MMM YYYY');
                    const toDate = dayjs(record.to).format('DD MMM YYYY');
                    return <div>
                        <span>{fromDate} - {toDate}</span>
                    </div>
                }
            }
        },
        {
            title: 'Days',
            key: 'days',
            sorter: (a: any, b: any) => {
                const fromDateA = dayjs(a.from);
                const toDateA = dayjs(a.to);
                const fromDateB = dayjs(b.from);
                const toDateB = dayjs(b.to);
                const daysA = toDateA.diff(fromDateA, 'day') + 1;
                const daysB = toDateB.diff(fromDateB, 'day') + 1;
                return daysA - daysB;
            },
            width: '7%',
            render: (_: any, record: IleaveRequest) => {
                let days = 0;
                if (record?.from && record?.to) {
                    const fromDate = dayjs(record.from);
                    const toDate = dayjs(record.to);
                    days = toDate.diff(fromDate, 'day') + 1;
                }
                if (days === 0) {
                    return <span>1</span>
                }
                return <span>{days}</span>
            }
        },
        {
            title: 'Leave Reason',
            dataIndex: 'reason',
            key: 'leaveReason',
            width: '25%'
        },
        {
            title: 'Admin Note',
            key: 'adminNote',
            width: '10%',
            render: (_: any, record: IleaveRequest) => {
                if (record.remark) {
                    return <span>{record.remark}</span>
                } else {
                    return <span className='px-2'>-</span>
                }
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            render: (_: any, record: IleaveRequest) => {
                if (record?.status === leaveStatusEnum.Pending) {
                    return <div className='bg-[#FCEAD3] text-orange-900 w-20 py-[4px] flex justify-center rounded-md text-xs'>
                        Pending
                    </div>
                }
                else if (record?.status === leaveStatusEnum.Approved) {
                    return <div className='bg-[#dbfcd3] text-green-900 w-20 py-[4px] flex justify-center rounded-md text-xs'>
                        Approved
                    </div>
                }
                else if (record?.status === leaveStatusEnum.Rejected) {
                    return <div className='bg-[#fcd4d3] text-red-900 w-20 py-[4px] flex justify-center rounded-md text-xs'>
                        Rejected
                    </div>
                }
                return null;
            },
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, item: IleaveRequest) => {
                const fromDate = dayjs(item.from);
                const now = dayjs();
                const isValid = fromDate.diff(now, 'hour');
                if (isValid <= 0 || item.status !== 1) {
                    return <span className='text-gray-500 flex justify-center'></span>
                }
                return (
                    <div className='w-12 flex justify-between gap-2'>
                        <PenLine size={15} className='cursor-pointer text-gray-400' onClick={() => handleEditRequest(item)} />
                        <Popconfirm
                            title="Delete the Leave Request"
                            description="Are you sure to delete?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => handleDeleteRequest(item)}
                        >
                            <Trash2 size={15} className='mr-0.5 text-red-500 cursor-pointer' />
                        </Popconfirm>
                    </div>
                );
            }
        },

    ];

    const handleEditRequest = (item: IleaveRequest) => {
        setIsModalOpen(true);
        setCurrentLeaveRequest(item);
    }

    const handleDeleteRequest = (item: IleaveRequest) => {
        callApi({
            method: 'post',
            requestEndpoint: `${baseURL}user/deleteLeaveRequest/${item._id}`,
        }).then((response) => {
            if (response.data.success) {
                setRefresh(refresh === true ? false : true);
            } else {
                console.log(response.data.message);
            }
        }).catch((error) => {
            console.error('Error deleting leave request:', error);
        });
    }

    return (
        <div className='mt-1'>
            <Table className='my-table-styling2' columns={columns} dataSource={leaveRequest.length ? leaveRequest : []} pagination={{ pageSize: 8 }} />
        </div>
    )
}
export default AllRequest