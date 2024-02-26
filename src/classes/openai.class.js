import BaseClass from "./base.class.js";
import OpenAI from "openai"

import axios from 'axios';
import response from "../lib/response.js";
import logger from "../lib/logger";
const tesseract = require("tesseract.js")

// Replace 'YOUR_OPENAI_API_KEY' with your actual OpenAI API key
const apiKey = 'sk-BraUqGoxPhZfSNKlxPcmT3BlbkFJAUWQQosSsECU8SVus8k';
const OPENAI_API_KEY = "sk-8m6F0JwoHnBDyNtcbStuT3BlbkFJfyitMEoZWTxEJvXiPsT"
const ASSISTANT_ID = "asst_0Yrv9S1ZCQ7QIqjhiZYWDPu"


const ASSISTANT_TITLE = "Assistants API UI"
const ENABLED_FILE_UPLOAD_MESSAGE = "FILE Upload" //Leave empty to disable
export default class OpenAIClass extends BaseClass {
    async generateResponse(prompt) {
        try {
            logger.info(
                `INFO: OpenAIClass-generateResponse - Prompt: ${prompt}`
            );
            const openai = new OpenAI({
                apiKey
            });

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant designed to output JSON.",
                    },
                    { role: "user", content: prompt },
                ],
                model: "gpt-3.5-turbo",
                max_tokens: 50,
            });


            logger.debug(`RESULT: OpenAIClass-generateResponse - Prompt: ${completion.choices[0].message.content}`);

            return {
                ...response.CARBON.CNAUGHT.PLACE_ORDER.SUCCESS,
                results: {
                    completion: completion.choices[0].message.content
                }
            }
        } catch (error) {
            console.error('Error generating text:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
    async generateResponseForCasper(prompt, isTest = true) {
        try {
            logger.info(
                `INFO: OpenAIClass-generateResponseForCasper - Prompt: ${prompt}`
            );
            const openai = new OpenAI({
                apiKey
            });
            let completion = null;
            if (!isTest) {
                completion = await openai.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: `Don't use emoji. don't explain, just send the chat. By using a text in the conversation, FlirtAI is now refined to generate short, emoji-free replies that do not suggest meetings or coffee dates by looking at the screenshots provided or the text given. It will continue the conversation with succinct replies that mirror the user's input in length and style, maintaining a natural back-and-forth flow. The assistant will replicate the user's word count closely to preserve the conversation's rhythm without shifting towards plans for a real-world interaction, ensuring a seamless and engaging textual exchange.
                        Don't use emoji.
                        can you make the replies more flirtatious and quirky and using slangs and also using meme knowledge`,
                        },
                        { role: "user", content: prompt },
                    ],
                    model: "gpt-3.5-turbo",
                    max_tokens: 50,
                });


                logger.debug(`RESULT: OpenAIClass-generateResponseForCasper - Prompt: ${completion.choices[0].message.content}`);
            }
            return {
                ...response.CARBON.CNAUGHT.PLACE_ORDER.SUCCESS,
                results: {
                    author: "1",
                    createdAt: new Date().getTime(),
                    id: new Date().getTime(),
                    // text: "Hello"
                    text: isTest ? "Hello" : completion.choices[0].message.content
                }
            }
        }
        catch (error) {
            console.error('Error generating text:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
    async decodeImageFromCasper(path, name, originalName) {
        try {
            logger.info(
                `INFO: OpenAIClass-decodeImageFromCasper - Path: ${path} - Name: ${name} - Original Name: ${originalName}`
            );


            const conversation = await tesseract
                .recognize(path, 'eng');

            console.log('CONVERSAtion', conversation.data.text);
            const openai = new OpenAI();
            const assistant = await openai.beta.assistants.create({
                name: "Expert in dating conversations",
                instructions: `Don't use emoji. don't explain, just send the chat. By using a text in the conversation, FlirtAI is now refined to generate short, emoji-free replies that do not suggest meetings or coffee dates by looking at the screenshots provided or the text given. It will continue the conversation with succinct replies that mirror the user's input in length and style, maintaining a natural back-and-forth flow. The assistant will replicate the user's word count closely to preserve the conversation's rhythm without shifting towards plans for a real-world interaction, ensuring a seamless and engaging textual exchange.
                    Don't use emoji.
                    can you make the replies more flirtatious and quirky and using slangs and also using meme knowledge`,
                tools: [{ type: "retrieval" }],
                model: "gpt-3.5-turbo"
            });
            const myAssistants = await openai.beta.assistants.list({
                order: "desc",
                limit: "20",
            });
            // console.log('assistanrt', myAssistants);
            const thread = await openai.beta.threads.create();
            // console.log('thread', thread)
            console.log('thread', thread.id)

            const message = await openai.beta.threads.messages.create(
                thread.id,
                {
                    role: "user",
                    content: conversation.data.text
                }
            );

            let run = await openai.beta.threads.runs.create(
                thread.id,
                {
                    assistant_id: "asst_kkWJFrQ5zj5LHNxBZxoWib7",
                    instructions: "Please address the user as Friend. The user has a playful personality."
                }
            );
            let runStatus = null;
            function delay(time) {
                return new Promise(resolve => setTimeout(resolve, time));
            }

            async function checkRunStatus(threadId, runId) {
                let run = await openai.beta.threads.runs.retrieve(threadId, runId);

                // Keep polling the run status every second until it is 'completed'
                while (run.status !== "completed") {
                    await delay(1000); // Wait for 1 second
                    run = await openai.beta.threads.runs.retrieve(threadId, runId);
                }

                console.log('Run completed');
                return run;
            }
            const completedRun = await checkRunStatus("run_Xfs3WiK7Ktb1yHYgAckvTwI.", run.id);
            (async () => {
                let run = await openai.beta.threads.runs.create(
                    thread.id,
                    {
                        assistant_id: "asst_kkWJFrQ5z5LHNxBZxoWi5b7",
                        instructions: "Please address the user as Friend. The user has a playful personality."
                    }
                );

                // Wait for the run to complete
                const completedRun = await checkRunStatus("run_Xfs3FWiK7Ktb1yHYgckvTwI.", run.id);

                console.log('Completed run:', completedRun);

                // Now that the run is completed, you can list the messages
                const messages = await openai.beta.threads.messages.list(thread.id);
                console.log('Messages:', messages);
                logger.debug(`RESULT: OpenAIClass-decodeImageFromCasper - DATA: ${messages.data.text}`);
            })();

            // console.log("RESPONSE HERE IS:", messages);


            return {
                ...response.CARBON.CNAUGHT.PLACE_ORDER.SUCCESS,
                results: {

                }
            }
        }
        catch (error) {
            console.error('Error generating text:', error.response ? error.response.data : error.message);
            throw error;
        }
    }


}