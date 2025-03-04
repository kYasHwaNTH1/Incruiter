# Incruiter

## 🚀 Quick Setup Guide

Follow the steps below to set up and run the project on your local machine.

```sh
# 1️⃣ Clone the Repository
git clone https://github.com/kYasHwaNTH1/Incruiter.git
cd Incruiter

# 2️⃣ Install Dependencies
npm install

# 3️⃣ Create and Configure the .env File
# Run this command to create the .env file
touch .env

# Open the .env file and add the following environment variables:
# Replace <values> with your actual credentials

echo "mongodbUrl=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
port=<your_port_number>
EMAIL=<your_email>
PASSWORD=<your_app_password>" > .env

# 4️⃣ Start the Application
npm start

# 🎯 The server will now be running at: port
# http://localhost:<your_port_number>
