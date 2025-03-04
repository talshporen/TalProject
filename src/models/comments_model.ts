import mongoose from 'mongoose';

export interface iComment {
    comment: string;    
    owner: string;
    postId: string;
}

const commentsSchema = new mongoose.Schema<iComment>({
    comment:{
        type: String,
        required: true,
    },
    owner:{
        type: String,
        required: true,
    },
    postId:{
        type: String,
        required: true,
    },
});

const commentModel = mongoose.model<iComment>('comments', commentsSchema);

export default commentModel;
