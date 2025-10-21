import db from '../config/db.js';

export const getAllCollege =async(req,res)=>{
try{
    const[rows]=await db.query("select * from college");
    res.json(rows);
}
catch(err){
    console.error("Error in fetching colleges",err);
    res.status(500).json({Error:"Database error"}); 
};
};

export const getCollegeById =async(req,res)=>{
    try{
        const[request]=await db.query("select * from College where CollegeId=?",[req.params.id]);
    if(request.lentgth==0)return res.status(404).json({message:"college not found"});
    res.json(request[0]);
}
    catch(err){
        console.error("Database Error",err);
        res.status(500).json({Error:"Database Error"})
    };
};


export const AddCollege=async(req,res)=>{
    const {CollegeName,Location}=req.body;
    try{
        const[Add]=await db.query("insert into college (CollegeName,Location) values (?,?)",[CollegeName,Location]);
        res.status(201).json({message:"college created" ,id: results.insertId});
    }
    catch(err){
        console.error("Error creating College",err);
        res.status(500).json({Error: "Database error"});
    };
};


export const updateCollege = async (req, res) => {
  const { CollegeName, Location } = req.body;
  try {
    const [results] = await db.query(
      "UPDATE College SET CollegeName = ?, Location = ? WHERE CollegeID = ?",
      [CollegeName, Location, req.params.id]
    );
    if (results.affectedRows === 0) return res.status(404).json({ message: "College not found" });
    res.json({ message: "College updated" });
  } catch (err) {
    console.error("Error updating college:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const deleteCollege=async(req,res)=>{
    try{
        const [results]=await db.query("delete from College where CollegeId=?",[req.params.id]);
        if(results.affectedRows===0)return res.status(404).json({message:"College not Found"});
        res.json({message:"College Deleted"});
    }
    catch(err){
        console.error("Error Deleting the College",err);
        res.status(500).json({Error:"Database Error"})
    }
}