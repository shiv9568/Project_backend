import StudentModel from "../models/studentModel.js";
import AuthorityModel from "../models/authorityModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const Login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        console.log(email, password, role);
        if (!email || !password || !role) {
            return res.status(400).json({
                status: false,
                message: "Something is missing"
            });
        }

        const db = req.db;
        if (role === 'Student') {
            const Student = await StudentModel(db);

            const findUser = await Student.findOne({ email }).select('+password').lean();
            if (!findUser) {
                return res.status(400).json({
                    status: false,
                    message: "No user with this email is found"
                });
            }
            const compare = await bcrypt.compare(password, findUser.password);
            if (!compare) {
                return res.status(400).json({
                    status: false,
                    message: "Incorrect Password"
                });
            }
            delete findUser.password;
            console.log(findUser);
            findUser.role=role;
            const token = await jwt.sign(findUser, process.env.jwt_secret_student, { expiresIn: '5w' });
            return res.status(200).json({
                status: true,
                token: token,
                data: findUser,
                role:role
            });
        } else if (role === 'Head') {
            const Authority = await AuthorityModel(db);

            const AuthorityMember = await Authority.findOne({ email }).select('+password').lean();
            if (!AuthorityMember) {
                return res.status(400).json({
                    status: false,
                    message: "No user with this email is found"
                });
            }

            const compare = await bcrypt.compare(password, AuthorityMember.password);
            if (!compare) {
                return res.status(400).json({
                    status: false,
                    message: "Incorrect Password"
                });
            }
            delete AuthorityMember.password;
            AuthorityMember.role = role;

            const token = jwt.sign(AuthorityMember, process.env.jwt_secret_head, { expiresIn: '1w' });
            return res.status(200).json({
                status: true,
                token: token,
                data: AuthorityMember,
                role:role
            });
        } else {
            return res.status(400).json({
                status: false,
                message: "No Role Exist"
            });
        }

    } catch (error) {
        console.log("The error is --> " + error);
        return res.status(500).json({
            status: false,
            message: "Internal Error -> Login"
        });
    }
};

export const SignUp = async (req, res) => {
    try {
        const {role} = req.body;
        if (role === 'Student') {
            const { name, email, password, image, address, roll, graduationYear, phone, university, universityEmail, branch} = req.body;
            const uniId = req.uniId;
            if (!name || !email || !password || !address || !roll || !graduationYear || !phone || !university || !universityEmail || !branch) {
                return res.status(400).json({
                    status: false,
                    message: "Something is Missing"
                });
            }
            const db = req.db;
            const Student = await StudentModel(db);
            const existingUser = await Student.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ 
                    status: false,
                    message: "User Already Exist"
                });
            }
            const saltRounds = 5;
            const hashedPass = await bcrypt.hash(password,saltRounds);
            const newStudent = new Student({ name, email, password:hashedPass, image, address, roll, graduationYear, phone, university, universityEmail, branch, uniId});
            await newStudent.save();
            
            return res.status(201).json({
                status: true,
                message: "User created Successfully"
            });
        } else if(role==='Head'){
            const {name,email,password} = req.body;
            if(!name || !email || !password){
                return res.status(400).json({
                    status:false,
                    message:"Something is missing"
                });
            }
            const db = req.db;
            const Authority = await AuthorityModel(db);
            const existingAuthority = await Authority.findOne({email});
            if(existingAuthority){
                return res.status(400).json({
                    status:false,
                    message:"User Already Exist"
                })
            }
            const saltRounds = 5;
            const uniId = req.uniId;
            const hashedPass = await bcrypt.hash(password,saltRounds);
            const newAuthority = new Authority({name,email,uniId,password:hashedPass});
            await newAuthority.save();

            return res.status(201).json({
                status: true,
                message: "User Created Successfully"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal Error -> SignUp"
        })
    }
}