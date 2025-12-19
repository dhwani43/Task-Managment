import { getTasks, deleteTask } from '@/models/tasks'
import { TaskCard } from '@/components/TaskCard'
import { CreateTaskDialog } from '@/components/CreateTaskDialog'

export default async function Home() {
  const { tasks, error } = await getTasks()

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-end mb-8">
        <CreateTaskDialog />
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks?.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={deleteTask} />
        ))}
        {tasks?.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No tasks found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  )
}
