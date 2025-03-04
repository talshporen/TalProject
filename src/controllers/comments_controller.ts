import commentsModel,{ iComment } from '../models/comments_model';
import createController from './base_controllers';



const commentsControllers = createController<iComment>(commentsModel);

export default commentsControllers;
