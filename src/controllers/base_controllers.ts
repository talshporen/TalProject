import {Request, Response} from 'express';
import { Model } from 'mongoose';


class BaseController<T> {
model:Model<T>;
constructor(model:Model<T>){
   this.model = model;  
}


async getAll (req:Request, res:Response) {
   const ownerFilter = req.query.owner;
   try{
      if(ownerFilter) {
         const data = await this.model.find({owner:ownerFilter});
         res.status(200).send(data);
      } else {
      const data = await this.model.find();
      return res.send(data);
      }
   } catch(error) {
      return res.status(400).send(error);
   }  
 };

async getById (req:Request, res:Response) {
   const id = req.params.id;
   if(id){
   try{
      const data = await this.model.findById(id);
      if (data){
         return res.send(data);
      }else{
         return res.status(404).send("item not found");
      }
   } catch(error) {
      return res.status(400).send(error);
   }
}
return res.status(400).send("invalid id");
};

async createItem (req:Request, res:Response) {
   try{
      const data = await this.model.create(req.body);
      res.status(201).send(data);
   }catch(error){
      res.status(400).send(error);
   }
};

async deleteItem (req:Request, res:Response) {
   const id = req.params.id;
   try{
      await this.model.findByIdAndDelete(id);
      return res.send("item deleted");
   } catch(error) {  
      res.status(400).send(error);
   }
};
};

const createController = <T>(model: Model<T>) => {
   return new BaseController(model);
};

export default createController;

