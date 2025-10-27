
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './medioDePago.module.css';

interface MedioDePago {
  id: number;
  tipo: string;
}

const initialMediosDePago: MedioDePago[] = [
  { id: 1, tipo: 'Efectivo' },
  { id: 2, tipo: 'Transferencia' },
];

const MedioDePago = () => {
  const [mediosDePago, setMediosDePago] = useState<MedioDePago[]>(initialMediosDePago);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar' | 'editar' | ''>('');
  const [form] = Form.useForm();

  const columns: ColumnsType<MedioDePago> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
  ];

  const handleAgregar = () => {
    setFormType('agregar');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditar = () => {
    if (selectedRowKeys.length !== 1) return;
    setFormType('editar');
    const medioDePago = mediosDePago.find(mp => mp.id === selectedRowKeys[0]);
    if (medioDePago) {
      form.setFieldsValue(medioDePago);
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar medio(s) de pago?',
      content: '¿Estás seguro que deseas eliminar el/los medio(s) de pago seleccionado(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setMediosDePago(mediosDePago.filter(mp => !selectedRowKeys.includes(mp.id)));
        setSelectedRowKeys([]);
        message.success('Medio(s) de pago eliminado(s)');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (formType === 'agregar') {
        const newId = mediosDePago.length ? Math.max(...mediosDePago.map(mp => mp.id)) + 1 : 1;
        setMediosDePago([...mediosDePago, { id: newId, ...values }]);
        message.success('Medio de pago agregado');
      } else if (formType === 'editar') {
        setMediosDePago(mediosDePago.map(mp => mp.id === selectedRowKeys[0] ? { ...mp, ...values } : mp));
        message.success('Medio de pago editado');
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
    <div className="mediosDePago-container" style={{ padding: 24 }}>
      <h1 className="mediosDePago-title">Medios de pago</h1>
      <Space className="mediosDePago-actions" style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar</Button>
        <Button onClick={handleEditar} disabled={selectedRowKeys.length !== 1}>Editar</Button>
        <Button danger onClick={handleEliminar} disabled={selectedRowKeys.length === 0}>Eliminar</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={mediosDePago}
        rowSelection={rowSelection}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        open={isModalOpen}
        title={formType === 'agregar' ? 'Agregar Medio de pago' : 'Editar Medio de pago'}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ tipo: '' }}
        >
          <Form.Item
            label="Tipo"
            name="tipo"
            rules={[{ required: true, message: 'Ingrese el tipo' }]}
          >
            
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MedioDePago;
