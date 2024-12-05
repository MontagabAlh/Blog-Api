import { z } from 'zod'

export const createArticleScheme = z.object({
    title: z.string().min(2).max(200),
    description: z.string().min(10),
})


export const updateArticleScheme = z.object({
    title: z.string().min(2).max(200).optional(),
    description: z.string().min(10).optional(),
})


export const registerSchema = z.object({
    username: z.string().min(2).max(100),
    email: z.string().min(3).max(200).email(),
    password: z.string().min(6)
})
export const createUserSchema = z.object({
    username: z.string().min(2).max(100),
    email: z.string().min(3).max(200).email(),
    password: z.string().min(6),
    isAdmin: z.boolean()
})

export const loginSchema = z.object({
    username: z.string().min(2).max(100).optional(),
    email: z.string().min(3).max(200).email().optional(),
    password: z.string().min(6)
})

export const otpCheckoutSchema = z.object({
    email: z.string().min(3).max(200).email().optional(),
    otpCode: z.string().min(6)
})

export const updateUserSchema = z.object({
    isAdmin: z.boolean(),
})

export const updateUserEmailSchema = z.object({
    email: z.string().min(3).max(200).email(),
    otpCode: z.string().min(6)
})

export const updateUserPasswordSchema = z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
})