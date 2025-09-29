import { UsersFullDetailsModel } from '../Models/FullDetailsModel';
import { LeaveModel, leaveStatusEnum, leaveTypeEnum } from '../Models/LeavesModel';

export const getDetails = async (id: string) => {
    try {
        const response = await UsersFullDetailsModel.find({ userId: id });
        if (response.length > 0) {
            return { data: response, error: false };
        } else {
            return { data: null, error: true, message: 'No details found for the given user ID' };
        }
    } catch (error) {
        return { data: null, error: true, message: 'Server error', details: error };
    }
};


export const Onboadring = async (userId: string) => {
    const result = await UsersFullDetailsModel.findOne({ userId });
    if (result) {
        return { data: result, isOnboarding: true };
    } else {
        return { isOnboarding: false };
    }
};

// [{},...(condition ? [{}] : [])]  
export const getRequests = async (userId: string, status?: leaveStatusEnum) => {
    try {
        const result = await LeaveModel.find({
            "User.userId": userId,
            ...(status ? { status } : {}),
        });
        if (result.length > 0) {
            return result;
        } else {
            return { data: null, error: true, message: 'No details found for the given user ID' };
        }
    } catch (error) {
        return { data: null, error: true, message: 'Server error', details: error };
    }
};

export const getFilteredRequests = async (status: leaveStatusEnum[], leaveType?: leaveTypeEnum[], name?: string, pagination?: { currentPage: number, limit: number }, date?: string[]) => {
    const query: Record<string, any> = {}
    if (status?.length !== 0) {
        query.status = { $in: status }
    }
    if (leaveType?.length !== 0) {
        query.leaveType = { $in: leaveType }
    }
    if (name) {
        query['User.username'] = { $regex: name, $options: "i" }
    }
    if (date) {
        query.from = { $gte: date[0] }
        query.to = { $lte: date[1] }
    }
    try {
        const total = await LeaveModel.aggregate([
            { $match: query },
        ]);
        const leavesTotal = total.length;
        const result = await LeaveModel.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'fulldetailsmodels',
                    localField: 'User.userId',
                    foreignField: 'userId',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            { $skip: pagination?.currentPage ? (pagination.currentPage - 1) * (pagination.limit) : 0 },
            { $limit: pagination?.limit || 13 },
            {
                $project: {
                    // 'user.contactFeilds.image': 1,
                    user: { contactFeilds: { image: 1 } },
                    User: { username: 1 },
                    firstName: { firstName: 1 },
                    lastName: { lastName: 1 },
                    leaveType: 1,
                    from: 1,
                    to: 1,
                    reason: 1,
                    document: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    dayType: 1,
                    remark: 1,
                    processedBy: 1,
                }
            }
        ])
        if (result.length > 0) {
            return { data: result, total: leavesTotal };
        } else {
            return { data: null, error: true, message: 'No details found!' };
        }
    } catch (error) {
        return { data: null, error: true, message: 'Server error', details: error };
    }
};