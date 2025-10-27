
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './Proveedores.module.css';

interface Proveedor {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

const initialProveedores: Proveedor[] = [
  { id: 1, nombre: 'Casa de repuestos 1', email: 'casarep1@example.com', telefono: '123453158' },
  { id: 2, nombre: 'Casa de repuestos 2', email: 'casarep2@example.com', telefono: '987658513' },
];

const Proveedores = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>(initialProveedores);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar' | 'editar' | ''>('');
  const [form] = Form.useForm();

  const columns: ColumnsType<Proveedor> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono' },
  ];

  const handleAgregar = () => {
    setFormType('agregar');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditar = () => {
    if (selectedRowKeys.length !== 1) return;
    setFormType('editar');
    const proveedor = proveedores.find(prv =>prv.id === selectedRowKeys[0]);
    if (proveedor) {
      form.setFieldsValue(proveedor);
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar proveedor(es)?',
      content: '¿Estás seguro que deseas eliminar el/los proveedores(es) seleccionado(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setProveedores(proveedores.filter(prv => !selectedRowKeys.includes(prv.id)));
        setSelectedRowKeys([]);
        message.success('Proveedor(es) eliminado(s)');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (formType === 'agregar') {
        const newId = proveedores.length ? Math.max(...proveedores.map(prv => prv.id)) + 1 : 1;
        setProveedores([...proveedores, { id: newId, ...values }]);
        message.success('Proveedor agregado');
      } else if (formType === 'editar') {
        setProveedores(proveedores.map(prv => prv.id === selectedRowKeys[0] ? { ...prv, ...values } : prv));
        message.success('Proveedor editado');
      }
      setIsModalOpen(false);
      setFormType('');
      form.resetFields();
      setSelectedRowKeys([]);
    } catch (err) {
      // validation error
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setFormType('');
    form.resetFields();
  };

  const rowSelection = {
    type: 'radio' as const,
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div className="proveedores-container" style={{ padding: 24 }}>
      <h1 className="proveedores-title">Proveedores</h1>
      <Space className="proveedores-actions" style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar</Button>
        <Button onClick={handleEditar} disabled={selectedRowKeys.length !== 1}>Editar</Button>
        <Button danger onClick={handleEliminar} disabled={selectedRowKeys.length === 0}>Eliminar</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={proveedores}
        rowSelection={rowSelection}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        open={isModalOpen}
        title={formType === 'agregar' ? 'Agregar Proveedor' : 'Editar Proveedor'}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ nombre: '', email: '', telefono: '' }}
        >
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Ingrese el nombre' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Ingrese un email válido' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Teléfono"
            name="telefono"
            rules={[{ required: true, message: 'Ingrese el teléfono' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Proveedores;
