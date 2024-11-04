import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    phone: '',
    email: ''
  });
  const [filter, setFilter] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:4000/')
        .then(response => setUsers(response.data))
        .catch(error => console.error('Ошибка при загрузке данных:', error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.lastName) newErrors.lastName = 'Фамилия обязательна';
    if (!formData.firstName) newErrors.firstName = 'Имя обязательно';
    if (!formData.phone.match(/^\d+$/)) newErrors.phone = 'Неверный формат телефона';
    if (!formData.email.match(/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)) newErrors.email = 'Неверный формат email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    axios.post('http://localhost:4000/submit', formData)
        .then(() => {
          setFormData({ lastName: '', firstName: '', middleName: '', phone: '', email: '' });
          fetchUsers();
        })
        .catch(error => console.error('Ошибка при добавлении данных:', error));
  };

  const handleDelete = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    axios.post('http://localhost:4000/delete', { index })
        .then(() => fetchUsers())
        .catch(error => console.error('Ошибка при удалении пользователя:', error));
  };

  // Фильтрация пользователей по фамилии
  const filteredUsers = users.filter(user =>
      user.lastName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <h2>Форма ввода данных</h2>
            <form onSubmit={handleSubmit}>
              {['lastName', 'firstName', 'middleName', 'phone', 'email'].map((field, index) => (
                  <div className="mb-3" key={index}>
                    <label className="form-label">
                      {field === 'lastName' ? 'Фамилия' :
                          field === 'firstName' ? 'Имя' :
                              field === 'middleName' ? 'Отчество' :
                                  field === 'phone' ? 'Телефон' : 'Email'}
                    </label>
                    <input
                        type={field === 'email' ? 'email' : 'text'}
                        className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        required={field !== 'middleName'}
                    />
                    {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
                  </div>
              ))}
              <button type="submit" className="btn btn-primary">Добавить</button>
            </form>
          </div>

          <div className="col-md-6">
            <h2>Список пользователей</h2>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Фильтр по фамилии"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
            <table className="table table-striped">
              <thead>
              <tr>
                <th>Фамилия</th>
                <th>Имя</th>
                <th>Отчество</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Удалить</th>
              </tr>
              </thead>
              <tbody>
              {filteredUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user.lastName}</td>
                    <td>{user.firstName}</td>
                    <td>{user.middleName}</td>
                    <td>{user.phone}</td>
                    <td>{user.email}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>
                        Удалить
                      </button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}

export default App;