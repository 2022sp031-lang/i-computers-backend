import Student from "../models/student.js";

export function createStudent(req, res) {

    console.log(req.user)

    if(req.user == null) {
        res.status(403).json(
            {
                message: "Unauthorized access login before create students"
            }
        )
        return
    }

    if(!req.user.isAdmin) {
        res.json(
            {
                meassage: "Only admins can create students"
            }
        )
    }

    const newStudent = new Student(
        {
            name: req.body.name,
            age: req.body.age,
            city: req.body.city
        }
    );

    newStudent.save().then(
        ()=> {
            res.json(
                {
                    message: "Student added successfully!"
                }
            )
        }
    )
}

export function getStudents(req, res) {
     Student.find().then(
        (students)=> {
            res.json(students)
        }
    )
}