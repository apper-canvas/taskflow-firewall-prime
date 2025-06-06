class ProjectService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'Project';
    
    // All fields available in the Project table
    this.allFields = [
      'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
      'ModifiedOn', 'ModifiedBy', 'ProjectName', 'Status', 
      'StartDate', 'EndDate', 'Progress'
    ];
    
    // Only updateable fields for create/update operations
    this.updateableFields = [
      'Name', 'ProjectName', 'Status', 'StartDate', 'EndDate', 'Progress'
    ];
  }

  async getAll() {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [
          {
            fieldName: "StartDate",
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
        name: record.Name,
        projectName: record.ProjectName,
        status: record.Status || 'Active',
        startDate: record.StartDate,
        endDate: record.EndDate,
        progress: record.Progress || 0,
        createdOn: record.CreatedOn,
        createdBy: record.CreatedBy,
        modifiedOn: record.ModifiedOn,
        modifiedBy: record.ModifiedBy
      }));
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw new Error('Failed to fetch projects');
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: this.allFields
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        throw new Error('Project not found');
      }
      
      const record = response.data;
      return {
        id: record.Id,
        name: record.Name,
        projectName: record.ProjectName,
        status: record.Status || 'Active',
        startDate: record.StartDate,
        endDate: record.EndDate,
        progress: record.Progress || 0,
        createdOn: record.CreatedOn,
        createdBy: record.CreatedBy,
        modifiedOn: record.ModifiedOn,
        modifiedBy: record.ModifiedBy
      };
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw new Error('Project not found');
    }
  }

  async create(projectData) {
    try {
      // Format data for database - only include updateable fields
      const dbData = {
        Name: projectData.name,
        ProjectName: projectData.projectName,
        Status: projectData.status || 'Active',
        StartDate: projectData.startDate || null,
        EndDate: projectData.endDate || null,
        Progress: projectData.progress || 0
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
          projectName: newRecord.ProjectName,
          status: newRecord.Status || 'Active',
          startDate: newRecord.StartDate,
          endDate: newRecord.EndDate,
          progress: newRecord.Progress || 0,
          createdOn: newRecord.CreatedOn,
          createdBy: newRecord.CreatedBy,
          modifiedOn: newRecord.ModifiedOn,
          modifiedBy: newRecord.ModifiedBy
        };
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      console.error("Error creating project:", error);
      throw new Error('Failed to create project');
    }
  }

  async update(id, projectData) {
    try {
      // Format data for database - only include updateable fields
      const dbData = {
        Id: id,
        Name: projectData.name,
        ProjectName: projectData.projectName,
        Status: projectData.status || 'Active',
        StartDate: projectData.startDate || null,
        EndDate: projectData.endDate || null,
        Progress: projectData.progress || 0
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
          projectName: updatedRecord.ProjectName,
          status: updatedRecord.Status || 'Active',
          startDate: updatedRecord.StartDate,
          endDate: updatedRecord.EndDate,
          progress: updatedRecord.Progress || 0,
          createdOn: updatedRecord.CreatedOn,
          createdBy: updatedRecord.CreatedBy,
          modifiedOn: updatedRecord.ModifiedOn,
          modifiedBy: updatedRecord.ModifiedBy
        };
      } else {
        throw new Error('Failed to update project');
      }
    } catch (error) {
      console.error("Error updating project:", error);
      throw new Error('Failed to update project');
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
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      throw new Error('Failed to delete project');
    }
  }
}

export const projectService = new ProjectService();