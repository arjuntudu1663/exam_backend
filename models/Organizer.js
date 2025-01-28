import mongoose from "mongoose"

const Organizer = mongoose.model("organizer_exam",{
    username:String,
    password:String,
    exams:[],
})

export default Organizer