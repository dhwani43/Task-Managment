'use client'

import { useState } from 'react'
import { deleteTask } from '@/models/tasks'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { TaskForm } from './TaskForm'
import { Pencil, Trash2 } from 'lucide-react'
import { TASK_PRIORITIES, TASK_STATUSES } from '@/utils/constants/tasks'

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

interface TaskCardProps {
  task: {
    id: string
    title: string
    description: string | null
    priority: string
    status: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  }
  onDelete: (id: string) => Promise<{ error?: string; success?: boolean }>
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const [open, setOpen] = useState(false)

  const priorityColor = {
    low: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    high: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
  }[task.priority as keyof typeof TASK_PRIORITIES] || 'bg-gray-500/10 text-gray-500'

  const statusColor = {
    todo: 'bg-slate-500/10 text-slate-500',
    'in-progress': 'bg-blue-500/10 text-blue-500',
    done: 'bg-green-500/10 text-green-500',
  }[task.status as keyof typeof TASK_STATUSES] || 'bg-gray-500/10 text-gray-500'

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">{task.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-xs">
            {task.description}
          </CardDescription>
        </div>
        <Badge variant="outline" className={priorityColor}>
          {TASK_PRIORITIES[task.priority as keyof typeof TASK_PRIORITIES]}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className={statusColor}>
            {TASK_STATUSES[task.status as keyof typeof TASK_STATUSES]}
          </Badge>
          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <TaskForm task={task} onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>

        <form action={async () => {
          const result = await onDelete(task.id)
          if (result?.error) {
            alert(result.error)
          }
        }}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
