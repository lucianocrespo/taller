
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './ModelosAuto.module.css';

interface Marca {
  id: number;
  nombre: string;
}

interface ModeloAuto {
  id: number;
  nombre: string;
  idMarca: number;
}

const marcas: Marca[] = [
  { id: 1, nombre: 'Toyota' },
  { id: 2, nombre: 'Chevrolet' },
  { id: 3, nombre: 'Renault' },
  { id: 4, nombre: 'Volkswagen' },
  { id: 5, nombre: 'Suzuki' },
  { id: 6, nombre: 'Peugeot' },
  { id: 7, nombre: 'Ford' },
  { id: 8, nombre: 'Fiat' },
];

const initialModelosAuto: ModeloAuto[] = [
    { id: 1, nombre: "Corolla", idMarca: 1 },
  { id: 2, nombre: "Cruze", idMarca: 2 },
  { id: 3, nombre: "Kangoo", idMarca: 3 },
  { id: 4, nombre: "Bora", idMarca: 4 },
  { id: 5, nombre: "Fun", idMarca: 5 },
  { id: 6, nombre: "Vento", idMarca: 6 },
  { id: 7, nombre: "Duster", idMarca: 7 },
  { id: 8, nombre: "Partner", idMarca: 8 },

];

const ModelosAuto = () => {
  const [modelosAuto, setModeloAuto] = useState<ModeloAuto[]>(initialModelosAuto);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar' | 'editar' | ''>('');
  const [form] = Form.useForm();

  const columns: ColumnsType<ModeloAuto> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Marca', dataIndex: 'idMarca', key: 'idMarca', render: (idMarca: number) => marcas.find(m => m.id === idMarca)?.nombre || '-' },
  ];

  const handleAgregar = () => {
    setFormType('agregar');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditar = () => {
    if (selectedRowKeys.length !== 1) return;
    setFormType('editar');
    const modeloAuto = modelosAuto.find(ma => ma.id === selectedRowKeys[0]);
    if (modeloAuto) {
      form.setFieldsValue(modeloAuto);
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar modelo(s)?',
      content: '¿Estás seguro que deseas eliminar el/los modelo(s) seleccionado(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setModeloAuto(modelosAuto.filter(ma => !selectedRowKeys.includes(ma.id)));
        setSelectedRowKeys([]);
        message.success('Modelo(s) eliminado(s)');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (formType === 'agregar') {
        const newId = modelosAuto.length ? Math.max(...modelosAuto.map(ma => ma.id)) + 1 : 1;
        setModeloAuto([...modelosAuto, { id: newId, ...values }]);
        message.success('Modelo agregado');
      } else if (formType === 'editar') {
        setModeloAuto(modelosAuto.map(ma => ma.id === selectedRowKeys[0] ? { ...ma, ...values } : ma));
        message.success('Modelo editado');
      }
      setIsModalOpen(false);
      setFormType('');
      form.resetFields();
      setSelectedRowKeys([]);
    } catch (err) {
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
    <div className="modelosAuto-container" style={{ padding: 24 }}>
      <h1 className="modelosAuto-title">Modelos de auto</h1>
      <Space className="modelosAuto-actions" style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar</Button>
        <Button onClick={handleEditar} disabled={selectedRowKeys.length !== 1}>Editar</Button>
        <Button danger onClick={handleEliminar} disabled={selectedRowKeys.length === 0}>Eliminar</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={modelosAuto}
        rowSelection={rowSelection}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        open={isModalOpen}
        title={formType === 'agregar' ? 'Agregar Modelo' : 'Editar Modelo'}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ nombre: '', idMarca: '' }}
        >
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Ingrese el nombre' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="marca" label={<span> Marca <Button size="small" type="link">Nueva Marca</Button></span>}
            rules={[{ required: true, message: 'Seleccione una marca' }]}
          >
            <Select placeholder="Seleccione una marca" options={marcas.map(m => ({ value: m.id, label: m.nombre }))} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModelosAuto;
