import express, { Response } from 'express';
import { Attendances, EReportsStatus, ReportsModel } from "../Models/ReportModel";
import dayjs, { Dayjs } from 'dayjs';
import { dayTypeEnum, LeaveModel, leaveStatusEnum } from '../Models/LeavesModel';
import isBetween from 'dayjs/plugin/isBetween';
import duration from 'dayjs/plugin/duration';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isBetween, duration);
dayjs.extend(isSameOrBefore);

// export const getReports = async (req: any, res: Response) => {
//     const LoggedUserId = req.user?._id;
//     const { currentMonth, currentYear, id } = req.body;
//     const userId = LoggedUserId === id ? LoggedUserId : id;
//     try {
//         const existingReport = await ReportsModel.findOne({ userId, month: currentMonth, year: currentYear });
//         const getLeaves = await LeaveModel.find({ "User.userId": id });
//         if (!existingReport) {
//             const currentDate = dayjs().month(currentMonth - 1).year(currentYear).startOf('month');
//             const totalDays = currentDate.daysInMonth();
//             const arr: Attendances[] = [];

//             for (let day = 1; day <= totalDays; day++) {
//                 const dateObj = currentDate.date(day);
//                 const dayOfWeek = dateObj.day();
//                 let isLeave = false;
//                 let isHalfLeave = false;
//                 getLeaves.forEach((leave) => {
//                     if (leave.status === leaveStatusEnum.approved) {
//                         if (dayjs(dateObj).isBetween(dayjs(leave.from), dayjs(leave.to), null, '[]')) {
//                             if (leave.dayType === dayTypeEnum.fullDay) {
//                                 isLeave = true;
//                             } else if (leave.dayType === dayTypeEnum.halfDay) {
//                                 isHalfLeave = true;
//                             }
//                         }
//                     }
//                 });

//                 const getStatus = (dayOfWeek: number, isLeave: boolean, isHalfLeave: boolean) => {
//                     if (dayOfWeek === 0 || dayOfWeek === 6) {
//                         return EReportsStatus.WeekOff;
//                     } else if (isLeave) {
//                         return EReportsStatus.FullLeave;
//                     } else if (isHalfLeave) {
//                         return EReportsStatus.HalfLeave;
//                     }
//                     else {
//                         return EReportsStatus.Absent;
//                     }
//                 };

//                 const dayAttendance = {
//                     date: dateObj.toISOString(),
//                     dayTrans: [],
//                     status: getStatus(dayOfWeek, isLeave, isHalfLeave)
//                 };
//                 arr.push(dayAttendance);
//             }

//             const newReport = await ReportsModel.create({
//                 userId,
//                 attendances: arr,
//                 month: currentMonth,
//                 year: currentYear,
//                 workingHours: '0',
//                 shortHours: '0',
//                 onTime: false
//             });

//             return res.status(200).json({ success: true, data: newReport });
//         }

//         const calculateHours = (dayTrans: string[]) => {
//             const shiftStartTime = dayjs(dayTrans[0]).set('hour', 10).set('minute', 0).set('second', 0);
//             const shiftEndTime = dayjs(dayTrans[0]).set('hour', 20).set('minute', 0).set('second', 0);
//             const requiredHours = shiftEndTime.diff(shiftStartTime, 'hour', true);
//             let totalWorkingHours = 0;
//             if (dayTrans.length > 1) {
//                 for (let i = 0; i < dayTrans.length; i += 2) {
//                     const from = dayjs(dayTrans[i]);
//                     const to = dayjs(dayTrans[i + 1]);
//                     totalWorkingHours += to.diff(from, 'hour', true);
//                 }
//                 return {
//                     workingHours: totalWorkingHours,
//                     shortHours: Math.max(0, requiredHours - totalWorkingHours),
//                     extraHours: Math.max(0, totalWorkingHours - requiredHours),
//                     requiredHours,
//                     onTime: dayjs(dayTrans[0]).isSameOrBefore(shiftStartTime, 'minutes'),
//                 };
//             }
//             else {
//                 return {
//                     workingHours: totalWorkingHours,
//                     shortHours: Math.max(0, requiredHours - totalWorkingHours),
//                     extraHours: Math.max(0, totalWorkingHours - requiredHours),
//                     requiredHours,
//                     onTime: dayjs(dayTrans[0]).isSameOrBefore(shiftStartTime, 'minutes')
//                 }
//             }
//         };

//         let totalMonthPresent = 0;
//         let totalMonthAbsent = 0;
//         let totalMonthLeaveToken = 0;
//         let totalMonthOnTime = 0;
//         let totalMonthNotOnTime = 0;
//         let totalMonthWokringHours = 0;
//         let totalMonthShortHours = 0;

//         const updatedAttendances = existingReport.attendances.map(att => {
//             const plainAtt = JSON.parse(JSON.stringify(att));
//             att.status === EReportsStatus.FullLeave && (totalMonthLeaveToken++);
//             att.status === EReportsStatus.HalfLeave && (totalMonthLeaveToken += 0.5);
//             dayjs().isAfter(att.date) && att.status === EReportsStatus.Absent && (totalMonthAbsent += 1)

//             if (att.dayTrans.length > 0) {
//                 const computed = calculateHours(att.dayTrans);
//                 if (att.status === EReportsStatus.Present) {
//                     totalMonthPresent++;
//                     totalMonthWokringHours += computed.workingHours;
//                     totalMonthShortHours += computed.shortHours;
//                 }
//                 if (computed.onTime === true) {
//                     totalMonthOnTime++;
//                 } else {
//                     totalMonthNotOnTime++;
//                 }
//                 return { ...plainAtt, ...computed };
//             }
//             return plainAtt;
//         });


//         return res.status(200).json({
//             success: true,
//             data: {
//                 ...existingReport.toObject(),
//                 attendances: updatedAttendances,
//                 dayRecords: {
//                     totalMonthPresent,
//                     totalMonthAbsent,
//                     totalMonthLeaveToken,
//                     totalMonthOnTime,
//                     totalMonthNotOnTime,
//                     totalMonthWokringHours,
//                     totalMonthShortHours,
//                 }
//             }
//         });

//     } catch (error) {
//         console.error("Error:", error);
//         return res.status(500).json({ success: false, error: 'Server error' });
//     }
// };

export const getReports = async (req: any, res: Response) => {
    const LoggedUserId = req.user?._id;
    const { currentMonth, currentYear, id } = req.body;
    const userId = LoggedUserId === id ? LoggedUserId : id;
    try {
        const existingReport = await ReportsModel.findOne({ userId, month: currentMonth, year: currentYear });
        const getLeaves = await LeaveModel.find({ "User.userId": id });

        let totalMonthPresence = 0;
        let totalMonthAbsent = 0;
        let totalMonthLeaveToken = 0;
        let totalMonthOnTime = 0;
        let totalMonthNotOnTime = 0;
        let totalMonthWokringHours = 0;
        let totalMonthShortHours = 0;

        const calculateHours = (dayTrans: string[]) => {
            const shiftStartTime = dayjs(dayTrans[0]).set('hour', 10).set('minute', 0).set('second', 0);
            const shiftEndTime = dayjs(dayTrans[0]).set('hour', 20).set('minute', 0).set('second', 0);
            const requiredHours = shiftEndTime.diff(shiftStartTime, 'hour', true);
            let totalWorkingHours = 0;
            if (dayTrans.length > 1) {
                for (let i = 0; i < dayTrans.length; i += 2) {
                    const from = dayjs(dayTrans[i]);
                    const to = dayjs(dayTrans[i + 1]);
                    totalWorkingHours += to.diff(from, 'hour', true);
                }
                return {
                    workingHours: totalWorkingHours,
                    shortHours: Math.max(0, requiredHours - totalWorkingHours),
                    extraHours: Math.max(0, totalWorkingHours - requiredHours),
                    requiredHours,
                    onTime: dayjs(dayTrans[0]).isSameOrBefore(shiftStartTime, 'minutes'),
                };
            }
            else {
                return {
                    workingHours: totalWorkingHours,
                    shortHours: Math.max(0, requiredHours - totalWorkingHours),
                    extraHours: Math.max(0, totalWorkingHours - requiredHours),
                    requiredHours,
                    onTime: dayjs(dayTrans[0]).isSameOrBefore(shiftStartTime, 'minutes')
                }
            }
        };

        if (!existingReport) {
            const currentDate = dayjs().month(currentMonth - 1).year(currentYear).startOf('month');
            const totalDays = currentDate.daysInMonth();
            const arr: Attendances[] = [];

            for (let day = 1; day <= totalDays; day++) {
                const dateObj = currentDate.date(day);
                const dayOfWeek = dateObj.day();
                let isLeave = false;
                let isHalfLeave = false;

                getLeaves.forEach((leave) => {
                    if (leave.status === leaveStatusEnum.approved) {
                        if (dayjs(dateObj).isBetween(dayjs(leave.from), dayjs(leave.to), null, '[]')) {
                            if (leave.dayType === dayTypeEnum.fullDay) {
                                isLeave = true;
                            } else if (leave.dayType === dayTypeEnum.halfDay) {
                                isHalfLeave = true;
                            }
                        }
                    }
                });

                const getStatus = (dayOfWeek: number, isLeave: boolean, isHalfLeave: boolean) => {
                    if (dayOfWeek === 0 || dayOfWeek === 6) {
                        return EReportsStatus.WeekOff;
                    } else if (isLeave) {
                        return EReportsStatus.FullLeave;
                    } else if (isHalfLeave) {
                        return EReportsStatus.HalfLeave;
                    }
                    return EReportsStatus.Absent;
                };

                const dayAttendance = {
                    date: dateObj.toISOString(),
                    dayTrans: [],
                    status: getStatus(dayOfWeek, isLeave, isHalfLeave)
                };

                arr.push(dayAttendance);

                if (dayAttendance.status === EReportsStatus.Present) {
                    totalMonthPresence++;
                } else if (dayAttendance.status === EReportsStatus.Absent && dateObj.isBefore(dayjs())) {
                    totalMonthAbsent++;
                } else if (dayAttendance.status === EReportsStatus.FullLeave || dayAttendance.status === EReportsStatus.HalfLeave) {
                    totalMonthLeaveToken += (dayAttendance.status === EReportsStatus.FullLeave ? 1 : 0.5);
                }
            }

            const newReport = await ReportsModel.create({
                userId,
                attendances: arr,
                month: currentMonth,
                year: currentYear,
                workingHours: '0',
                shortHours: '0',
                onTime: false
            });

            return res.status(200).json({
                success: true,
                data: {
                    ...newReport.toObject(),
                    attendances: arr,
                    dayRecords: {
                        totalMonthPresence,
                        totalMonthAbsent,
                        totalMonthLeaveToken,
                        totalMonthOnTime: 0,
                        totalMonthNotOnTime: 0,
                        totalMonthWokringHours: 0,
                        totalMonthShortHours: 0,
                    }
                }
            });
        }

        const updatedAttendances = existingReport.attendances.map(att => {
            const plainAtt = JSON.parse(JSON.stringify(att));

            let isLeave = false;
            let isHalfLeave = false;

            getLeaves.forEach(leave => {
                if (leave.status === leaveStatusEnum.approved) {
                    if (dayjs(att.date).isBetween(dayjs(leave.from), dayjs(leave.to), "day", '[]')) {
                        if (leave.dayType === dayTypeEnum.fullDay) {
                            isLeave = true;
                        } else if (leave.dayType === dayTypeEnum.halfDay) {
                            isHalfLeave = true;
                        }
                    }
                }
            });

            if (isLeave) {
                plainAtt.status = EReportsStatus.FullLeave;
            } else if (isHalfLeave) {
                plainAtt.status = EReportsStatus.HalfLeave;
            }

            if (plainAtt.status === EReportsStatus.FullLeave) totalMonthLeaveToken++;
            if (plainAtt.status === EReportsStatus.HalfLeave) totalMonthLeaveToken += 0.5;
            if (dayjs().isAfter(plainAtt.date) && plainAtt.status === EReportsStatus.Absent) totalMonthAbsent++;

            if (plainAtt.dayTrans.length > 0) {
                const computed = calculateHours(plainAtt.dayTrans);
                if (plainAtt.status === EReportsStatus.Present) {
                    totalMonthPresence++;
                    totalMonthWokringHours += computed.workingHours;
                    totalMonthShortHours += computed.shortHours;
                }
                if (computed.onTime === true) {
                    totalMonthOnTime++;
                } else {
                    totalMonthNotOnTime++;
                }
                return { ...plainAtt, ...computed };
            }

            return plainAtt;
        });


        return res.status(200).json({
            success: true,
            data: {
                ...existingReport.toObject(),
                attendances: updatedAttendances,
                dayRecords: {
                    totalMonthPresence,
                    totalMonthAbsent,
                    totalMonthLeaveToken,
                    totalMonthOnTime,
                    totalMonthNotOnTime,
                    totalMonthWokringHours,
                    totalMonthShortHours,
                }
            }
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};


export const updateReports = async (req: any, res: Response) => {
    const { month, year, from, to, dayTrans, remark, _id } = req.body;
    try {
        const existingReport = await ReportsModel.findOne({ userId: _id, month: month, year: year });
        let dateArr: Dayjs[] = [];
        let currentDate = from;
        let stopDate = to;

        while (dayjs(currentDate).isSameOrBefore(dayjs(stopDate))) {
            dateArr.push(dayjs(currentDate));
            currentDate = dayjs(currentDate).add(1, 'day');
        }
        if (existingReport) {
            existingReport.attendances.forEach((att) => {
                if (dateArr.some(dateInArray => dayjs(att.date).isSame(dateInArray, 'day'))) {
                    if (att.status === EReportsStatus.Absent || att.status === EReportsStatus.Present) {
                        att.dayTrans = dayTrans;
                        att.status = EReportsStatus.Present;
                    }
                }
            });
            await existingReport.save();
        }
        return res.status(200).json({ success: true, data: existingReport });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}
