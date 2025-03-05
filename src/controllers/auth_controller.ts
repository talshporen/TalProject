import { Request, Response ,NextFunction } from 'express';
import userModel from '../models/user_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const register = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
if(!email || !password){
     res.status(400).send("missing email or password");
}
try{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await userModel.create({
        email:req.body.email,
        password: hashedPassword,
    });
    return res.status(200).send(user);
} catch(err){
     res.status(400).send(err);
}
};

const login = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if(!email || !password){
         res.status(400).send("wrong email or password");
    }
    try{
        const user = await userModel.findOne({ email: req.body.email });
        if(!user){
           res.status(400).send("wrong email or password");
           return;
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){
            res.status(400).send("wrong email or password");
            return
        }
        if(!process.env.TOKEN_SECRET){
           res.status(400).send("missing auth configuration");
           return;
        }
    const token = jwt.sign(
            { userId: user._id },
            process.env.TOKEN_SECRET ,
            { expiresIn: process.env.TOKEN_EXPIRATION||"1h" }
        
        );
        return res.status(200).json({
            email: user.email,
            _id: user._id,
            token: token,   
        });
    } catch (err){   
         res.status(400);
    }
};
type tokenPayload = {
    _id: string;
};
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
         res.status(401).send("missing token");
         return;
    }

    if(!process.env.TOKEN_SECRET){
         res.status(400).send("missing auth configuration");
         return;
    } 

    jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
        if(err){
           res.status(403).send("invalid token");
           return;
        }
        const payload = data as tokenPayload;
        req.query.userId = payload._id;


        next();
    });  
};

export default { register, login};