import React, { useEffect, useState } from 'react';

export default function HomePage() {
  const [trainings, setTrainings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    content: '',
    file: null,
  });
  const [updateData, setUpdateData] = useState({
    id: '',
    title: '',
    description: '',
    category: '',
    content: '',
    file: null,
  });

  const loadTrainings = async () => {
    try {
      const response = await fetch('http://localhost:1234/api/trainings');
      if (!response.ok) {
        throw new Error('Failed to fetch trainings');
      }
      const data = await response.json();
      setTrainings(data.data);
    } catch (error) {
      console.error('Error loading trainings:', error.message);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:1234/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error('Error loading categories:', error.message);
    }
  };

  useEffect(() => {
    loadTrainings();
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let base64File = null;

    if (formData.file) {
      base64File = await toBase64(formData.file);
    }

    const data = {
      title: formData.title,
      category: formData.category,
      content: formData.content,
      description: formData.description,
      file: base64File,
    };

    try {
      const response = await fetch('http://localhost:1234/api/trainings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add training');
      }

      setFormData({
        title: '',
        category: '',
        content: '',
        description: '',
        file: null,
      });
      loadTrainings();
    } catch (error) {
      console.error('Error adding training:', error.message);
    }
  };

  const deleteTraining = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/trainings/${id}`,
        { method: 'DELETE' }
      );
      if (!response.ok) {
        throw new Error('Failed to delete training');
      }
      loadTrainings();
    } catch (error) {
      console.error('Error deleting training:', error.message);
    }
  };

  const handleUpdate = (training) => {
    setUpdateData({
      id: training._id,
      title: training.title,
      category: training.category,
      content: training.content,
      description: training.description,
      file: null,
    });
  };

  const updateTraining = async (e) => {
    e.preventDefault();
    let base64File = null;

    if (updateData.file) {
      base64File = await toBase64(updateData.file);
    }

    const data = {
      title: updateData.title,
      description: updateData.description,
      category: updateData.category,
      content: updateData.content,
      file: base64File,
    };

    try {
      const response = await fetch(
        `http://localhost:1234/api/trainings/${updateData.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update training');
      }

      setUpdateData({
        id: '',
        category: '',
        content: '',
        title: '',
        description: '',
        file: null,
      });
      loadTrainings();
    } catch (error) {
      console.error('Error updating training:', error.message);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // CRUD операції для категорій
  const addCategory = async (name) => {
    try {
      const response = await fetch('http://localhost:1234/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error('Failed to add category');
      }
      loadCategories();
    } catch (error) {
      console.error('Error adding category:', error.message);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/categories/${id}`,
        { method: 'DELETE' }
      );
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error.message);
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Title'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        >
          <option value=''>Select category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type='text'
          placeholder='Content'
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        />
        <textarea
          placeholder='Description'
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          type='file'
          onChange={(e) =>
            setFormData({ ...formData, file: e.target.files[0] })
          }
        />
        <button type='submit'>Add Training</button>
      </form>

      <h2>Trainings:</h2>
      <ul>
        {trainings.map((training) => (
          <li key={training._id}>
            <div>
              <p>{training.title}</p>
              <p>{training.content}</p>
              <p>{training.description}</p>
              <p>{training.category.name}</p>
              <a
                href={'http://localhost:1234/' + training?.file?.filePath ?? ''}
              >
                {training?.file?.filePath ?? ''}
              </a>
              <button onClick={() => deleteTraining(training._id)}>
                Delete
              </button>
              <button onClick={() => handleUpdate(training)}>Update</button>
            </div>
          </li>
        ))}
      </ul>

      {updateData.id && (
        <form onSubmit={updateTraining}>
          <input
            type='text'
            placeholder='New Title'
            value={updateData.title}
            onChange={(e) =>
              setUpdateData({ ...updateData, title: e.target.value })
            }
          />
          <textarea
            placeholder='New Description'
            value={updateData.description}
            onChange={(e) =>
              setUpdateData({ ...updateData, description: e.target.value })
            }
          />
          <select
            value={updateData.category}
            onChange={(e) =>
              setUpdateData({ ...updateData, category: e.target.value })
            }
          >
            <option value=''>Select category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type='text'
            placeholder='Content'
            value={updateData.content}
            onChange={(e) =>
              setUpdateData({ ...updateData, content: e.target.value })
            }
          />
          <input
            type='file'
            onChange={(e) =>
              setUpdateData({ ...updateData, file: e.target.files[0] })
            }
          />
          <button type='submit'>Update Training</button>
        </form>
      )}

      <h2>Categories:</h2>
      <ul>
        {categories.map((category) => (
          <li key={category._id}>
            <div>
              <p>{category.name}</p>
              <button onClick={() => deleteCategory(category._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addCategory(prompt('Enter category name:'));
        }}
      >
        <button type='submit'>Add Category</button>
      </form>
    </div>
  );
}
