import { Router } from 'express';
import { getAllCases, getCases, parseCases } from '../controller/caseController';
import { upload } from '../middleware/uploadMiddleware';

export const router: Router = Router();

router.route('/')
    .get(getCases);
    
router.route('/all')
    .get(getAllCases);

router.route('/parse')
    .post(upload.single('file'), parseCases);