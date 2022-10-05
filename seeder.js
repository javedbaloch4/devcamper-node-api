import fs from "fs"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import colors from "colors"
import mongoose from "mongoose";
import dotenv from "dotenv"

// Config dot env
dotenv.config({ path: './config/config.env' });

// Path to file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load Models
import Bootcamp from "./models/Bootcamp.js"
import Course from "./models/Course.js"
import User from "./models/User.js"

// DB Connect
mongoose.connect(process.env.DB_URL)

// Read data from file
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
)

const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
)

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
)

// Import data to DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        await Course.create(courses);
        await User.create(users);

        console.log(`Data has been imported...`.green.inverse)
        process.exit()
    } catch(err) {
        console.log(err)
    }
}

// Delete data from DB
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.deleteMany()
        console.log(`Data has been deleted`.red.inverse)
        process.exit()
    } catch (err) {
        console.log(err)
    }
}

if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === "-d") {
    deleteData()
}