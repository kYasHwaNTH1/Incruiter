# 🚀 Incruiter - Quick Setup Guide

Follow the steps below to set up and run the project on your local machine.

## 📌 Installation & Setup

### 1️⃣ Clone the Repository
git clone https://github.com/kYasHwaNTH1/Incruiter.git  
cd Incruiter  

### 2️⃣ Install Dependencies
npm install  

### 3️⃣ Configure Environment Variables
touch .env  

Add the following environment variables to the `.env` file (replace `<values>` with your actual credentials):  

echo "mongodbUrl=<your_mongodb_connection_string>  
JWT_SECRET=<your_jwt_secret>  
port=<your_port_number>  
EMAIL=<your_email>  
PASSWORD=<your_app_password>" > .env  

### 4️⃣ Start the Application
npm start  

Your server will now be running at:  
👉 **http://localhost:<your_port_number>**  

## 🔑 Available API Endpoints  

### ✅ User Authentication Routes  
- **POST /register** – Register a new user  
- **POST /login** – Login and receive a JWT token  
- **POST /changepassword** – Change user password  

### 🔄 Password Reset Flow  
1. **POST /forgotpassword** – Request a password reset link (sent via email).  
2. **Paste the link received in your email in the postman** – This link is the endpoint for password reset.  
3. **POST /resetpassword** – Use the link to set a new password.  

✅ **You're all set!** Now, you can test the API and start building with **Incruiter**! 🚀
