
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './TiposDocumento.module.css';

interface TipoDocumento {
  id: number;
  nombre: string;
}

const initialTiposDocumento: TipoDocumento[] = [
  { id: 1, nombre: 'DNI' },
  { id: 2, nombre: 'CUIT' },
  { id: 3, nombre: 'CUIL' },
  { id: 4, nombre: 'Pasaporte' },
];

const TiposDocumento = () => {
  const [tiposDocumento, setTipoDocumento] = useState<TipoDocumento[]>(initialTiposDocumento);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar' | 'editar' | ''>('');
  const [form] = Form.useForm();

  const columns: ColumnsType<TipoDocumento> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
  ];

  const handleAgregar = () => {
    setFormType('agregar');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditar = () => {
    if (selectedRowKeys.length !== 1) return;
    setFormType('editar');
    const tipoDocumento = tiposDocumento.find(td => td.id === selectedRowKeys[0]);
    if (tipoDocumento) {
      form.setFieldsValue(tipoDocumento);
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar tipo(s) de documento?',
      content: '¿Estás seguro que deseas eliminar el/los tipos(s) de documento seleccionado(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setTipoDocumento(tiposDocumento.filter(td => !selectedRowKeys.includes(td.id)));
        setSelectedRowKeys([]);
        message.success('Tipo(s) de documento eliminado(s)');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (formType === 'agregar') {
        const newId = tiposDocumento.length ? Math.max(...tiposDocumento.map(td => td.id)) + 1 : 1;
        setTipoDocumento([...tiposDocumento, { id: newId, ...values }]);
        message.success('Tipo de documento agregado');
      } else if (formType === 'editar') {
        setTipoDocumento(tiposDocumento.map(td => td.id === selectedRowKeys[0] ? { ...td, ...values } : td));
        message.success('Tipo de documento editado');
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
    <div className="tiposDocumento-container" style={{ padding: 24 }}>
      <h1 className="tiposDocumento-title">Tipos de documento</h1>
      <Space className="tiposDocumento-actions" style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar</Button>
        <Button onClick={handleEditar} disabled={selectedRowKeys.length !== 1}>Editar</Button>
        <Button danger onClick={handleEliminar} disabled={selectedRowKeys.length === 0}>Eliminar</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={tiposDocumento}
        rowSelection={rowSelection}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        open={isModalOpen}
        title={formType === 'agregar' ? 'Agregar Tipo de documento' : 'Editar Tipo de documento'}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ nombre: '' }}
        >
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Ingrese el nombre' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TiposDocumento;
