class CategoryService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'category';
    
    // All fields available in the category table
    this.allFields = [
      'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
      'ModifiedOn', 'ModifiedBy', 'task_count'
    ];
    
    // Only updateable fields for create/update operations
    this.updateableFields = ['Name', 'task_count'];
  }

  async getAll() {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [
          {
            fieldName: "Name",
            SortType: "ASC"
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
        name: record.Name,
        taskCount: record.task_count || 0
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error('Failed to fetch categories');
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: this.allFields
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        throw new Error('Category not found');
      }
      
      const record = response.data;
      return {
        id: record.Id,
        name: record.Name,
        taskCount: record.task_count || 0
      };
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw new Error('Category not found');
    }
  }

  async create(categoryData) {
    try {
      // Format data for database - only include updateable fields
      const dbData = {
        Name: categoryData.name,
        task_count: categoryData.taskCount || 0
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (response && response.success && response.results && response.results[0]?.success) {
        const newRecord = response.results[0].data;
        return {
          id: newRecord.Id,
          name: newRecord.Name,
          taskCount: newRecord.task_count || 0
        };
      } else {
        throw new Error('Failed to create category');
      }
    } catch (error) {
      console.error("Error creating category:", error);
      throw new Error('Failed to create category');
    }
  }

  async update(id, categoryData) {
    try {
      // Format data for database - only include updateable fields
      const dbData = {
        Id: id,
        Name: categoryData.name,
        task_count: categoryData.taskCount || 0
      };
      
      const params = {
        records: [dbData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (response && response.success && response.results && response.results[0]?.success) {
        const updatedRecord = response.results[0].data;
        return {
          id: updatedRecord.Id,
          name: updatedRecord.Name,
          taskCount: updatedRecord.task_count || 0
        };
      } else {
        throw new Error('Failed to update category');
      }
    } catch (error) {
      console.error("Error updating category:", error);
      throw new Error('Failed to update category');
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
        throw new Error('Failed to delete category');
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      throw new Error('Failed to delete category');
    }
  }
}

export const categoryService = new CategoryService();