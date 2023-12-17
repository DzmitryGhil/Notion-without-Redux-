import { z } from "zod";

export const User = z.object({
  id: z.number(),
  email: z.string().email({ message: "Пожалуйста, введите корректный email." }),
  password: z
    .string()
    .min(8, {
      message: "Пароль должен включать минимум 8 символов.",
    })
    .refine((value) => /[A-Z]/.test(value), {
      message: "Пароль должен содержать прописную букву.",
    })
    .refine((value) => /[a-z]/.test(value), {
      message: "Пароль должен содержать cтрочную букву.",
    })
    .refine((value) => /[0-9]/.test(value), {
      message: "Пароль должен содержать цифру.",
    }),
  date: z.number(),
  notes: z.array(z.string()),
});
