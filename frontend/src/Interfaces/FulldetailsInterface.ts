interface IContactFeilds {
    firstName: string,
    lastName: string,
    fathersName: string,
    dateofbirth: string,
    gender: string,
    bloodGroup: string,
    maritalStatus: string,
    contactNo: string,
    email: string,
    aadharId: string,
    aadharName: string,
    qualification: string[],
    isPassport: boolean,
    passportNo: string,
    presentAddress: IAddress,
    permanentAddress: IAddress,
    validFrom: string,
    validTo: string,
    image: string
}
interface INominee {
    nomineesName: string,
    relationWithNominee: string,
    DOB: string,
    percentage: number
}
interface IcabRequest {
    hasCabrequest: boolean
    cabRequestYesorNo: string,
    landmark: string,
    pickAndDropAddress: string,
    mapLink: string
}
interface IEmployeesKyc {
    UANNo: string,
    nationality: string,
    guardianName: string,
    relationWithGurdian: string,
    isInternationalWorker: string,
    isInternationalWorkerChecked: boolean,
    countryofOrigin: string,
    isPhysicalHandicap: string,
    isPhysicalHandiCapChecked: boolean,
    handicaptype: string,
    nominees: INominee[],
    totalPercentage: number
}
interface IAddress {
    addressLine1: string,
    addressLine2: string,
    city: string,
    state: string,
    pincode: string,
}

export interface IFullDetails {
    contactFeilds: IContactFeilds,
    EmployeesKyc: IEmployeesKyc,
    cabRequest: IcabRequest
}

export interface IcurrentUserDetails {
    pfp?: string
    _id: string,
    username: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    role: "USER" | "ADMIN" | undefined,
}
