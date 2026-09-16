import { z } from "zod";

export const sessionUserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    image: z.string().nullable().default(null),
});

export const signInFormSchema = z.object({
    email: z.email({ message: "Informe um email válido." }).default(""),
    password: z.string().min(1, { message: "A senha é obrigatória." }).default(""),
});

export type SessionUserDto = z.infer<typeof sessionUserSchema>;
export type SignInFormDto = z.infer<typeof signInFormSchema>;
