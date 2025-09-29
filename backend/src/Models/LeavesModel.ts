import { getModelForClass, modelOptions, mongoose, prop, Prop } from "@typegoose/typegoose";

class User {
    @Prop({ required: true, type: () => mongoose.Types.ObjectId })
    userId: mongoose.Types.ObjectId;

    @Prop({ required: true })
    username: string;
}

export enum leaveTypeEnum {
    sickLeave,
    casualLeave
}

export enum leaveStatusEnum {
    all,
    pending,
    approved,
    rejected,
}

export enum dayTypeEnum {
    fullDay,
    halfDay
}

class processedBy {
    @prop()
    userId: string;

    @prop()
    username: string;
}

class Image {
    @prop()
    name: string

    @prop()
    document: string
}

@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Leaves {
    @Prop({ type: () => User })
    User: User

    @Prop({ required: true, enum: leaveTypeEnum })
    leaveType: leaveTypeEnum

    @Prop({ required: true })
    from: string

    @Prop({ required: true })
    to: string

    @Prop({ required: true })
    dayType: dayTypeEnum

    @Prop({ required: true })
    isFirstHalf: boolean

    @Prop({ required: true })
    isSecondHalf: boolean

    @Prop({ required: true })
    reason: string

    @Prop({ type: () => Image })
    document: Image

    @Prop({ required: true, enum: leaveStatusEnum })
    status: leaveStatusEnum

    @Prop()
    remark?: string

    @Prop({ type: () => processedBy })
    processedBy?: processedBy
}

export const LeaveModel = getModelForClass(Leaves);