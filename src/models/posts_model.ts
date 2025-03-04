import mongoose from 'mongoose';

export interface iPost {
    title: string;
    content: string;
    owner: string;
}  

const PostsSchema = new mongoose.Schema<iPost>({
    title:{
        type: String,
        required: true,
    },
    content: String,
    owner:{
        type: String,
        required: true,
    },
});

const PostModel = mongoose.model<iPost>('Posts', PostsSchema);

export default PostModel;
