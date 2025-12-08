import { Router } from "express";
import { chatConversation } from "../controller/openAIController";

export const router: Router = Router();

router.route('/conversation')
    .post(chatConversation);