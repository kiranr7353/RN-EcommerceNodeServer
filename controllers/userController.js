import { User } from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/features.js";

export const registerController = async (req, res) => {
    try {

        const { name, email, password, address, city, country, phone, answer } =
      req.body;
    // validation
    if (
      !name ||
      !email ||
      !password ||
      !city ||
      !address ||
      !country ||
      !phone ||
      !answer
      
    ) {
      return res.status(400).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }

    const exisitingUSer = await User.findOne({ email });
    //validation
    if (exisitingUSer) {
      return res.status(500).send({
        success: false,
        message: "email already taken",
      });
    }

    const user = await User.create({
        name,
        email,
        password,
        address,
        city,
        country,
        phone,
        answer
        
      });
      res.status(201).send({
        success: true,
        message: "Registeration Success, please login",
        user,
      });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Register API",
            error,
        });
    }
}

const comparePassword = async function (plainPassword, dbValue) {
    try {
        return await bcrypt.compare(plainPassword, dbValue);
    } catch (error) {
        console.log(error);
    }
  };

  const generateToken = async function (id) {
    return JWT.sign({ _id: id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  };

export const loginController = async(req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
          return res.status(500).send({
            success: false,
            message: "Please Add Email OR Password",
          });
        }
        // check user
        const user = await User.findOne({ email }).select("+password");

        console.log(user)
        console.log(User)
        //user valdiation
        if (!user) {
          return res.status(404).send({
            success: false,
            message: "USer Not Found",
          });
        }
        const isMatch = await comparePassword(req.body.password, user.password);
        if (!isMatch) {
          return res.status(500).send({
            success: false,
            message: "invalid credentials",
          });
        }
        const token = await generateToken(user._id);
        res
          .status(200)
          .cookie("token", token
        //   {
        //     expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        //     secure: true,
        //     httpOnly: true,
        //     sameSite: true,
        //   }
          )
          .send({
            success: true,
            message: "Login Successfully",
            token,
            cookie: req.cookies,
            user,
          });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: "false",
          message: "Error In Login Api",
          error,
        });
      }
}
export const getUserProfileController = async(req, res) => {
   try {
    const user = await User.findById(req.user._id);
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "USer Proflie Fetched Successfully",
      user,
    });
   } catch (error) {
    console.log(error);
        res.status(500).send({
          success: "false",
          message: "Error In Login Api",
          error,
        });
   }
}

export const logoutController = async (req, res) => {
    try {
      res
        .status(200)
        .cookie("token", "" 
        // {
        //   expires: new Date(Date.now()),
        //   secure: process.env.NODE_ENV === "development" ? true : false,
        //   httpOnly: process.env.NODE_ENV === "development" ? true : false,
        //   sameSite: process.env.NODE_ENV === "development" ? true : false,
        // }
        )
        .send({
          success: true,
          message: "Logout SUccessfully",
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In LOgout API",
        error,
      });
    }
  };

  export const updateProfileController = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const { name, email, address, city, country, phone } = req.body;
      // validation + Update
      if (name) user.name = name;
      if (email) user.email = email;
      if (address) user.address = address;
      if (city) user.city = city;
      if (country) user.country = country;
      if (phone) user.phone = phone;
      //save user
      await user.save();
      res.status(200).send({
        success: true,
        message: "User Profile Updated",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In update profile API",
        error,
      });
    }
  };
  
  export const udpatePasswordController = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const { oldPassword, newPassword } = req.body;
      //valdiation
      if (!oldPassword || !newPassword) {
        return res.status(500).send({
          success: false,
          message: "Please provide old or new password",
        });
      }
      // old pass check
      const isMatch = await user.comparePassword(oldPassword);
      //validaytion
      if (!isMatch) {
        return res.status(500).send({
          success: false,
          message: "Invalid Old Password",
        });
      }
      user.password = newPassword;
      await user.save();
      res.status(200).send({
        success: true,
        message: "Password Updated Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In update password API",
        error,
      });
    }
  };

  /// Update user profile photo
export const updateProfilePicController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // file get from client photo
    const file = getDataUri(req.file);
    // delete prev image
    await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
    // update
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    user.profilePic = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    // save func
    await user.save();

    res.status(200).send({
      success: true,
      message: "profile picture updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In update profile pic API",
      error,
    });
  }
};
