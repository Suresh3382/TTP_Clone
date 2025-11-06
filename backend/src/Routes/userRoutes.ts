import express from 'express';
import { ChangePassword, Login, RefreshToken, Signup } from '../Controllers/AuthController';
import { getAllUsers, getAllUsersDetails, getUser, getUserDetails, UpdatePfp, updateUser, UserDetails } from '../Controllers/UserController';
import { CheckAuth, CheckRefreshToken } from '../MiddleWares/AuthMiddleware';
import { deleteLeaveRequest, editLeaveRequest, getAllLeaveRequests, getLeaveRequest, LeaveRequest } from '../Controllers/LeavesController';
import { getReports, updateReports } from '../Controllers/ReportsController';

const router = express.Router();

router.get('/full-details', CheckAuth, getUserDetails);
router.get('/getAllUsers', CheckAuth, getAllUsers);
router.post('/getLeaveRequest', CheckAuth, getLeaveRequest);
router.post('/signup', Signup);
router.post('/Login', Login);
router.post('/refresh/:refreshToken', CheckRefreshToken, RefreshToken);
router.get('/getUser', CheckAuth, getUser);
router.post('/changePassword', CheckAuth, ChangePassword);
router.post('/userDetails', CheckAuth, UserDetails);
router.post('/updateUser', CheckAuth, updateUser);
router.post('/updatePfp', CheckAuth, UpdatePfp);
router.post('/leaveRequest', CheckAuth, LeaveRequest);
router.post('/updateLeaveRequest/:leaveRequestId', CheckAuth, editLeaveRequest);
router.post('/deleteLeaveRequest/:leaveRequestId', CheckAuth, deleteLeaveRequest);
router.post('/getAllLeaveRequests', CheckAuth, getAllLeaveRequests);
router.post('/getreports', CheckAuth, getReports);
router.post('/updateUserReports', CheckAuth, updateReports);
router.get('/getAllUserDetails', CheckAuth, getAllUsersDetails);

//dummy
router.get('/dummy', CheckAuth, (req: any, res: any) => {
    console.log('Authenticated user:', req.user);
    res.send('Authenticated!');
});

//Cloudinary Image Api 
// router.post('/upload',   upload.single('image'), async (req: any, res: any) => {
//     console.log("File:", req.file)
//     try {
//         if (!req.file) return res.status(400).send({ error: "No file uploaded" });
//         const cloud = await UploadOnCloudinary(req.file.path);
//         fs.unlinkSync(req.file.path);
//         // res.send({ url: cloud?.url });
//     } catch (error) {
//         res.status(500).json({ message: 'File upload failed!', error });
//     }
// });

export default router;

