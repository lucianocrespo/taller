import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Select, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './Clientes.module.css';

interface TipoDocumento {
  id: number;
  nombre: string;
}

interface Calle {
  id: number;
  nombre: string;
}

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  idCalle: number;
  altura: number;
  piso: number;
  depto: number;
  idTipoDocumento: number;
}

const tiposDocumento: TipoDocumento[] = [
  { id: 1, nombre: 'DNI' },
  { id: 2, nombre: 'CUIT' },
  { id: 3, nombre: 'CUIL' },
  { id: 4, nombre: 'Pasaporte' },
];

const calles: Calle[] = [
  { id: 1, nombre: 'San Martín' },
  { id: 2, nombre: 'Avellaneda' },
  { id: 3, nombre: 'Sargento Cabral' },
  { id: 4, nombre: 'Rivadavia' },
];

const initialClientes: Cliente[] = [
  { id: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', telefono: '123456789', idCalle: 1, altura: 123, piso: 2, depto: 4, idTipoDocumento: 1 },
  { id: 2, nombre: 'Ana', apellido: 'Gómez', email: 'ana@example.com', telefono: '987654321', idCalle: 2, altura: 456, piso: 3, depto: 5, idTipoDocumento: 2 },
];

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar' | 'editar' | ''>('');
  const [form] = Form.useForm();

  const columns: ColumnsType<Cliente> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Apellido', dataIndex: 'apellido', key: 'apellido' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono' },
    { title: 'Calle', dataIndex: 'idCalle', key: 'idCalle', render: (idCalle: number) => calles.find(c => c.id === idCalle)?.nombre || '-' },
    { title: 'Altura', dataIndex: 'altura', key: 'altura' },
  ];

  const handleAgregar = () => {
    setFormType('agregar');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditar = () => {
    if (selectedRowKeys.length !== 1) return;
    setFormType('editar');
    const cliente = clientes.find(c => c.id === selectedRowKeys[0]);
    if (cliente) {
      form.setFieldsValue(cliente);
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar cliente(s)?',
      content: '¿Estás seguro que deseas eliminar el/los cliente(s) seleccionado(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setClientes(clientes.filter(c => !selectedRowKeys.includes(c.id)));
        setSelectedRowKeys([]);
        message.success('Cliente(s) eliminado(s)');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (formType === 'agregar') {
        const newId = clientes.length ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
        setClientes([...clientes, { id: newId, ...values }]);
        message.success('Cliente agregado');
      } else if (formType === 'editar') {
        setClientes(clientes.map(c => c.id === selectedRowKeys[0] ? { ...c, ...values } : c));
        message.success('Cliente editado');
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
    <div className="clientes-container" style={{ padding: 24 }}>
      <h1 className="clientes-title">Clientes</h1>
      <Space className="clientes-actions" style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar</Button>
        <Button onClick={handleEditar} disabled={selectedRowKeys.length !== 1}>Editar</Button>
        <Button danger onClick={handleEliminar} disabled={selectedRowKeys.length === 0}>Eliminar</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={clientes}
        rowSelection={rowSelection}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        open={isModalOpen}
        title={formType === 'agregar' ? 'Agregar Cliente' : 'Editar Cliente'}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ nombre: '', apellido: '', email: '', telefono: '', idCalle: undefined, altura: undefined, piso: undefined, depto: undefined, idTipoDocumento: undefined }}
        >
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Ingrese el nombre' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Apellido"
            name="apellido"
            rules={[{ required: true, message: 'Ingrese el apellido' }]}
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
            label="Tipo de Documento"
            name="idTipoDocumento"
            rules={[{ required: true, message: 'Seleccione un tipo de documento' }]}
          >
            <Select placeholder="Seleccione tipo de documento" options={tiposDocumento.map(td => ({ value: td.id, label: td.nombre }))} />
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
            label="Piso"
            name="piso"
            rules={[{ required: true, message: 'Ingrese el piso' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Departamento"
            name="depto"
            rules={[{ required: true, message: 'Ingrese el departamento' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Clientes;
