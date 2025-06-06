import categoryData from '../mockData/category.json'

class CategoryService {
  constructor() {
    this.categories = [...categoryData]
    this.nextId = Math.max(...this.categories.map(c => parseInt(c.id))) + 1
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
  }

  async getAll() {
    await this.delay()
    return [...this.categories]
  }

  async getById(id) {
    await this.delay()
    const category = this.categories.find(c => c.id === id)
    if (!category) throw new Error('Category not found')
    return { ...category }
  }

  async create(categoryData) {
    await this.delay()
    const newCategory = {
      ...categoryData,
      id: Date.now().toString(),
      taskCount: 0
    }
    this.categories.push(newCategory)
    return { ...newCategory }
  }

  async update(id, data) {
    await this.delay()
    const index = this.categories.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Category not found')
    
    this.categories[index] = { ...this.categories[index], ...data }
    return { ...this.categories[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.categories.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Category not found')
    
    this.categories.splice(index, 1)
    return true
  }
}

export const categoryService = new CategoryService()