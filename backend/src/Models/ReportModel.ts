import { getModelForClass, modelOptions, prop, Prop } from "@typegoose/typegoose";

export enum EReportsStatus {
    Present,
    Absent,
    FullLeave,
    HalfLeave,
    WeekOff
}

@modelOptions({ schemaOptions: { _id: false } })
export class Attendances {
    @Prop()
    date: string

    @Prop()
    dayTrans: string[]

    @Prop({ enum: EReportsStatus })
    status: EReportsStatus
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Reports {

    @Prop()
    userId: string;

    @Prop({ type: () => [Attendances] })
    attendances: Attendances[]

    @Prop()
    month: string

    @Prop()
    year: string
}


export const ReportsModel = getModelForClass(Reports);