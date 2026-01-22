import asyncHandler from 'express-async-handler';
import { Request, RequestHandler, Response } from 'express';
import { PDFParse } from 'pdf-parse';
import { parseReport } from '../utils/parseReport';
import fs from 'fs/promises';
import path from 'path';

// @desc    Get Cases
// @route   GET /api/cases/all
// @access  Public
export const getAllCases: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const files = await fs.readdir('./src/data');
    
    const cases = await Promise.all(files.map(async file => {
        const parser = new PDFParse({ url: path.join('./src/data', file) });

        const { text } = await parser.getText();

        const report = parseReport(text);

        return {
            filename: file,
            report,
        };
    }))

    res.status(200).json(cases);
});

// @desc    Get Cases By Filename
// @route   GET /api/cases?filename=FILENAME
// @access  Public
export const getCases: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const filename = req.query.filename as string;
    const files = await fs.readdir('./src/data');

    if (!filename || !files.includes(filename)) {
        res.status(404);
        throw new Error('File not found');
    }

    const parser = new PDFParse({ url: path.join('./src/data', filename) });

    const { text } = await parser.getText();

    const report = parseReport(text);

    res.status(200).json(report);

});

// @desc    Parse Cases from uploaded PDF
// @route   POST /api/cases/parse
// @access  Public
export const parseCases: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    const filePath = path.join('./src/data', req.file.originalname);
    
    await fs.writeFile(filePath, req.file.buffer).then(() => {
        res.status(200).json({ message: 'File uploaded successfully' });
    }).catch((error) => {
        res.status(500);
        throw new Error('Error saving file: ' + error.message);
    });
});