const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true
    },
    email : {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error ('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error("Password can't be 'password'");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if( value < 0 ) {
                throw new Error ('Age must be a positive number!');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps: true
});

//Setting up relationship between the user and task
userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

//Getting raw data excluding the data from mongoose
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//Token generating
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString() }, 'thisismynewcourse');

    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token
}

//logging in
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if(!user) {
        throw new Error ('Email is incorrent. Please check or sign up.');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error ("Some of your information isn't correct. Please try again.");
    }

    return user
}

//Hash the plain text to password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next()
});

//Deleting tasks of users when users are removed
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({owner: user._id});
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User