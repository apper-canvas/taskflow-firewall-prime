class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task';
    
    // All fields available in the task table
    this.allFields = [
      'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
      'ModifiedOn', 'ModifiedBy', 'title', 'description', 'priority', 
      'due_date', 'completed', 'archived', 'created_at', 'category'
    ];
    
    // Only updateable fields for create/update operations
    this.updateableFields = [
      'Name', 'title', 'description', 'priority', 'due_date', 
      'completed', 'archived', 'created_at', 'category'
    ];
  }

  async getAll() {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [
          {
            fieldName: "created_at",
            SortType: "DESC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response || !response.data) {
        return [];
      }
      
      // Transform database records to match UI expectations
      return response.data.map(record => ({
        id: record.Id,
        title: record.title || record.Name,
        description: record.description || '',
        category: record.category,
        priority: record.priority || 'medium',
        dueDate: record.due_date,
        completed: record.completed || false,
        archived: record.archived || false,
        createdAt: record.created_at || record.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error('Failed to fetch tasks');
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: this.allFields
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        throw new Error('Task not found');
      }
      
      const record = response.data;
      return {
        id: record.Id,
        title: record.title || record.Name,
        description: record.description || '',
        category: record.category,
        priority: record.priority || 'medium',
        dueDate: record.due_date,
        completed: record.completed || false,
        archived: record.archived || false,
        createdAt: record.created_at || record.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw new Error('Task not found');
    }
  }

  async create(taskData) {
    try {
      // Format data for database - only include updateable fields
      const dbData = {
        Name: taskData.title,
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        due_date: taskData.dueDate || null,
        completed: taskData.completed || false,
        archived: taskData.archived || false,
        created_at: taskData.createdAt || new Date().toISOString(),
        category: taskData.category
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (response && response.success && response.results && response.results[0]?.success) {
        const newRecord = response.results[0].data;
        return {
          id: newRecord.Id,
          title: newRecord.title || newRecord.Name,
          description: newRecord.description || '',
          category: newRecord.category,
          priority: newRecord.priority || 'medium',
          dueDate: newRecord.due_date,
          completed: newRecord.completed || false,
          archived: newRecord.archived || false,
          createdAt: newRecord.created_at || newRecord.CreatedOn
        };
      } else {
        throw new Error('Failed to create task');
      }
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error('Failed to create task');
    }
  }

  async update(id, taskData) {
    try {
      // Format data for database - only include updateable fields
      const dbData = {
        Id: id,
        Name: taskData.title,
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        due_date: taskData.dueDate || null,
        completed: taskData.completed || false,
        archived: taskData.archived || false,
        category: taskData.category
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (response && response.success && response.results && response.results[0]?.success) {
        const updatedRecord = response.results[0].data;
        return {
          id: updatedRecord.Id,
          title: updatedRecord.title || updatedRecord.Name,
          description: updatedRecord.description || '',
          category: updatedRecord.category,
          priority: updatedRecord.priority || 'medium',
          dueDate: updatedRecord.due_date,
          completed: updatedRecord.completed || false,
          archived: updatedRecord.archived || false,
          createdAt: updatedRecord.created_at || updatedRecord.CreatedOn
        };
      } else {
        throw new Error('Failed to update task');
      }
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error('Failed to update task');
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (response && response.success && response.results && response.results[0]?.success) {
        return true;
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error('Failed to delete task');
    }
  }
}

export const taskService = new TaskService();