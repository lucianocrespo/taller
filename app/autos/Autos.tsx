import React, { useState } from 'react';
import './Autos.css';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Auto {
  id: number;
  marca: string;
  modelo: string;
  patente: string;
}

const initialAutos: Auto[] = [
  { id: 1, marca: 'Toyota', modelo: 'Corolla', patente: 'ABC123' },
  { id: 2, marca: 'Ford', modelo: 'Fiesta', patente: 'XYZ789' },
];

const Autos = () => {
  const [autos, setAutos] = useState<Auto[]>(initialAutos);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar' | 'editar' | ''>('');
  const [form] = Form.useForm();

  const columns: ColumnsType<Auto> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Marca', dataIndex: 'marca', key: 'marca' },
    { title: 'Modelo', dataIndex: 'modelo', key: 'modelo' },
    { title: 'Patente', dataIndex: 'patente', key: 'patente' },
  ];

  const handleAgregar = () => {
    setFormType('agregar');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditar = () => {
    if (selectedRowKeys.length !== 1) return;
    setFormType('editar');
    const auto = autos.find(a => a.id === selectedRowKeys[0]);
    if (auto) {
      form.setFieldsValue(auto);
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar auto(s)?',
      content: '¿Estás seguro que deseas eliminar el/los auto(s) seleccionado(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setAutos(autos.filter(a => !selectedRowKeys.includes(a.id)));
        setSelectedRowKeys([]);
        message.success('Auto(s) eliminado(s)');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (formType === 'agregar') {
        const newId = autos.length ? Math.max(...autos.map(a => a.id)) + 1 : 1;
        setAutos([...autos, { id: newId, ...values }]);
        message.success('Auto agregado');
      } else if (formType === 'editar') {
        setAutos(autos.map(a => a.id === selectedRowKeys[0] ? { ...a, ...values } : a));
        message.success('Auto editado');
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

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Autos</h1>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar</Button>
        <Button onClick={handleEditar} disabled={selectedRowKeys.length !== 1}>Editar</Button>
        <Button danger onClick={handleEliminar} disabled={selectedRowKeys.length === 0}>Eliminar</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={autos}
        rowSelection={{
          type: 'radio',
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={false}
      />
      <Modal
        open={isModalOpen}
        title={formType === 'agregar' ? 'Agregar Auto' : 'Editar Auto'}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ marca: '', modelo: '', patente: '' }}
        >
          <Form.Item
            label="Marca"
            name="marca"
            rules={[{ required: true, message: 'Ingrese la marca' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Modelo"
            name="modelo"
            rules={[{ required: true, message: 'Ingrese el modelo' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Patente"
            name="patente"
            rules={[{ required: true, message: 'Ingrese la patente' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Autos;
