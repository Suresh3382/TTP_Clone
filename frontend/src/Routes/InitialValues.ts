import { IcurrentUserDetails } from "../Interfaces/FulldetailsInterface"

export const initialIFullDetailsValues = {
    contactFeilds: {
        firstName: '',
        lastName: '',
        fathersName: '',
        dateofbirth: '',
        gender: '',
        bloodGroup: '',
        maritalStatus: '',
        contactNo: '',
        email: '',
        aadharId: '',
        aadharName: '',
        qualification: [],
        isPassport: false,
        passportNo: '',
        validFrom: '',
        validTo: '',
        presentAddress: {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            pincode: '',
        },
        permanentAddress: {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            pincode: '',
        },
        image: '',
    },
    EmployeesKyc: {
        UANNo: '',
        nationality: '',
        guardianName: '',
        relationWithGurdian: '',
        isInternationalWorker: '',
        isInternationalWorkerChecked: false,
        countryofOrigin: '',
        isPhysicalHandicap: '',
        isPhysicalHandiCapChecked: false,
        handicaptype: '',
        totalPercentage: 0,
        nominees: [{ nomineesName: '', DOB: '', percentage: 100, relationWithNominee: '' }],
    },
    cabRequest: {
        cabRequestYesorNo: '',
        hasCabrequest: false,
        landmark: '',
        pickAndDropAddress: '',
        mapLink: ''
    }
}

export const currentUserDetilsInitialValue: IcurrentUserDetails = {
    _id: '',
    username: '',
    email: '',
    password: '',
    role: undefined,
}