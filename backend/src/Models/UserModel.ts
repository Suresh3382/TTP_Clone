import { prop, getModelForClass } from "@typegoose/typegoose";

export class User {
    @prop({ required: true })
    public username!: string;

    @prop({ required: true })
    public email!: string;

    @prop({ required: true })
    public password!: string;

    @prop()
    public refreshToken?: string;

    @prop()
    public role?: "USER" | "ADMIN";

    @prop()
    public onboardingComplete?: boolean;
}

export const UserModel = getModelForClass(User);