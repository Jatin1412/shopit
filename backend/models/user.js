import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from "crypto"

const { Schema } = mongoose;

// Create User Schema
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "please enter your name"],
        trim: true,
        maxLength: [50, "your name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "please enter your email"],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "please enter your password"],
        minLength: [6, "your password must be longer then 6 charater"],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    avatar: {
        public_id: String,
        url: String
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

}, { timestamps: true });

//Encription the password before save 
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) next();

    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.getjwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_TIME
    })
}

// Compare user password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.getResetPasswordToken = function () {
    
    // generate token
    const resetToken = crypto.randomBytes(20).toString('hex')

    // hash and set the reset token
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set the expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    return resetToken;
}

// Create and export User model
const User = mongoose.model('User', userSchema);
export default User;
