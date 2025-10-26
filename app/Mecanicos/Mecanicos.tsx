
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './Mecanicos.css';

interface Mecanico {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

const initialMecanicos: Mecanico[] = [
  { id: 1, nombre: 'Alberto Gonzalez', email: 'albert@example.com', telefono: '123446297' },
  { id: 2, nombre: 'Matias Pinedo', email: 'mati@example.com', telefono: '987667428' },
];

const Mecanicos = () => {
  const [mecanicos, setMecanicos] = useState<Mecanico[]>(initialMecanicos);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar' | 'editar' | ''>('');
  const [form] = Form.useForm();

  const columns: ColumnsType<Mecanico> = [
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
    const mecanico = mecanicos.find(m => m.id === selectedRowKeys[0]);
    if (mecanico) {
      form.setFieldsValue(mecanico);
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar mecanico(s)?',
      content: '¿Estás seguro que deseas eliminar el/los mecanico(s) seleccionado(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setMecanicos(mecanicos.filter(m => !selectedRowKeys.includes(m.id)));
        setSelectedRowKeys([]);
        message.success('Mecanico(s) eliminado(s)');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (formType === 'agregar') {
        const newId = mecanicos.length ? Math.max(...mecanicos.map(m => m.id)) + 1 : 1;
        setMecanicos([...mecanicos, { id: newId, ...values }]);
        message.success('Mecanico agregado');
      } else if (formType === 'editar') {
        setMecanicos(mecanicos.map(m => m.id === selectedRowKeys[0] ? { ...m, ...values } : m));
        message.success('Mecanico editado');
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
    <div className="mecanicos-container" style={{ padding: 24 }}>
      <h1 className="mecanicos-title">Mecanicos</h1>
      <Space className="mecanicos-actions" style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar</Button>
        <Button onClick={handleEditar} disabled={selectedRowKeys.length !== 1}>Editar</Button>
        <Button danger onClick={handleEliminar} disabled={selectedRowKeys.length === 0}>Eliminar</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={mecanicos}
        rowSelection={rowSelection}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        open={isModalOpen}
        title={formType === 'agregar' ? 'Agregar Mecanico' : 'Editar Mecanico'}
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

export default Mecanicos;
