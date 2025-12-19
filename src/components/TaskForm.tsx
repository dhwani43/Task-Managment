'use client'

import { useState } from 'react'
import { createTask, updateTask } from '@/models/tasks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { DialogFooter } from '@/components/ui/dialog'

interface TaskFormProps {
  task?: {
    id: string
    title: string
    description: string | null
    priority: string
    status: string
  }
  onSuccess?: () => void
}

export function TaskForm({ task, onSuccess }: TaskFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const title = formData.get('title') as string
    if (title.length < 5 || title.length > 50) {
      setError('Title must be between 5 and 50 characters')
      setLoading(false)
      return
    }

    const description = formData.get('description') as string
    if (!description || description.length < 5 || description.length > 1000) {
      setError('Description must be between 5 and 1000 characters')
      setLoading(false)
      return
    }

    let result
    if (task) {
      result = await updateTask(task.id, formData)
    } else {
      result = await createTask(formData)
    }

    if (result.error) {
      setError(result.error)
    } else {
      onSuccess?.()
    }
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={task?.title}
          required
          minLength={5}
          maxLength={50}
          placeholder="Task title"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={task?.description || ''}
          placeholder="Task description"
          required
          minLength={5}
          maxLength={1000}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select name="priority" defaultValue={task?.priority || 'medium'}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {task && (
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={task.status}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>
      </DialogFooter>
    </form>
  )
}
