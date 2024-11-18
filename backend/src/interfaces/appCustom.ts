import { Types } from "mongoose"

export type User = {
    _id : string
}

export interface UserData  {
    _id : string,
    name : string,
    email: string,
    mobile: number,
    image: string,
    friends?: {
        following :  Types.ObjectId[],
        followers :  Types.ObjectId[]
    } | undefined | null,
    mfaEnabled: boolean,
    lastLoginTime: Date,
    incomingRequests: Types.ObjectId[],
    requestedUsers: Types.ObjectId[],
}