import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import studentRoutes from './routes/studentRoutes.js'
import collegeRoutes from "./routes/collegeRoutes.js"
import authRoutes from './routes/authRoutes.js'
import courseRoute from './routes/courseRoute.js'
import counselingRoutes from './routes/counselingRoutes.js'
import allocationRoutes from './routes/allocationRoutes.js'
import examRoutes from './routes/examRoutes.js'
import eligibilityRoutes from './routes/eligibilityRoutes.js'
dotenv.config();
const app =express();

app.use(cors());
app.use(express.json());

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
app.use("/colleges",collegeRoutes);
app.use('/api/courses',courseRoute);

app.use('/api/auth',authRoutes);       
app.use('/api/colleges',collegeRoutes); 
app.use ('/api/counseling',counselingRoutes);
// app.use('/api/counseling', counselingRoutes);
app.use('/api/admin', allocationRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/eligibility', eligibilityRoutes);

const PORT =process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`SERVER RUNNING ON PORT ${PORT}`));