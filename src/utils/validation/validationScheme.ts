import { z } from 'zod'

export const createArticleScheme = z.object({
    title: z.string().min(2).max(200),
    subtitle: z.string().min(2).max(200),
    metaDescription: z.string().min(2).max(400),
    description: z.string().min(10),
    image: z.string().url(),
    categoryId: z.number()
})

export const createCategoryScheme = z.object({
    name: z.string().min(2).max(200),
    subname: z.string().min(2).max(200),
    metaDescription: z.string().min(2).max(400),
})


export const updateArticleScheme = z.object({
    title: z.string().min(2).max(200).optional(),
    subtitle: z.string().min(2).max(200).optional(),
    metaDescription: z.string().min(2).max(400).optional(),
    description: z.string().min(10).optional(),
    image: z.string().url().optional(),
    categoryId: z.number().optional(),
})

export const updateCategoryScheme = z.object({
    name: z.string().min(2).max(200).optional(),
    subname: z.string().min(2).max(200).optional(),
    metaDescription: z.string().min(2).max(400).optional(),
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