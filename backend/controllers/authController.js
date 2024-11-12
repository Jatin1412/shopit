import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/user.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import crypto from "crypto";

// Register User => api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 200, res);
});

// Login User => api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  // Find user in database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email and password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 201, res);
});

// Logout User => api/v1/logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    message: "Successfully Logout User",
  });
});

// Forgot password => api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // Find the user in database
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // get reset password token
  const resetToken = user.getResetPasswordToken();

  await user.save();

  // Create reset password url
  const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

  const message = getResetPasswordTemplate(user?.name, resetUrl);

  try {
    await sendEmail({
      email: user?.email,
      subject: "ShopIT Password Recovery",
      message,
    });

    res.status(200).json({
      message: `Email send to : ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return next(new ErrorHandler(error?.message, 500));
  }
});

// Reset password => /api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res) => {
  // Hash the url token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid and has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get currently logged-in user details   =>   /api/v1/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  // Check if user exists
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update / Change password   =>  /api/v1/password/update
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  // Ensure the new password and old password fields are provided
  const { oldPassword, password } = req.body;
  if (!oldPassword || !password) {
    return next(
      new ErrorHandler("Please provide both old and new passwords", 400)
    );
  }

  // Fetch the user by ID and include password in the selection
  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check previous user password
  const isMatched = await user.comparePassword(oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  // Set the new password
  user.password = password;
  await user.save();

  // Send updated token with the new password
  sendToken(user, 200, res);
});

// Update User profile   =>  /api/v1/me/update
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email } = req.body;

  const newUserData = {
    name,
    email,
  };

  // Update user profile and return the updated document
  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,            // Return the updated document
    runValidators: true,  // Validate the new data
  });

  // Optionally check if user was updated
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Admin Routes

// Get all users   =>   /api/v1/admin/users
export const allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
      success: true,
      users
  })
})


// Get user details   =>   /api/v1/admin/user/:id
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
      return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
  }

  res.status(200).json({
      success: true,
      user
  })
})

// Update user profile   =>   /api/v1/admin/user/:id
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false
  })

  res.status(200).json({
      success: true
  })
})

// Delete user   =>   /api/v1/admin/user/:id
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
      return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
  }

  // // Remove avatar from cloudinary
  // const image_id = user.avatar.public_id;
  // await cloudinary.v2.uploader.destroy(image_id);

  await user.remove();

  res.status(200).json({
      success: true,
  })
})




