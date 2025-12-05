
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Select, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './Proveedores.module.css';

interface Calle {
  id: number;
  nombre: string;
}

interface Proveedor {
  id: number;
  nombre: string;
  razonSocial: string;
  email: string;
  telefono: string;
  idCalle: number;
  altura: number;
  cuit: string;
}

const calles: Calle[] = [
  { id: 1, nombre: 'San Martín' },
  { id: 2, nombre: 'Avellaneda' },
  { id: 3, nombre: 'Sargento Cabral' },
  { id: 4, nombre: 'Rivadavia' },
];

const initialProveedores: Proveedor[] = [
  { id: 1, nombre: 'Casa de repuestos 1', razonSocial: 'Repuestos S.A.', email: 'casarep1@example.com', telefono: '123453158', idCalle: 1, altura: 123, cuit: '20-12345678-9' },
  { id: 2, nombre: 'Casa de repuestos 2', razonSocial: 'Distribuidora de Autos', email: 'casarep2@example.com', telefono: '987658513', idCalle: 2, altura: 456, cuit: '20-87654321-0' },
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
    { title: 'Razón Social', dataIndex: 'razonSocial', key: 'razonSocial' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono' },
    { title: 'Calle', dataIndex: 'idCalle', key: 'idCalle', render: (idCalle: number) => calles.find(c => c.id === idCalle)?.nombre || '-' },
    { title: 'Altura', dataIndex: 'altura', key: 'altura' },
    { title: 'CUIT', dataIndex: 'cuit', key: 'cuit' },
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
          initialValues={{ nombre: '', razonSocial: '', email: '', telefono: '', idCalle: undefined, altura: undefined, cuit: '' }}
        >
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Ingrese el nombre' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Razón Social"
            name="razonSocial"
            rules={[{ required: true, message: 'Ingrese la razón social' }]}
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
          <Form.Item
            label="Calle"
            name="idCalle"
            rules={[{ required: true, message: 'Seleccione una calle' }]}
          >
            <Select placeholder="Seleccione una calle" options={calles.map(c => ({ value: c.id, label: c.nombre }))} />
          </Form.Item>
          <Form.Item
            label="Altura"
            name="altura"
            rules={[{ required: true, message: 'Ingrese la altura' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="CUIT"
            name="cuit"
            rules={[{ required: true, message: 'Ingrese el CUIT' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Proveedores;
