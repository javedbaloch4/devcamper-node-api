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

// DB Connect
mongoose.connect(process.env.DB_URL)

// Read data from file
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
)

// Import data to DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
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