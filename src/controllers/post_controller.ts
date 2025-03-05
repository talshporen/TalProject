import postModel,{iPost} from '../models/posts_model';

import createController from './base_controllers';

const postControllers = createController<iPost>(postModel);




export default postControllers

