import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email is required']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minLength: [true,'password should be at greater than 6 characters']
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    city: {
      type: String,
      required: [true, "city name is required"],
    },
    country: {
      type: String,
      required: [true, "country name is required"],
    },
    phone: {
      type: String,
      required: [true, "phone no is required"],
    },
    profilePic: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    answer: {
      type: String,
      required: [true, "answer is required"],
    },
}, {timestamps: true})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
  });

// compare function
userSchema.methods.comparePassword = async function (plainPassword) {
    try {
        return await bcrypt.compare(plainPassword, this.password);
    } catch (error) {
        console.log(error);
    }
  };

export const User = mongoose.model("Users", userSchema)