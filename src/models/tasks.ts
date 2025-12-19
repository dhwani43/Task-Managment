'use server'

import prisma from '@/services/prisma'
import { revalidatePath } from 'next/cache'

export async function getTasks() {
    try {
        const tasks = await prisma.task.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
        })
        return { tasks }
    } catch (error) {
        return { error: 'Failed to fetch tasks' }
    }
}

export async function createTask(formData: FormData) {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const priority = formData.get('priority') as string

    if (!title) {
        return { error: 'Title is required' }
    }

    if (title.length < 5 || title.length > 50) {
        return { error: 'Title must be between 5 and 50 characters' }
    }

    if (!description) {
        return { error: 'Description is required' }
    }

    if (description.length < 5 || description.length > 1000) {
        return { error: 'Description must be between 5 and 1000 characters' }
    }

    try {
        await prisma.task.create({
            data: {
                title,
                description,
                priority,
                status: 'todo',
            },
        })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        return { error: 'Failed to create task' }
    }
}

export async function updateTask(id: string, formData: FormData) {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const priority = formData.get('priority') as string
    const status = formData.get('status') as string

    if (!title) {
        return { error: 'Title is required' }
    }

    if (title.length < 5 || title.length > 50) {
        return { error: 'Title must be between 5 and 50 characters' }
    }

    if (!description) {
        return { error: 'Description is required' }
    }

    if (description.length < 5 || description.length > 1000) {
        return { error: 'Description must be between 5 and 1000 characters' }
    }

    try {
        await prisma.task.update({
            where: { id },
            data: {
                title,
                description,
                priority,
                status,
            },
        })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        return { error: 'Failed to update task' }
    }
}

export async function deleteTask(id: string) {
    try {
        await prisma.task.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        return { error: 'Failed to delete task' }
    }
}
