import mongoose, { Schema, model } from "mongoose";

const userSchmea = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    role: {
      type: String,
      default: "user",
      num: ["admin", "user"],
      required: true,
    },
    gender: {
      type: String,
      num: ["male", "female"],
    },
    profilePic: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dtxu6cgvy/image/upload/v1691768838/Default/user/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876_tojg0u.webp",
      },
      id: {
        type: String,
        default:
          "Default/user/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876_tojg0u",
      },
    },
    profileCov: [{ url: String, id: String }],
    phone: String,
    isOnline: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isConfirm: {
      type: Boolean,
      default: false,
    },
    forgetCode: String,
    activationCode: String,
  },
  { timestamps: true }
);
//  mongoose.model.User ||
const userModel = model("User", userSchmea);
export default userModel;
