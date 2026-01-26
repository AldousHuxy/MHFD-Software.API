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
    cities: z.array(z.string()),
    communityIds: z.array(z.string()),
    counties: z.array(z.string()),
});

export type Report = z.infer<typeof reportSchema> & {
    correspondence: Record<string, string>;
};