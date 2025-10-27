
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './servicios.module.css';

interface Servicio {
  id: number;
  nombre: string;
  importe: number;
  observacion: string;
}

const initialServicios: Servicio[] = [
  { id: 1, nombre: 'Alineacion', importe: 20000, observacion: '' },
  { id: 2, nombre: 'Balanceo', importe: 16000, observacion: '' },
  { id: 3, nombre: 'Rotacion de ruedas', importe: 15000, observacion: '' },
  { id: 4, nombre: 'Cambio de pastilla/disco de freno', importe: 22000, observacion: '' },
  { id: 5, nombre: 'Cambio de amortiguador', importe: 13000, observacion: '' },
  { id: 6, nombre: 'Cambio de espiral', importe: 17000, observacion: '' },
  { id: 7, nombre: 'Cambio de bieletas', importe: 25000, observacion: '' },
  { id: 8, nombre: 'Cambio de precap', importe: 20000, observacion: '' },
];

const Servicios = () => {
  const [servicios, setServicios] = useState<Servicio[]>(initialServicios);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar' | 'editar' | ''>('');
  const [form] = Form.useForm();

  const columns: ColumnsType<Servicio> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Importe', dataIndex: 'importe', key: 'importe' },
    { title: 'Observacion', dataIndex: 'observacion', key: 'observacion' },
  ];

  const handleAgregar = () => {
    setFormType('agregar');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditar = () => {
    if (selectedRowKeys.length !== 1) return;
    setFormType('editar');
    const servicio = servicios.find(s => s.id === selectedRowKeys[0]);
    if (servicio) {
      form.setFieldsValue(servicio);
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar servicio(s)?',
      content: '¿Estás seguro que deseas eliminar el/los servicios(s) seleccionado(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setServicios(servicios.filter(s => !selectedRowKeys.includes(s.id)));
        setSelectedRowKeys([]);
        message.success('Servicio(s) eliminado(s)');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (formType === 'agregar') {
        const newId = servicios.length ? Math.max(...servicios.map(s => s.id)) + 1 : 1;
        setServicios([...servicios, { id: newId, ...values }]);
        message.success('Servicio agregado');
      } else if (formType === 'editar') {
        setServicios(servicios.map(s => s.id === selectedRowKeys[0] ? { ...s, ...values } : s));
        message.success('Servicio editado');
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
    <div className="servicios-container" style={{ padding: 24 }}>
      <h1 className="servicios-title">Servicios</h1>
      <Space className="servicios-actions" style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar</Button>
        <Button onClick={handleEditar} disabled={selectedRowKeys.length !== 1}>Editar</Button>
        <Button danger onClick={handleEliminar} disabled={selectedRowKeys.length === 0}>Eliminar</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={servicios}
        rowSelection={rowSelection}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        open={isModalOpen}
        title={formType === 'agregar' ? 'Agregar Servicio' : 'Editar Servicio'}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ nombre: '', importe: '', observacion: '' }}
        >
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Ingrese el nombre' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Importe"
            name="importe"
            rules={[{ required: true, type: 'number', message: 'Ingrese un importe' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Observacion"
            name="observacion"
            rules={[{ required: true, type: 'string', message: 'Ingrese observacion' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Servicios;
