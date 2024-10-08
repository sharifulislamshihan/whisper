import mongoose, {Schema, Document } from "mongoose";


// Schema for message

export interface Message extends Document {
    content : string,
    createdAt : Date,
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
        required: true
    }
})


// Schema for user

export interface User extends Document {
    name: string,
    userName: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: Message[],

}


const UserSchema: Schema<User> = new Schema({

    name: {
        type: String,
        required: [true, "Name is required"],
    },

    userName: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true,
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/ , "Please use a valid email "]
    },

    password: {
        type: String,
        required: [true, "Password is required"],
    },

    verifyCode: {
        type: String,
        required: [true, "Verify Code is required"],
    },
    
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify Code expiry is required"],
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    isAcceptingMessage: {
        type: Boolean,
        default: false,
    },

    messages: [MessageSchema]
    
})

const UserModel = (mongoose.models.User as mongoose.Model<User> ) || mongoose.model<User>("User", UserSchema)

export default UserModel;

