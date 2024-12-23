import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    studentid: {
        type: Number,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{9}$/.test(v.toString());
            },
            message: props => `${props.value} is not a valid student ID! Must be exactly 9 digits.`
        }
    },
    roomnum: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{4}$/.test(v.toString());
            },
            message: props => `${props.value} is not a valid room number! Must be exactly 4 digits.`
        }
    },
    level: {
        type: Number,
        required: true,
        enum: [100, 200, 300, 400],
        message: '{VALUE} is not a valid level. Must be 100, 200, 300, or 400.'
    },
    status: {
        type: String,
        required: true,
        enum: ['received', 'not received'],
        default: 'not received'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
}, {
    timestamps: true
});

export default mongoose.model("Users", userSchema);