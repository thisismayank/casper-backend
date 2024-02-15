import response from "../lib/response.js";
import AuthClass from "../classes/auth.class.js";


import logger from "../lib/logger.js"
import OpenAIClass from "../classes/openai.class.js";
import multer from 'multer';
import path from 'path';
// Set up storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads')); // Adjust the path as needed
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer with the storage engine
export const upload = multer({ storage: storage });

export const decodeImageForCasper = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // Handle your file upload here. `req.file` contains file details.
    console.log(req.file);

    // Assuming you also want to handle additional form fields:
    console.log('Name:', req.body.name);
    console.log('Date:', req.body.date);
    console.log(storage._handleFile.name);
    console.log("NAMMEEEE", JSON.stringify(req.file));
    console.log("NAMMEEEE", req.file.filename);


    const openAiObj = new OpenAIClass();
    const responseObj = await openAiObj.decodeImageFromCasper(req.file.path, req.file.filename, req.file.originalname)

    res.json({
        message: 'File uploaded successfully',
        fileName: req.file.filename,
        name: req.body.name,
        date: req.body.date
    });
};

export const generateResponse = async (req, res) => {
    try {

        const authHeader = req.get("Authorization");
        const stripStart = "Bearer ".length;
        // Strip the leading "Bearer " part from the token string
        if (stripStart && stripStart.length > 0) {
            const userIdToken = authHeader.substring(stripStart);
            // Split the user ID and token part from the rest of the token string
            const [userId, token] = userIdToken.split(",");
        }

        const openAiObj = new OpenAIClass();
        const responseObj = await openAiObj.generateResponse(req.body.prompt)

        res.send(responseObj);
    } catch (error) {
        console.log('error', error)

        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            messageObj: { error: error.toString() },
        });
    }
}
export const generateResponseForCasper = async (req, res) => {
    try {
        const authHeader = req.get("Authorization");
        const stripStart = "Bearer ".length;
        // Strip the leading "Bearer " part from the token string
        if (stripStart && stripStart.length > 0) {
            const userIdToken = authHeader.substring(stripStart);
            // Split the user ID and token part from the rest of the token string
            const [userId, token] = userIdToken.split(",");
        }

        const openAiObj = new OpenAIClass();
        // const responseObj = {
        //     body: req.body, response: {
        //         author: "1",
        //         createdAt: new Date().getTime(),
        //         id: '0',
        //         text: "How are you doing?"
        //     }
        // }
        // let response = await openAiObj.generateResponseForCasper(req.body.prompt)
        let responseObj = await openAiObj.generateResponseForCasper(req.body.text, req.body.isTest)
        console.log('responses', responseObj)


        res.send(responseObj);
    } catch (error) {
        console.log('error', error)

        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            messageObj: { error: error.toString() },
        });
    }
}
