import { z } from 'zod';

export const reportSchema = z.object({
    projectId: z.string(),
    caseNum: z.string(),
    received: z.string(),
    type: z.string(),
    analystOrEngineer: z.string(),
    dueDate: z.string().optional(),
    workGroup: z.string(),
    status: z.string(),
    organization: z.string(),
    city: z.string(),
    communityId: z.string(),
    region: z.string(),
    county: z.string(),
    correspondence: z.array(z.string()),
});

export type Report = z.infer<typeof reportSchema>;