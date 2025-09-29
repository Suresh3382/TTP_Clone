import { Response } from "express";
import { LeaveModel, leaveStatusEnum } from "../Models/LeavesModel";
import { getFilteredRequests, getRequests } from "../Services/UserServices";
import { ReportsModel } from "../Models/ReportModel";

export const LeaveRequest = async (req: any, res: Response) => {
    const id = req.user?._id;
    const name = req.user?.username;
    const { user } = req.body;
    let User = user ? user : { userId: id, username: name };
    const { leaveType, from, to, dayType, isFirstHalf, isSecondHalf, reason, document, status } = req.body;
    const response = await LeaveModel.create({ User, leaveType, from, to, dayType, isFirstHalf, isSecondHalf, reason, document, status });
    if (response) {
        res.status(200).json({ success: true, message: 'Leave Request Send Successfully!', data: response });
    } else {
        res.status(400).json({ success: false, message: 'failed' })
    }
}

export const getLeaveRequest = async (req: any, res: Response) => {
    const id = req.user?._id;
    const status = req.body.status;
    const response = await getRequests(id, status);
    if (response) {
        res.status(200).json({ success: true, data: response });
    } else {
        res.status(400).json({ success: false, message: 'failed' })
    }
};

export const editLeaveRequest = async (req: any, res: any) => {
    const { leaveRequestId } = req.params;
    const updatedData = req.body;
    const Response = await LeaveModel.findByIdAndUpdate(leaveRequestId, updatedData);
    // const getReports = await ReportsModel.find({});
    try {
        if (!Response) {
            res.status(404).json({ success: false, message: 'Request Not Found!' });
        }
        // if (updatedData.status === leaveStatusEnum.approved) {

        // }
        res.status(200).json({ success: true, data: Response })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error!' });
    }
}

export const deleteLeaveRequest = async (req: any, res: any) => {
    const { leaveRequestId } = req.params;
    try {
        const Response = await LeaveModel.findByIdAndDelete(leaveRequestId);
        if (!Response) {
            res.status(404).json({ success: false, message: 'Request Not Found!' });
        } else {
            res.status(200).json({ success: true, message: 'Request Deleted Successfully!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error!' });
    }
}


export const getAllLeaveRequests = async (req: any, res: Response) => {
    const role = req.user?.role;
    const user = {
        userRole: role,
    };
    const { status, leaveType, name, pagination, date } = req.body
    try {
        let response
        if (user.userRole === "ADMIN") {
            response = await getFilteredRequests(status, leaveType, name, pagination, date);
        } else {
            response = await getRequests(req.user?._id, status)
        }
        if (response) {
            return res.status(200).json({ success: true, data: response, user })
        }
        return res.status(404).json({ success: false, message: 'No leave requests found.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error!' });
    }
}