import express from 'express'
import dotenv from 'dotenv';
import db from './config/db.js'
import studentRoutes from "./routes/studentRoutes.js"

dotenv.config();
const app =express();
app.use(express.json);

app.get('/',(req,res)=>{
    res.send('counseling backend in running')
});

// app.get("/students",(req,res)=>{
//     db.query("select * from Student", (err,results)=>{
//         if(err)return res.status(500).json({error:err.message});
//         res.json(results);
//     });
// });

app.use("/students",studentRoutes);

const PORT =process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`SERVER RUNNING ON PORT ${PORT}`));