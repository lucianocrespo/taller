
import React, { useState } from 'react';
import './Clientes.css';

const initialClientes = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', telefono: '123456789' },
  { id: 2, nombre: 'Ana Gómez', email: 'ana@example.com', telefono: '987654321' },
];

const Clientes = () => {
  const [clientes, setClientes] = useState(initialClientes);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState(''); // 'agregar' | 'editar'
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '' });

  const handleRowClick = (id: number) => {
    setSelectedId(id);
  };

  const handleAgregar = () => {
    setFormType('agregar');
    setFormData({ nombre: '', email: '', telefono: '' });
    setShowForm(true);
  };

  const handleEditar = () => {
    const cliente = clientes.find(c => c.id === selectedId);
    if (!cliente) return;
    setFormType('editar');
    setFormData({ nombre: cliente.nombre, email: cliente.email, telefono: cliente.telefono });
    setShowForm(true);
  };

  const handleEliminar = () => {
    if (selectedId == null) return;
    setClientes(clientes.filter(c => c.id !== selectedId));
    setSelectedId(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formType === 'agregar') {
      const newId = clientes.length ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
      setClientes([...clientes, { id: newId, ...formData }]);
    } else if (formType === 'editar') {
      setClientes(clientes.map(c => c.id === selectedId ? { ...c, ...formData } : c));
    }
    setShowForm(false);
    setFormType('');
    setFormData({ nombre: '', email: '', telefono: '' });
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setFormType('');
    setFormData({ nombre: '', email: '', telefono: '' });
  };

  return (
    <div className="clientes-container">
      <div className="clientes-header">
        <h1>Clientes</h1>
        <div className="clientes-actions">
          <button onClick={handleAgregar}>Agregar</button>
          <button onClick={handleEditar} disabled={selectedId == null}>Editar</button>
          <button onClick={handleEliminar} disabled={selectedId == null}>Eliminar</button>
        </div>
      </div>
      <table className="clientes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr
              key={cliente.id}
              className={cliente.id === selectedId ? 'selected' : ''}
              onClick={() => handleRowClick(cliente.id)}
              style={{ cursor: 'pointer' }}
            >
              <td>{cliente.id}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefono}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="clientes-modal">
          <div className="clientes-modal-content">
            <h2>{formType === 'agregar' ? 'Agregar Cliente' : 'Editar Cliente'}</h2>
            <form onSubmit={handleFormSubmit}>
              <label>
                Nombre:
                <input name="nombre" value={formData.nombre} onChange={handleFormChange} required />
              </label>
              <label>
                Email:
                <input name="email" value={formData.email} onChange={handleFormChange} required />
              </label>
              <label>
                Teléfono:
                <input name="telefono" value={formData.telefono} onChange={handleFormChange} required />
              </label>
              <div className="clientes-modal-actions">
                <button type="submit">Guardar</button>
                <button type="button" onClick={handleFormCancel}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
