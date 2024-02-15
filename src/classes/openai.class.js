import BaseClass from "./base.class.js";
import OpenAI from "openai"

import axios from 'axios';
import response from "../lib/response.js";
import logger from "../lib/logger";


// Replace 'YOUR_OPENAI_API_KEY' with your actual OpenAI API key
const apiKey = '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';

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
                    id: '0',
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

}

