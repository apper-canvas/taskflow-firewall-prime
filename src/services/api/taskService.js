import taskData from '../mockData/task.json'

class TaskService {
  constructor() {
    this.tasks = [...taskData]
    this.nextId = Math.max(...this.tasks.map(t => parseInt(t.id))) + 1
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
  }

  async getAll() {
    await this.delay()
    return [...this.tasks]
  }

  async getById(id) {
    await this.delay()
    const task = this.tasks.find(t => t.id === id)
    if (!task) throw new Error('Task not found')
    return { ...task }
  }

  async create(taskData) {
    await this.delay()
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    this.tasks.unshift(newTask)
    return { ...newTask }
  }

  async update(id, data) {
    await this.delay()
    const index = this.tasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    
    this.tasks[index] = { ...this.tasks[index], ...data }
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.tasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    
    this.tasks.splice(index, 1)
    return true
  }
}

export const taskService = new TaskService()