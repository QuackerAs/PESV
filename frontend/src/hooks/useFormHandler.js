import { useState } from 'react';

export const useFormHandler = (initialValues = {}) => {
  const [formData, setFormData] = useState(initialValues);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const setFormError = (errorMessage) => {
    setError(errorMessage);
  };

  const resetForm = () => {
    setFormData(initialValues);
    setError('');
  };

  return {
    formData,
    setFormData,
    error,
    setFormError,
    loading,
    setLoading,
    handleChange,
    resetForm,
  };
};

export default useFormHandler;
