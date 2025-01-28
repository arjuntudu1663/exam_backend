
const Exam = mongoose.model("exams",{
    name:String,
    duration:Number,
    questions:[],
    organizer:String,
    date:String,
    givers:[]
})

export default Exam