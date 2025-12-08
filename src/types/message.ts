export const ROLES =  {
    USER: 'user',
    ASSISTANT: 'assistant',
    SYSTEM: 'system'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export type Message = {
    role: Role;
    content: string;
}