const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors(
    {
        origin : ["https://exam-frontend-vert.vercel.app","http://localhost:3000"]
    }
));



try{
    mongoose.connect("mongodb+srv://arjuntudu9163:fv9FIKG1eb8UKcee@cluster0.cq6wv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
}catch(e){
    if(e){
        (e)
    }
}

//////////////////////////////////////////////////////////////////

const Organizer = mongoose.model("organizer_exam",{
    username:String,
    password:String,
    exams:[],
})
const Exam = mongoose.model("exams",{
    name:String,
    duration:Number,
    questions:[],
    organizer:String,
    date:String,
    status:String,
    startTime:String,
    batchCode:String,
    fullMarks:Number,
    givers:[]
})
const Question = mongoose.model("questions",{
    title:String,
    marks:Number,
    option1:String,
    option2:String,
    option3:String,
    option4:String,
    answer:String,
    exam_id:String
})
const Student = mongoose.model("students",{
    username:String,
    password:String,
    exams:[],
    batch:String,
    stream:String,
    roll_no:String

})


//profile/////////////////////////////////////////////////////////////////

app.post("/organizer_register",async(req,res)=>{
    
    if(req.body.password === req.body.re_password){
        try{ 
             
            const response1 = await Organizer.find({username:req.body.username,password:req.body.password});
           
            if(response1.length>0){
                res.json({"value":false})
            }else{
                const response = await Organizer.create({username:req.body.username,password:req.body.password})
                res.json({"value":true,"response":response})
            }

            
        }catch(e){}
    }else{
        res.json({"value":false,"response":"password isn't matching"})
    }

})

app.post("/organizer_login",async(req,res)=>{
    
  
        try{ 
             
            const response = await Organizer.find({username:req.body.username,password:req.body.password});
           
            if(response.length>0){
                res.json({"value":true,"response":response[0]})
            }else{
                res.json({"value":false,"response":"not found"})
            }

            
        }catch(e){}
   
})

app.get("/organizer_all",async(req,res)=>{
    
    try{
        const response = await Organizer.find({})
        (response,"<==== org all")
        res.json(response)
    }catch(e){

    }
})

//student///////////////////////////////////////////////////////////////////

app.post("/student_register",async(req,res)=>{
    
 

    if(req.body.password === req.body.re_password){
        try{ 
             
            const response1 = await Student.find({username:req.body.username,password:req.body.password});
           
            if(response1.length>0){
                res.json({"value":false})
            }else{
                const response = await Student.create({username:req.body.username,password:req.body.password,stream:req.body.stream,roll_no:req.body.roll_no,batch:req.body.batch})
                res.json({"value":true,"response":response})
            }

            
        }catch(e){}
    }else{
        res.json({"value":false,"response":"password isn't matching"})
    }

})

app.post("/student_login",async(req,res)=>{
    
  
    try{ 
         
        const response = await Student.find({username:req.body.username,password:req.body.password});
       
        if(response.length>0){
            res.json({"value":true,"response":response[0]})
        }else{
            res.json({"value":false,"response":"not found"})
        }

        
    }catch(e){}

})

app.post("/student_find",async(req,res)=>{
    
   
    try{ 

        const response = await Student.find({_id:req.body.id});
        
       
        if(response.length>0){
            res.json({"value":true,"response":response[0]})
        }else{
            res.json({"value":false,"response":"not found"})
        }

        
    }catch(e){}
})

app.post("/student_update",async(req,res)=>{
    console.log(req.body.id,"<=== update incoming")
     try{
       
              if(req.body.batch.length>0){
                 await Student.findOneAndUpdate({_id:req.body.id},{
                    $set:{ batch:req.body.batch}
                 })
              }
              if(req.body.stream.length>0){
               await Student.findOneAndUpdate({_id:req.body.id},{
                    $set:{ stream:req.body.stream}
                 })
              }
              if(req.body.roll_no.length>0){
               await Student.findOneAndUpdate({_id:req.body.id},{
                    $set:{ roll_no:req.body.roll_no}
                 })
              }
            
              const response = await Student.find({_id:req.body.id})
              console.log(response,"<== update response")
              res.json(response)
            
     }catch(e){}
})


//exam///////////////////////////////////////////////////////////////////////

app.post("/exam_create",async(req,res)=>{
     
  

    try{

        const response = await Exam.create({
            name:req.body.name,
            duration:req.body.duration,
            organizer:req.body.organizer,
            status:req.body.status,
            batchCode:req.body.batchCode,
            fullMarks:0
        })
       
        res.json(response)

    }catch(e){}


})

app.post("/exam_get",async(req,res)=>{
   
    try{

        const response = await Organizer.find({_id:req.body.id});
        const exam_list = response[0].exams
        res.json(exam_list)

    }catch(e){}

})

app.post("/exam_my",async(req,res)=>{
    
    
    try{

        const response = await Exam.find({batchCode:req.body.batchCode,status:"on"});
       
        res.json(response)
        
    }catch(e){}

})

app.post("/exam_on",async(req,res)=>{
     

    
   
    
    try{
        const response = await Exam.findOneAndUpdate({_id:req.body.exam_id},

            { 
            
              $set:
                
              {   
                
                status:'on',
                startTime:new Date().toLocaleTimeString()
                
            
               }
            }
    
         );
        
       
        const exam_find = await Exam.find({_id:req.body.exam_id})
        const duration = exam_find[0].duration
        setTimeout(async()=>{
            const response_off = await Exam.findOneAndUpdate({_id:req.body.exam_id},{$set:{status:'off'}});
          
        },duration*60*60*1000)
        res.json(response)
    }catch(e){}

})

app.post("/exam_off",async(req,res)=>{
     


 
    
    try{
        const response = await Exam.findOneAndUpdate({_id:req.body.exam_id},

            { 
            
              $set:
                
              {   
                
                status:'off',
                
                
            
               }
            }
    
         );

        
         res.json(response)

        
        
    
    }catch(e){}

})

app.get("/exam_all",async(req,res)=>{
    try{
        const response = await Exam.find({})
        res.json(response)
    }catch(e){

    }
})

app.post("/exam_org",async(req,res)=>{
    const id = req.body.id
    try{
        const response = await Exam.find({organizer:id})
        res.json(response)
    }catch(e){

    }
})


app.post("/exam_curr",async(req,res)=>{

    
    const id = req.body.id;


    try{
        const response = await Exam.find({_id:id})
       
        res.json(response)
    }catch(e){

    }
})

//questions////////////////////////////////////////////////////////////////
app.post("/add_question",async(req,res)=>{
    
   
    try{

        const response = await Question.create({...req.body,
            option1:req.body.option1,
            option2:req.body.option2,
            option3:req.body.option3,
            option4:req.body.option4,
            answer:"option"+req.body.answer
        })
       const response1 = await Exam.find({_id:req.body.exam_id});
       const count = response1[0].fullMarks+1
       const response2 = await Exam.findOneAndUpdate({_id:req.body.exam_id},{$set:{
          fullMarks : count
       }})
        res.json(response)

    }catch(e){}
 
})

app.post("/allQuestions_exam",async(req,res)=>{
     
   

    try{
       const response = await Question.find({exam_id:req.body.exam_id})
       const answers =[];
       response.map((x)=>{
          answers.push(
            {
                "question_id":x._id,
                "answer":x.answer.slice(6,x.answer.length),
                "marks":0
            }
          )
       })
       res.json({"response":response,"answers":answers})
    }catch(e){}

})

app.post("/fullMarks",async(req,res)=>{
    console.log(req.body)
    try{

        const response = await Exam.findOneAndUpdate({_id:req.body.exam_id},{$set:{
            fullMarks:req.body.value
        }})

    }catch(e){
      
    }

})


//result///////////////////////////////////////////////////////////////////
app.post("/result_add",async(req,res)=>{
     
 
    const exam_id = req.body.exam_id 
    const currentMarks = req.body.currentMarks 
    const profile_id = req.body.student_id

    let flag = true ;

    try{
        const exam_find = await Exam.find({_id:exam_id})
        const student_find = await Student.find({_id:profile_id});
      

        const name = student_find[0].username
        const roll_no = student_find[0].roll_no

        exam_find[0].givers.map((x)=>{
            if(x.profile_id === profile_id){
               flag = false
            }
        })
        
        if(flag){
            const givers_list = [...exam_find[0].givers,{profile_id:profile_id,name:name,roll_no:roll_no,marks:currentMarks,exam_id:exam_id}];
            const update_result = await Exam.findOneAndUpdate({_id:exam_id},{
                $set:{
                    givers:givers_list
                }
            })
    
        }else{
            res.json({"value":false})
        }
        res.json({"value":true})
        

    }catch(e){

    }

})
















app.get("/",(req,res)=>{
    res.json("app started")
})

app.listen("5000",(err)=>{
    if(!err){
      console.log ("app started")
    }
})
