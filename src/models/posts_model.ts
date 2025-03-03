import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    owner:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    content:String
});

const PostModel = mongoose.model('Post', PostSchema);
export default PostModel;