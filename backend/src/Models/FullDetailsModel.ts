import { Prop, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";

@modelOptions({ schemaOptions: { _id: false } })
class IAddress {
    @Prop()
    addressLine1: string;
    @Prop()
    addressLine2: string;
    @Prop()
    state: string;
    @Prop()
    city: string;
    @Prop()
    pincode: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class INominee {
    @Prop()
    nomineesName: string;
    @Prop()
    relationWithNominee: string;
    @Prop()
    DOB: string;
    @Prop()
    percentage: number;
}

@modelOptions({ schemaOptions: { _id: false } })
class employeeDetails {
    @Prop()
    public firstName: string;
    @Prop()
    public lastName: string;
    @Prop()
    public fathersName: string;
    @Prop()
    public dateofbirth: string;
    @Prop()
    public gender: string;
    @Prop()
    public bloodGroup: string;
    @Prop()
    public maritalStatus: string;
    @Prop()
    public contactNo: string;
    @Prop()
    public email: string;
    @Prop()
    public aadharId: string;
    @Prop()
    public aadharName: string;
    @Prop({ type: () => [String] })
    public qualification: [];
    @Prop()
    public passportNo: string;
    @Prop()
    public validFrom: string;
    @Prop()
    public validTo: string;
    @Prop({ type: () => IAddress })
    public presentAddress: IAddress
    @Prop({ required: true, type: () => IAddress })
    public permanentAddress: IAddress
    @prop()
    public image: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class kycDetails {
    @Prop()
    UANNo: string;
    @Prop()
    nationality: string;
    @Prop()
    guardianName: string;
    @Prop()
    relationWithGurdian: string;
    @Prop()
    isInternationalWorker: string;
    @Prop()
    isInternationalWorkerChecked: boolean;
    @Prop()
    countryofOrigin: string;
    @Prop()
    isPhysicalHandicap: string;
    @Prop()
    isPhysicalHandiCapChecked: boolean;
    @Prop()
    handicaptype: string;
    @Prop({ type: () => [INominee] })
    nominees: INominee[];
    @Prop()
    totalPercentage: number;
    @Prop()
    image: File;
}

@modelOptions({ schemaOptions: { _id: false } })
class cabRequest {
    @Prop()
    hasCabrequest: boolean;
    @Prop()
    cabRequestYesorNo: string;
    @Prop()
    landmark: string;
    @Prop()
    pickAndDropAddress: string;
    @Prop()
    mapLink: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class emergencyContact {
    @Prop()
    contactName: string;
    @Prop()
    contactNo: string;
    @Prop()
    relation: string;
    @Prop()
    address: IAddress;
}

class FullDetailsModel {

    @Prop({ require: true })
    public userId: mongoose.Types.ObjectId

    @Prop({ type: () => employeeDetails })
    contactFeilds: employeeDetails

    @Prop({ type: () => kycDetails })
    EmployeesKyc: kycDetails

    @Prop({ type: () => cabRequest })
    cabRequest: cabRequest

    @Prop({ type: emergencyContact })
    emergencyContact: emergencyContact
}

export const UsersFullDetailsModel = getModelForClass(FullDetailsModel);
