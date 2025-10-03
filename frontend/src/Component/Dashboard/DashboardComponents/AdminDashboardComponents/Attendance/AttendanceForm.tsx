import { PlusOutlined } from '@ant-design/icons'
import { Button, Checkbox, DatePicker, Modal, Radio, Row, Select, Skeleton, TimePicker } from 'antd'
import { RangePickerProps } from 'antd/es/date-picker';
import TextArea from 'antd/es/input/TextArea';
import Dragger from 'antd/es/upload/Dragger';
import imageCompression from 'browser-image-compression';
import dayjs, { Dayjs } from 'dayjs';
import { Formik, Form } from 'formik';
import { CloudUpload, Cross, MSquare, X } from 'lucide-react';
import { useContext, useEffect, useState } from 'react'
import * as yup from 'yup';
import { baseURL } from '../../../../../baseURL';
import UserContext from '../../../../../Context/UserContext';
import { defaultLeaveRequestValues } from '../../../../../Routes/AppRoutes';
import { useCallApi } from '../../../../../Utlits/AxiosConifg';
import AllRequest from '../../Leaves/LeavesType/AllRequest';
import { leaveTypeEnum, dayTypeEnum, leaveStatusEnum } from '../../Leaves/LeavesType/LTEnum/LeavesTypeEnum';
import { IContext } from '../../../../../Context/UserContextInterface';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../Redux/Store';
import Attendance from './Attendance';

enum EAttendanceStatus {
    PunchTime,
    Present,
    HalfDay,
    Leave
}

export interface IReportsData {
    _id?: string
    attendanceStatus: EAttendanceStatus | undefined,
    leaveType: leaveTypeEnum | undefined,
    from: Dayjs | null | undefined,
    to: Dayjs | null | undefined,
    dayType: dayTypeEnum,
    punchTime: Dayjs[],
    isFirstHalf: boolean,
    isSecondHalf: boolean,
    remark: string,
    document: {
        name: string,
        document: string
    },
    month: string,
    year: number,
    status: leaveStatusEnum
    isChecked?: boolean,
    createdAt?: string,
    updatedAt?: string,
    processedBy?: string,
}

const AttendanceForm = () => {
    const { callApi } = useCallApi();
    const [multipleDays, setMultipleDays] = useState<boolean>(false);
    const [enableHalfDay, setEnableHalfDay] = useState<boolean>();
    const [loading, setLoading] = useState<boolean>(true);
    const { setLeaveRequest, currentLeaveRequest, setCurrentLeaveRequest, ERequstName, setIsAttendanceFormModalOpen, isAttendanceFormModalOpen } = useContext<IContext>(UserContext);
    const currentReportDate = useSelector((state: RootState) => state.localStates.currentReportDate);
    const SelectedUser = useSelector((state: RootState) => state.localStates.selectedUser);

    const dispatch = useDispatch();

    let leaveSchema = yup.object({
        from: yup.date()
            .required('This is required'),
        document: yup.object().shape({
            name: yup.string(),
            document: yup.string(),
        })
    });
    const initialLeaveRequestValues: IReportsData = {
        _id: currentLeaveRequest?._id || '',
        leaveType: currentLeaveRequest?.leaveType,
        attendanceStatus: EAttendanceStatus.PunchTime,
        from: currentReportDate?.date || null,
        to: currentLeaveRequest?.to ? currentLeaveRequest.to : currentReportDate?.date || null,
        dayType: currentLeaveRequest?.dayType || 0,
        isFirstHalf: currentLeaveRequest?.isFirstHalf,
        isSecondHalf: currentLeaveRequest?.isSecondHalf,
        remark: currentLeaveRequest?.remark || '',
        document: currentLeaveRequest?.document || { name: '', document: '' },
        isChecked: currentLeaveRequest?.to !== currentLeaveRequest.from ? true : false || false,
        status: leaveStatusEnum.Pending,
        month: dayjs(currentReportDate.date).format('M'),
        year: dayjs(currentReportDate.date).year(),
        punchTime: []
    };

    const hideModal = (resetForm: any) => {
        setIsAttendanceFormModalOpen(false);
        resetForm();
        setCurrentLeaveRequest(defaultLeaveRequestValues);
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
    }, [ERequstName, currentLeaveRequest, isAttendanceFormModalOpen]);

    return (
        <div className='w-100%'>
            <div>
                <Formik
                    initialValues={initialLeaveRequestValues}
                    enableReinitialize
                    validationSchema={leaveSchema}
                    onSubmit={async (values: IReportsData, { resetForm }: any) => {
                        if (values.attendanceStatus === EAttendanceStatus.Leave) {
                            const LeavesFinalValues = {
                                user: {
                                    userId: SelectedUser?._id,
                                    username: SelectedUser?.username
                                },
                                leaveType: values.leaveType,
                                from: currentReportDate.date || values.from,
                                to: currentReportDate.date || values.to,
                                dayType: values.dayType,
                                isFirstHalf: values.isFirstHalf,
                                isSecondHalf: values.isSecondHalf,
                                reason: values.remark,
                                status: leaveStatusEnum.Pending,
                            }
                            callApi({ requestEndpoint: `${baseURL}user/leaveRequest`, method: 'post', body: LeavesFinalValues }).then((res) => {
                                resetForm();

                            }).catch((err) => {
                                console.log('Error', err);
                            })
                        }
                        const finalValues = {
                            _id: SelectedUser?._id,
                            attStatus: values.status,
                            from: currentReportDate.date,
                            to: values.to,
                            dayTrans: values.attendanceStatus === EAttendanceStatus.Present ?
                                [dayjs(currentReportDate.date).set('hour', 10).set('minute', 0), dayjs(currentReportDate.date).set('hour', 20).set('minute', 0)]
                                : values.punchTime,
                            month: values.month,
                            year: values.year,
                            remark: values.remark,
                        }
                        callApi({ requestEndpoint: `${baseURL}user/updateuserReports`, method: 'post', body: finalValues }).then((res) => {
                            console.log(res)
                        })
                        resetForm();
                        setIsAttendanceFormModalOpen(false);
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
                            <Form>
                                <div>
                                    <div className='bg-gray-100 text-xs text-gray-400 py-3.5 mb-2'>
                                        <span className='flex justify-end px-2'>
                                            {dayjs(currentReportDate.date).isValid() ?
                                                dayjs(currentReportDate.date).format("DD MMM") :
                                                "Invalid date"}
                                            , Shift (10:00AM-08:00PM)
                                        </span>
                                    </div>
                                    <div className='flex gap-3'>
                                        <div className='flex flex-col'>
                                            <label className="text-xs font-medium" htmlFor="">Attendance Status</label>
                                            <Select
                                                value={values.attendanceStatus !== undefined
                                                    ? values.attendanceStatus
                                                    : (currentReportDate.status === 1
                                                        ? 1
                                                        : currentReportDate.status === 3
                                                            ? 3
                                                            : 0)}
                                                onChange={(value) => { setFieldValue('attendanceStatus', value), values.attendanceStatus !== 2 && setEnableHalfDay(false), values.attendanceStatus === 3 && setFieldValue('dayType', 0) }}
                                                className='w-52 mt-1'
                                            >
                                                {!values.isChecked && <Select.Option value={0}>Punch Time</Select.Option>}
                                                <Select.Option value={1}>Present</Select.Option>
                                                <Select.Option value={3}>Leave</Select.Option>
                                            </Select>
                                        </div>


                                        <div>
                                            <div className='flex flex-col mb-2'>
                                                <label className="text-xs font-medium" htmlFor="">Attendance Date</label>
                                                {
                                                    !multipleDays && !values.isChecked ? (
                                                        <div>
                                                            <DatePicker
                                                                disabledDate={(current) => {
                                                                    if (values.attendanceStatus === EAttendanceStatus.Present) {
                                                                        return current && current > dayjs().endOf('month');
                                                                    }
                                                                    return false;
                                                                }}
                                                                format={'DD/MM/YYYY'}
                                                                className="w-38 mt-1"
                                                                value={values.from ? dayjs(values.from) : null}
                                                                onChange={(date) => {
                                                                    if (date) {
                                                                        const selected = dayjs(date);
                                                                        setFieldValue('from', selected);
                                                                        setFieldValue('to', selected);
                                                                    }
                                                                }}
                                                            />
                                                            {(errors.from && touched.from) ? (
                                                                <div className='text-red-500 text-sm mt-1'>{errors.from}</div>
                                                            ) : null}
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <DatePicker.RangePicker
                                                                disabledDate={(current) => {
                                                                    if (values.attendanceStatus === EAttendanceStatus.Present) {
                                                                        return current && current > dayjs().endOf('month');
                                                                    }
                                                                    return false;
                                                                }}
                                                                className="w-62 mt-1"
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
                                                                    console.log(to, from)
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
                                            <div className='flex items-center gap-2'>
                                                <Checkbox
                                                    disabled={values.attendanceStatus === 0 || values.attendanceStatus === 2}
                                                    type='checkbox'
                                                    value={values.isChecked}
                                                    onChange={(e: any) => {
                                                        setMultipleDays(e.target.checked);
                                                        setFieldValue('isChecked', e.target.checked);
                                                        e.target.checked ? setFieldValue('to', '') : setFieldValue('to', values.from)
                                                    }}
                                                />
                                                <label className="text-xs font-medium" htmlFor="">Select for Multiple days</label>
                                            </div>
                                        </div>
                                    </div>
                                    {values.attendanceStatus === 0 && (
                                        <div className='flex flex-col gap-1'>
                                            <label className="text-xs font-medium">Punch Time</label>
                                            <TimePicker
                                                className='w-32'
                                                format="h:mm a"
                                                onChange={(time) => {
                                                    if (time) {
                                                        const combinedDateTime = currentReportDate.date
                                                            .set('hour', time.hour())
                                                            .set('minute', time.minute())
                                                            .set('second', time.second());

                                                        setFieldValue('punchTime', [...values.punchTime, combinedDateTime]);

                                                        console.log("Updated Date and Time:", combinedDateTime.format("YYYY-MM-DD HH:mm:ss"));
                                                        console.log("Punch Time Values:", values.punchTime);
                                                    }
                                                }}
                                            />
                                            <div className='flex flex-wrap gap-2'>
                                                {values.punchTime.map((time, index) => (
                                                    <span key={index} className='flex gap-2 items-center justify-center px-2 mt-1 w-32 rounded-sm bg-blue-100 text-blue-600'>
                                                        <span>
                                                            {dayjs(time).format('h:mm:ss A')}
                                                        </span>
                                                        <span
                                                            className='cursor-pointer'
                                                            onClick={() => {
                                                                const updatedPunchTime = values.punchTime.filter((t, i) => i !== index);
                                                                setFieldValue('punchTime', updatedPunchTime);
                                                            }}
                                                        >
                                                            <X size={16} />
                                                        </span>
                                                    </span>
                                                ))}
                                            </div>

                                        </div>
                                    )}
                                    {values.attendanceStatus === 3 &&
                                        <div className='flex flex-col'>
                                            <label className="text-xs font-medium" htmlFor="">
                                                Leave Type
                                            </label>

                                            <Select
                                                value={values.leaveType}
                                                onChange={(value) => setFieldValue('leaveType', value)}
                                                className='w-52 mt-1'
                                                placeholder="Select Leave Type"
                                            >
                                                <Select.Option value={0}>Sick Leave</Select.Option>
                                                <Select.Option value={1}>Casual Leave</Select.Option>
                                            </Select>
                                        </div>
                                    }
                                    {multipleDays === false ?
                                        <div className='flex flex-col gap-1'>
                                            <div className={`${enableHalfDay ? "flex gap-[162px] mt-1" : " mt-1"}`}>
                                                {values.attendanceStatus === 3 && <label className="text-xs font-medium" htmlFor="">Day Type</label>}
                                                {values.attendanceStatus === 2 || enableHalfDay ? <label className="text-xs font-medium" htmlFor="">Half Day Type</label> : ''}
                                            </div>
                                            <div className='flex gap-2'>
                                                {values.attendanceStatus === 3 &&
                                                    <Radio.Group value={values.dayType === 1 ? 1 : 0} buttonStyle='solid'>
                                                        <Radio.Button className='w-[104px] text-center' onClick={() => setEnableHalfDay(false)} onChange={(e) => { setFieldValue('dayType', e.target.value); setFieldValue('isFirstHalf', false); setFieldValue('isSecondHalf', false) }} type='primary' value={0}>Full Day</Radio.Button>
                                                        <Radio.Button className='w-[104px] text-center' onClick={() => setEnableHalfDay(true)} onChange={(e) => { console.log(e.target.value), setFieldValue('dayType', e.target.value); setFieldValue('isFirstHalf', true) }} type='primary' value={1}>Half Day</Radio.Button>
                                                    </Radio.Group>
                                                }
                                                {enableHalfDay || values.attendanceStatus === 2 ?
                                                    <Radio.Group buttonStyle='solid' defaultValue={values.dayType === 1 && values.isFirstHalf === true ? '1stHalf' : '2ndHalf'} onChange={(e) => {
                                                        e.target.value === '1stHalf' ? (setFieldValue('isFirstHalf', true), setFieldValue('isSecondHalf', false)) : setFieldValue('isFirstHalf', false)
                                                        e.target.value === '2ndHalf' ? (setFieldValue('isSecondHalf', true), setFieldValue('isFirstHalf', false)) : setFieldValue('isSecondHalf', false)
                                                    }
                                                    }>
                                                        <Radio.Button className='w-[104px] text-center' value={'1stHalf'}>1st Half</Radio.Button>
                                                        <Radio.Button className='w-[104px] text-center' value={'2ndHalf'}>2nd Half</Radio.Button>
                                                    </Radio.Group>
                                                    : null}
                                            </div>
                                        </div>
                                        : null}
                                    <div className='my-1 lex flex-col gap-2'>
                                        <label className="text-xs font-medium" htmlFor="">Remark</label>
                                        <TextArea
                                            placeholder="Remark"
                                            autoSize={{ minRows: 1.8, maxRows: 5 }}
                                            value={values.remark}
                                            onChange={(e: any) => setFieldValue('remark', e.target.value)}
                                            className='mt-1 custom-textarea'
                                            style={{ height: '20px' }}
                                        />
                                        {errors.remark && touched.remark ? (
                                            <div className='text-red-500 text-sm mt-1'>{errors.remark}</div>
                                        ) : null}
                                    </div>
                                    {values.attendanceStatus === 3 || values.attendanceStatus === 2 ?
                                        <div className='my-1 flex flex-col gap-1'>
                                            <label className="text-xs font-medium" htmlFor="">Document </label>
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
                                        : null}
                                    <div className='flex justify-end gap-2 mt-5'>
                                        <Button onClick={() => hideModal(resetForm)}>Cancel</Button>
                                        <button type='submit' className='flex bg-blue-600 text-white px-3 py-1 rounded-md'>Save</button>
                                    </div>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div >
    )
}

export default AttendanceForm