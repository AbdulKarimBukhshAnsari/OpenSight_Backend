import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"


const app = express();
const CORS_ORIGIN = process.env.CORS_ORIGIN ;

// defining the configurations

// for defining the ORGIN URL by which the request could be made
app.use(cors({
    origin : CORS_ORIGIN ,
    credentials : true 
}))

app.use(express.json({limit : '16kb'}));

app.use(express.urlencoded({extended : true , limit : '16kb'}));

app.use(express.static('public'));

app.use(cookieParser());

// using routers
import userRouter from "./routes/user.routes.js";

app.use('/users' , userRouter) ;


export default app ; 