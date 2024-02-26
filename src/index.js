import http from "http";
import app from "./config/express.config.js";
import logger from "./lib/logger.js";
import { connectMongoose } from "./lib/mongoose.js";
import OpenAIClass from "./classes/openai.class.js";

const appServer = http.createServer(app);

appServer.listen(8000, async () => {
    logger.info("INFO: Listening on port 8000");
    await connectMongoose();
    // const open = new OpenAIClass()
    // await open.decodeImageFromCasper('/Users/mayanka/Workspace/casper-backend/public/uploads/file-1708343248414.png', 'zero.png', 'zero.png')

})
