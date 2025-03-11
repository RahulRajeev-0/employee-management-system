import api from "./api";


export const createForm = async (templateData) => {
    try {
      const response = await api.post('/employee/forms/', templateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };