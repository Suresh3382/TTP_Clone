import { Request, Response } from "express";
import { getDetails } from "../Services/UserServices";
import { UsersFullDetailsModel } from "../Models/FullDetailsModel";
import { User, UserModel } from "../Models/UserModel";
import { CLIENT_RENEG_LIMIT } from "tls";
import { log } from "console";

export const UserDetails = async (req: any, res: Response) => {
    const userId = req.user._id;
    const {
        contactFeilds,
        EmployeesKyc,
        cabRequest
    } = req.body;
    const response = await UsersFullDetailsModel.create({
        userId,
        contactFeilds,
        EmployeesKyc,
        cabRequest
    });
    if (response) {
        const user = await UserModel.findById(userId);
        if (user) {
            user.onboardingComplete = true;
            await user.save();
            res.status(200).json({ success: true, message: 'Details Saved Sucessfully', data: response });
        } else {
            res.status(400).json({ success: false, message: 'failed' })
        }
    }
}

export const getUserDetails = async (req: any, res: Response) => {
    const userId = req.user._id;
    const result = await getDetails(userId);
    return res.status(200).json({ success: true, data: result.data, error: result.message });
};

export const updateUser = async (req: any, res: Response) => {
    const userId = req.user._id;
    try {
        const {
            contactFeilds,
            emergencyContact,
            EmployeesKyc,
            cabRequest
        } = req.body;
        let result = await UsersFullDetailsModel.findOne({ userId });
        if (!result) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (contactFeilds != null) {
            result.contactFeilds = contactFeilds;
        }
        if (emergencyContact != null) {
            result.emergencyContact = emergencyContact;
        }
        if (EmployeesKyc != null) {
            result.EmployeesKyc = EmployeesKyc;
        }
        if (cabRequest != null) {
            result.cabRequest = cabRequest;
        }
        await result.save();
        return res.status(200).json({ success: true, data: result });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error!' });
    }
}

export const UpdatePfp = async (req: any, res: Response) => {
    const userId = req.user._id;
    const { imageURL } = req.body;
    const existingUser = await UsersFullDetailsModel.findOne({ userId });
    if (existingUser) {
        existingUser.contactFeilds.image = imageURL;
        await existingUser.save();
        return res.status(200).json({ success: true, message: "Pfp Updated Successfully", image: imageURL });
    }
    else {
        res.status(400).json({ success: false, message: 'failed' })
    }
}

export const getUser = async (req: any, res: Response) => {
    const userId = req.user._id;
    try {
        if (userId) {
            const [existingUser] = await UserModel.aggregate([
                { $match: { _id: userId } },
                {
                    $lookup: {
                        from: 'fulldetailsmodels',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'userDetails'
                    }
                },
                { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        username: 1,
                        email: 1,
                        role: 1,
                        onboardingComplete: 1,
                        pfp: '$userDetails.contactFeilds.image',
                    }
                }
            ]);

            if (existingUser) {
                return res.status(200).json({ success: true, existingUser });
            } else {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
        } else {
            return res.status(400).json({ success: false, message: 'User ID missing' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


export const getAllUsers = async (req: any, res: Response) => {
    const _id = req?.user?._id;
    const name = req.body.name;
    try {
        const nameRegex = new RegExp(`^${name}$`, 'i')  
        const response = await UserModel.aggregate([
            {
                $match: {
                    _id: { $ne: _id },
                    'userDetails.contactFeilds.firstName': { $not: nameRegex }, 
                }
            },
            {
                $lookup: {
                    from: 'fulldetailsmodels',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'userDetails'
                }
            },
            { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    username: 1,
                    email: 1,
                    role: 1,
                    onboardingComplete: 1,
                    pfp: '$userDetails.contactFeilds.image',
                    firstName: '$userDetails.contactFeilds.firstName',
                    lastName: '$userDetails.contactFeilds.lastName'
                }
            }
        ]);
        if (response) {
            return res.status(200).json({ success: true, response });
        } else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}

export const getAllUsersDetails = async (req: any, res: Response) => {
    try {
        const response = await UsersFullDetailsModel.find();
        if (response.length === 0) {
            return res.status(404).json({ sucess: false, message: "No User found!" })
        }
        return res.status(200).json({ success: true, response });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}