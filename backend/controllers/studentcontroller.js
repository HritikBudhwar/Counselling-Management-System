// import db from './config/db.js'

// export const getAllStudents=(req,res)=>{
//     const query="select * from Student";
//     db.query(query,(err,results)=>{
//         if(err){
//             console.error("Error Fetching the students",err);
//             return res.status(500).json({error:"Database error"});
//         }
//         res.json(results);
//     });
// };

import db from "../config/db.js";

export const getAllStudents = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Student");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Database error" });
  }
};
