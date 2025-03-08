import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    refreshToken:{
        type: [String],
        default: [],
    }
});

const userModel = mongoose.model('User', UserSchema);

export default userModel;
