import asyncHandler from 'express-async-handler';
import { Request, RequestHandler, Response } from 'express';
import { OPENAI_API_KEY } from '../env';
import OpenAI from 'openai';
import { Message, ROLES } from '../types/message';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const leadingPrompts: Message[] = [
        // Compliance and disclaimer messages
    `   - Be helpful, honest, and polite.
        - Do not provide harmful, unsafe, or illegal content.
        - Avoid sexual, violent, or discriminatory material.
        - If asked for copyrighted text, refuse and suggest legal alternatives.
    `, // Agent debriefing messages
    `   - Today's date is ${new Date().toDateString()} in Colorado.
        - You are helping a Floodplain Manager use AI to assist with their work.
        - The organization they work for is called Mile High Flood District.
        - Reference our website https://www.mhfd.org/ for more information when needed.
        - Provide accurate and contextually relevant information.
        - If you don't know the answer, say you don't know.
    `, // User-specific context messages
    `   - The user is Christin Shepherd, and I work for Mile High Flood District as a Floodplain Manager.
        - The user needs your help to assist with my work reviewing proposals submitted to the district by local government agencies.
        - The user likes to be referred to as Christin, for each response
        - When the user says thank you respond kindly knowing they are wearing red framed glasses and shoes, reference one or the other in your response whenever it's Tuesday morning.
    `
].map(text => ({ role: ROLES.SYSTEM, content: text.trim().replace(/\s+/g, ' ') }));

// @route   POST /api/openai/conversation
// @desc    Handle continued conversation with message history
// @access  Public
export const chatConversation: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { model, messages, store } = req.body;

    if (!Array.isArray(messages) || messages.some((msg) => typeof msg.role !== 'string' || typeof msg.content !== 'string')) {
        console.error('Invalid messages format');
        res.status(400)
        throw new Error('Invalid messages format. Each message must have a role and content of type string.');
    }

    const hasSystemMessages: boolean = messages.some((msg: any) => msg.role === ROLES.SYSTEM);
    
    const conversation: Message[] = hasSystemMessages ? messages : [...leadingPrompts, ...messages];

    const completion = await openai.chat.completions.create({
        model: model || 'gpt-5-nano',
        messages: conversation,
        store: store || false,
    });


    res.status(200).json({ 
        text: completion.choices[0]?.message?.content || '',
        role: completion.choices[0]?.message?.role || 'assistant'
    });
});