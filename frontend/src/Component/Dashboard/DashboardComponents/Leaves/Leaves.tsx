import { PlusOutlined } from '@ant-design/icons'
import { Button, Checkbox, DatePicker, Modal, Radio, Row, Select, Skeleton } from 'antd'
import TextArea from 'antd/es/input/TextArea';
import Dragger from 'antd/es/upload/Dragger';
import imageCompression from 'browser-image-compression';
import dayjs, { Dayjs } from 'dayjs';
import { Formik, Form, FormikState } from 'formik';
import { useContext, useEffect, useRef, useState } from 'react'
import { useCallApi } from '../../../../Utlits/AxiosConifg';
import { baseURL } from '../../../../baseURL';
import AllRequest from './LeavesType/AllRequest';
import { Circle, CloudUpload } from 'lucide-react';
import UserContext from '../../../../Context/UserContext';
import { RangePickerProps } from 'antd/es/date-picker';
import { defaultLeaveRequestValues } from '../../../../Routes/AppRoutes';
import { dayTypeEnum, leaveStatusEnum, leaveTypeEnum } from './LeavesType/LTEnum/LeavesTypeEnum';
import * as yup from 'yup';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { RootState } from '../../../Redux/Store';
import { useSelector } from 'react-redux';
import { LegendComponent, TooltipComponent, GridComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { formatCounter } from 'antd/es/statistic/utils';
echarts.use([LegendComponent, TooltipComponent, TitleComponent, GridComponent, BarChart, CanvasRenderer]);

export interface IleaveRequest {
    _id?: string
    user?: {
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
    document: {
        name: string,
        document: string
    },
    status: leaveStatusEnum
    isChecked?: boolean,
    createdAt?: string,
    updatedAt?: string,
    remark?: string,
    processedBy?: string,
}

const Leaves = () => {
    const { callApi } = useCallApi();
    const chartRef = useRef(null);
    const [multipleDays, setMultipleDays] = useState<boolean>(false);
    const [enableHalfDay, setEnableHalfDay] = useState<boolean>();
    const [loading, setLoading] = useState<boolean>(true);
    const loginLoading = useSelector((state: RootState) => state.localStates.dataLoading);

    const { setLeaveRequest, setRefresh, refresh, isModalOpen, setIsModalOpen, currentLeaveRequest, setCurrentLeaveRequest, ERequstName, setERequestName } = useContext<any>(UserContext);

    let thisYearLeaves = 0;

    useEffect(() => {
        const myChart = echarts.init(chartRef.current);

        callApi({
            requestEndpoint: `${baseURL}user/getLeaveRequest`,
            method: 'post',
            body: { status: ERequstName },
        })
            .then((res) => {
                const leaveData = res.data.data;

                const monthlyLeaveCount = Array(12).fill(0);

                leaveData.forEach((request: IleaveRequest) => {
                    const month = dayjs(request.from).month();
                    monthlyLeaveCount[month] += 1;
                });

                const option = {
                    tooltip: {
                        trigger: 'item',
                        axisPointer: {
                            type: 'none',
                        },
                    },
                    title: {
                        text: 'Monthly Leave',
                        left: '20',
                        top: '7%',
                        textStyle: {
                            fontFamily: 'outfit',
                            fontSize: 18,
                            fontWeight: 'normal', 
                            color: '#333',
                        },
                    },
                    legend: {
                        top: '7%',
                        right: '5%',
                        selectedMode: false,
                        textStyle: {
                            fontFamily: 'outfit',
                            fontSize: 14,
                            color: '#333',
                        },
                        formatter: function () {
                            return 'Leaves';
                        }
                    },
                    xAxis: {
                        type: 'category',
                        data: [
                            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                        ],
                        axisLabel: {
                            fontFamily: 'Outfit',
                            fontSize: 14
                        },
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            fontFamily: 'Outfit',
                            fontSize: 14,
                        },
                        min: 0,
                        max: 24,
                    },
                    grid: {
                        top: 60,
                        left: '8%',
                        right: '8%',
                        bottom: 40,
                    },
                    series: [
                        {
                            name: 'Leaves Taken',
                            data: monthlyLeaveCount,
                            type: 'bar',
                            itemStyle: {
                                borderRadius: [3, 3, 0, 0],
                            },
                            barWidth: '30%',
                        },
                    ],
                };

                myChart.setOption(option);

                return () => {
                    myChart.dispose();
                };
            })
            .catch((err) => {
                console.error('Error fetching leave data', err);
            });
    }, [baseURL, ERequstName]);

    let leaveSchema = yup.object({
        from: yup.date()
            .required('This is required'),
        to: yup.date()
            .required('This is required'),
        reason: yup.string()
            .required('Reason is required')
            .min(5, 'Reason must be at least 5 characters'),
        document: yup.object().shape({
            name: yup.string(),
            document: yup.string(),
        })
    });


    const initialLeaveRequestValues: IleaveRequest = {
        _id: currentLeaveRequest?._id || '',
        leaveType: currentLeaveRequest?.leaveType,
        from: currentLeaveRequest?.from || null,
        to: currentLeaveRequest?.to || null,
        dayType: currentLeaveRequest?.dayType || 0,
        isFirstHalf: currentLeaveRequest?.isFirstHalf,
        isSecondHalf: currentLeaveRequest?.isSecondHalf,
        reason: currentLeaveRequest?.reason || '',
        document: currentLeaveRequest?.document || { name: '', document: '' },
        isChecked: currentLeaveRequest?.to !== currentLeaveRequest.from ? true : false || false,
        status: leaveStatusEnum.Pending

    };

    const hideModal = (resetForm: any) => {
        setIsModalOpen(false);
        resetForm();
        setCurrentLeaveRequest(defaultLeaveRequestValues);
    };

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current < dayjs().startOf('day');
    };

    useEffect(() => {
        callApi({
            requestEndpoint: `${baseURL}user/getLeaveRequest`, method: 'post', body: { status: ERequstName }
        }).then((res) => {
            setLeaveRequest(res.data.data);
            setLoading(false);
            currentLeaveRequest.dayType === 1 ? setEnableHalfDay(true) : setEnableHalfDay(false);
        }).catch((err) => {
            console.log('Error', err);
        });
    }, [refresh, ERequstName, currentLeaveRequest, isModalOpen, loginLoading]);


    return (
        <div>
            <div className='flex justify-end px-2'>
                <Button className='themed-bt mt-1' onClick={() => setIsModalOpen(true)}><PlusOutlined />Leave</Button>
                <Formik
                    initialValues={initialLeaveRequestValues}
                    enableReinitialize
                    validationSchema={leaveSchema}
                    onSubmit={async (values: IleaveRequest, { resetForm }: any) => {
                        if (currentLeaveRequest === defaultLeaveRequestValues) {
                            callApi({ requestEndpoint: `${baseURL}user/leaveRequest`, method: 'post', body: values }).then((res) => {
                                setRefresh((prev: boolean) => !prev);
                                setCurrentLeaveRequest(defaultLeaveRequestValues);
                                resetForm();
                            }).catch((err) => {
                                console.log('Error', err);
                            })
                        } else {
                            callApi({ requestEndpoint: `${baseURL}user/updateLeaveRequest/${currentLeaveRequest._id}`, method: 'post', body: values }).then((res) => {
                                setRefresh((prev: boolean) => !prev);
                                setCurrentLeaveRequest(defaultLeaveRequestValues);
                                resetForm();
                                setIsModalOpen(false);
                            }
                            ).catch((err) => {
                                console.log('Error', err);
                            });
                        }
                        setIsModalOpen(false);
                        setEnableHalfDay(false);
                    }}
                >
                    {({ values, setFieldValue, resetForm, errors, touched }) => {
                        const handleImageUpload = async (doc: any) => {
                            try {
                                let file;
                                if (doc && doc.file) {
                                    file = doc.file.originFileObj;
                                }
                                else if (doc && doc.target && doc.target.files) {
                                    file = doc.target.files[0];
                                }
                                if (!file) {
                                    alert("No file selected.");
                                    return;
                                }
                                const options = {
                                    maxSizeMB: 1,
                                    maxWidthOrHeight: 250
                                };
                                const compressedFile = await imageCompression(file, options);

                                const reader = new FileReader();
                                reader.onload = async () => {
                                    const base64Image = {
                                        document: reader.result,
                                        name: doc.file.name
                                    }
                                    setFieldValue('document', base64Image)
                                };
                                reader.readAsDataURL(compressedFile);

                            } catch (error) {
                                console.error("Error during image upload:", error);
                                alert("An error occurred while uploading the image.");
                            }
                        }
                        return (
                            <Modal
                                title="Apply Leave"
                                closable={{ 'aria-label': 'Custom Close Button' }}
                                style={{ fontFamily: 'Outfit' }}
                                open={isModalOpen}
                                onCancel={() => hideModal(resetForm)}
                                footer={null}
                                destroyOnHidden
                            >
                                <Form>
                                    <div>
                                        <div className='flex flex-col my-3'>
                                            <label htmlFor="">
                                                Leave Type
                                            </label>

                                            <Select
                                                value={values.leaveType}
                                                onChange={(value) => setFieldValue('leaveType', value)}
                                                className='w-60 mt-1'
                                                placeholder="Select Leave Type"
                                            >
                                                <Select.Option value={0}>Sick Leave</Select.Option>
                                                <Select.Option value={1}>Casual Leave</Select.Option>
                                            </Select>
                                        </div>
                                        <div className='flex flex-col my-3'>
                                            <label htmlFor="">Date</label>
                                            {
                                                !multipleDays && !values.isChecked ? (
                                                    <div>

                                                        <DatePicker
                                                            disabledDate={disabledDate}
                                                            className="w-44 mt-1"
                                                            value={values.from ? dayjs(values.from) : null}
                                                            onChange={(date) => {
                                                                const formatted = dayjs(date);
                                                                setFieldValue('from', formatted);
                                                                setFieldValue('to', formatted);
                                                            }}
                                                        />
                                                        {(errors.from && touched.from) ? (
                                                            <div className='text-red-500 text-sm mt-1'>{errors.from}</div>
                                                        ) : null}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <DatePicker.RangePicker
                                                            disabledDate={disabledDate}
                                                            className="w-60 mt-1"
                                                            value={
                                                                values.from && values.to
                                                                    ? [dayjs(values.from), dayjs(values.to)]
                                                                    : null
                                                            }
                                                            onChange={(dates) => {
                                                                const from = dates?.[0] ? dayjs(dates[0]) : '';
                                                                const to = dates?.[1] ? dayjs(dates[1]) : '';
                                                                setFieldValue('from', from);
                                                                setFieldValue('to', to);
                                                            }}
                                                        />
                                                        {errors.from && touched.from ? (
                                                            <div className='text-red-500 text-sm mt-1'>{errors.from}</div>
                                                        ) : null
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <div className='flex gap-2 my-2'>
                                            <Checkbox
                                                type='checkbox'
                                                value={values.isChecked}
                                                onChange={(e: any) => {
                                                    setMultipleDays(e.target.checked);
                                                    setFieldValue('isChecked', e.target.checked);
                                                    e.target.checked ? setFieldValue('to', '') : setFieldValue('to', values.from)
                                                }}
                                            />
                                            <label htmlFor="">Select for Multiple days</label>
                                        </div>
                                        {multipleDays === false ?
                                            <div className='flex flex-col gap-1 my-3'>
                                                <label htmlFor="">Day Type</label>
                                                <div className='flex gap-2'>
                                                    <Radio.Group value={values.dayType === 1 ? 1 : 0} buttonStyle='solid'>
                                                        <Radio.Button onClick={() => setEnableHalfDay(false)} onChange={(e) => { setFieldValue('dayType', e.target.value); setFieldValue('isFirstHalf', false); setFieldValue('isSecondHalf', false) }} type='primary' value={0}>Full Day</Radio.Button>
                                                        <Radio.Button onClick={() => setEnableHalfDay(true)} onChange={(e) => { setFieldValue('dayType', e.target.value); setFieldValue('isFirstHalf', true) }} type='primary' value={1}>Half Day</Radio.Button>
                                                    </Radio.Group>
                                                    {enableHalfDay ?
                                                        <Radio.Group buttonStyle='solid' defaultValue={values.dayType === 1 && values.isFirstHalf === true ? '1stHalf' : '2ndHalf'} onChange={(e) => {
                                                            e.target.value === '1stHalf' ? (setFieldValue('isFirstHalf', true), setFieldValue('isSecondHalf', false)) : setFieldValue('isFirstHalf', false)
                                                            e.target.value === '2ndHalf' ? (setFieldValue('isSecondHalf', true), setFieldValue('isFirstHalf', false)) : setFieldValue('isSecondHalf', false)
                                                        }
                                                        }>
                                                            <Radio.Button value={'1stHalf'}>1st Half</Radio.Button>
                                                            <Radio.Button value={'2ndHalf'}>2nd Half</Radio.Button>
                                                        </Radio.Group>
                                                        : null}
                                                </div>
                                            </div>
                                            : null}
                                        <div className='my-3 flex flex-col gap-1'>
                                            <label htmlFor="">Reason</label>
                                            <TextArea
                                                placeholder="Reason for Leave"
                                                autoSize={{ minRows: 3, maxRows: 5 }}
                                                value={values.reason}
                                                onChange={(e: any) => setFieldValue('reason', e.target.value)}
                                            />
                                            {errors.reason && touched.reason ? (
                                                <div className='text-red-500 text-sm mt-1'>{errors.reason}</div>
                                            ) : null}
                                        </div>
                                        <div className='my-3 flex flex-col gap-1'>
                                            <label htmlFor="">Document </label>
                                            <Dragger onChange={handleImageUpload}>
                                                <p className="flex justify-center text-gray-400">
                                                    <CloudUpload />
                                                </p>
                                                <p className="ant-upload-text font-[Outfit]">Drag and Drop or <span className='text-blue-600 underline'>Click to upload</span></p>
                                            </Dragger>
                                            <input
                                                className='hidden'
                                                id="file-upload"
                                                type='file'
                                                accept="image/*"
                                                name="image"
                                                onChange={handleImageUpload}
                                            />
                                        </div>
                                        <div className='flex justify-end gap-2'>
                                            <Button onClick={() => hideModal(resetForm)}>Cancel</Button>
                                            <button type='submit' className='flex bg-blue-600 text-white px-3 py-1 rounded-md'>{currentLeaveRequest._id === '' ? 'Add Leave Request' : 'Update Leave Request'}</button>
                                        </div>
                                    </div>
                                </Form>
                            </Modal>)
                    }}
                </Formik>
            </div>
            <div className="flex justify-center bg-[#f0f3f8] rounded-xl w-full my-4 gap-4 p-4">
                <div className="flex items-center flex-col justify-center gap-4">
                    <div className="bg-white flex flex-col gap-2 w-64 text-center py-3.5 rounded-lg">
                        <p className="text-2xl">{'12 / 12'}</p>
                        <p className="flex bg-yellow-50 rounded-lg mx-3 my-1 flex justify-center items-center gap-2 px-4 py-1.5 text-sm">
                            <Circle className="text-yellow-500" size={12} />
                            Paid Available / Allotted
                        </p>
                    </div>
                    <div className="bg-white flex flex-col gap-2 w-64 text-center py-3.5 rounded-lg">
                        <p className="text-2xl">{thisYearLeaves}</p>
                        <p className="flex bg-purple-50 rounded-lg mx-3 my-1 flex justify-center items-center gap-2 px-4 py-1.5 text-sm">
                            <Circle className="text-purple-500" size={12} />
                            Leave Taken
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-center w-[45%]">
                    <div
                        className="bg-white rounded-xl py-4"
                        ref={chartRef}
                        style={{ width: '100%', height: '230px', padding: 0, margin: 0 }}
                        id="main"
                    ></div>
                </div>
            </div>

            {loading == false ?
                (<div className='flex flex-col gap-2'>
                    <div className='flex gap-2'>
                        <Button className={ERequstName === leaveStatusEnum.All ? 'text-blue-700 border-blue-700' : 'hover:text-blue-500'} onClick={() => setERequestName(leaveStatusEnum.All)}>All</Button>
                        <Button className={ERequstName === leaveStatusEnum.Pending ? 'text-blue-700 border-blue-700' : 'hover:text-blue-500'} onClick={() => setERequestName(leaveStatusEnum.Pending)}>Pending</Button>
                        <Button className={ERequstName === leaveStatusEnum.Approved ? 'text-blue-700 border-blue-700' : 'hover:text-blue-500'} onClick={() => setERequestName(leaveStatusEnum.Approved)}>Approved</Button>
                        <Button className={ERequstName === leaveStatusEnum.Rejected ? 'text-blue-700 border-blue-700' : 'hover:text-blue-500'} onClick={() => setERequestName(leaveStatusEnum.Rejected)}>Rejected</Button>
                    </div>
                    <AllRequest />
                </div>) :
                (<div className='flex flex-col'>
                    <div className='flex gap-2'>
                        <Skeleton.Button active size="default" style={{ width: 60 }} />
                        <Skeleton.Button active size="default" style={{ width: 80 }} />
                        <Skeleton.Button active size="default" style={{ width: 90 }} />
                        <Skeleton.Button active size="default" style={{ width: 90 }} />
                    </div>
                    <div className="mt-4">
                        {/* <Skeleton
                            active
                            title={false}
                            paragraph={{ rows: 7, width: '100%' }}
                        /> */}
                    </div>
                </div>)}
        </div >
    )
}

export default Leaves