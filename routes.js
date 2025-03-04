const router = require('express').Router();
const jwt = require('jsonwebtoken');
const {z} = require('zod')
const User =  require('./model');
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
require('dotenv').config();

// Validation of entries using zod
const schema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
  
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[@$!%*?&]/, "Password must contain at least one special character (@$!%*?&)"),
  
    email: z
      .string()
      .email("Invalid email format")
      .refine((email) => email.endsWith("@gmail.com") || email.endsWith("@yahoo.com"), {
        message: "Email must be from gmail.com or yahoo.com",
      }),
  });
const transporter = nodemailer.createTransport({
    service:'gmail',
    secure: true,
    port: 465,
    auth: {
         user: `${process.env.EMAIL}`,
         pass: `${process.env.PASSWORD}`
    },
})

router.post('/register',async(req,res)=>{
    const {email,username,password}  = req.body;

    try {
        const result = schema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({error:result.error.format()})
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }

        const hashedpassword = await bcrypt.hash(password,10);
    
        // Create new user
        const user = new User({
          username,
          email,
          password:hashedpassword,
        });
     
        await user.save();

        res.status(200).json({success:"User created"})
    } catch (error) {
        res.json({error:error.message});
    }

})

router.post('/login',async(req,res)=>{
    const {email,password}  = req.body;
    try {
        const existingUser = await User.findOne({email:email});
        if(!existingUser){
            return res.status(401).json({message:"No User exists"})
        }
        const ispasswordmatch = await bcrypt.compare(password,existingUser.password);

        if(!ispasswordmatch) {
            return res.status(401).json({message:"Invalid Credentials"})
        }
        const token =  jwt.sign({id:existingUser._id},process.env.JWT_SECRET,{expiresIn:'3h'});
        res.status(200).json({token:token,message:"User Logged in Successfully"})

    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

function Middleware(req,res,next){
    try{
    const token = req.headers['token'];
    if(!token) return res.status(401).json({message:"Token is required"})
    const user = jwt.verify(token,process.env.JWT_SECRET);
     req.user = user.id;
     next();
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}

 router.put('/changepassword',Middleware,async (req,res)=>{
     const {currentpassword, newpassword} = req.body;
       try { 
        const id  = await User.findById({_id:req.user});
        if(!id){
            return res.status(404).json({message:"User not found"})
        }
        const ismatch = await bcrypt.compare(currentpassword,id.password);
        if(!ismatch){
            return res.status(401).json({message:"Invalid password"});
        }
        const hashedpassword = await bcrypt.hash(newpassword,10);
        const user = await User.findByIdAndUpdate(id,{password:hashedpassword},{new:true});
        return res.json({message:"Password Changed"})

    }
    catch(error){
        res.status(500).json({error:error.message});
    }
 })

 // to reset the password

  router.post('/forgotpassword',async(req,res)=>{
    const {email} = req.body;
    try {
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
         
        const resetToken = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'10min'});

        const resetLink = `http://localhost:${process.env.port}/resetpassword/${resetToken}`;
        console.log(resetLink);

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Reset Password',
            text: `Please click on the following link to reset your password: \n\n${resetLink}`
        })
        res.status(200).json({message:"Reset password link sent to your email"})
        
    } catch (error) {
        return res.status(500).json({error:error.message});
    }

  })

  router.post('/resetpassword/:token',async(req,res)=>{
        try {
            const {token} = req.params;
            const {password} = req.body;

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (!user) {
              return res.status(400).json({ message: "Invalid or expired token" });
            }

            const validatePassword = await schema.safeParse(password);

            if(!validatePassword) {
                return res.status(400).json({error: validation.error.format() })
            }

            const hashedpassword = await bcrypt.hash(password,10);
            user.password = hashedpassword;
            await user.save();

            res.json({ message: "Password reset successful" });

        } catch (error) {
            return res.status(500).json({error:error.message});
        }
  })

module.exports = router; 