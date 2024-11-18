import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mfaEnabled: {
        type: Boolean,
        required: true,
        default: false
    },
    mfaSecret: {
        type: String,
    },
    lastLoginTime: {
        type: Date,
        required: true
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default: false
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    friends: {
        following: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            }],
        followers: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            }]
    },
    incomingRequests: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }],
    requestedUsers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }]
});
export default mongoose.model("user", userSchema);
