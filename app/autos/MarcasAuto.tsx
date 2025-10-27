
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './MarcasAuto.module.css';

interface MarcaAuto {
  id: number;
  nombre: string;
}

const initialMarcasAuto: MarcaAuto[] = [
  { id: 1, nombre: 'Toyota' },
  { id: 2, nombre: 'Chevrolet' },
  { id: 3, nombre: 'Renault' },
  { id: 4, nombre: 'Volkswagen' },
  { id: 5, nombre: 'Suzuki' },
  { id: 6, nombre: 'Volkswagen' },
  { id: 7, nombre: 'Renault' },
  { id: 8, nombre: 'Peugeot' },

];

const MarcasAuto = () => {
  const [marcasAuto, setMarcaAuto] = useState<MarcaAuto[]>(initialMarcasAuto);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar' | 'editar' | ''>('');
  const [form] = Form.useForm();

  const columns: ColumnsType<MarcaAuto> = [
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
    const marcaAuto = marcasAuto.find(mca => mca.id === selectedRowKeys[0]);
    if (marcaAuto) {
      form.setFieldsValue(marcaAuto);
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar marca(s)?',
      content: '¿Estás seguro que deseas eliminar la/las marca(s) seleccionada(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setMarcaAuto(marcasAuto.filter(mca => !selectedRowKeys.includes(mca.id)));
        setSelectedRowKeys([]);
        message.success('Marca(s) eliminada(s)');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (formType === 'agregar') {
        const newId = marcasAuto.length ? Math.max(...marcasAuto.map(mca => mca.id)) + 1 : 1;
        setMarcaAuto([...marcasAuto, { id: newId, ...values }]);
        message.success('Marca agregada');
      } else if (formType === 'editar') {
        setMarcaAuto(marcasAuto.map(mca => mca.id === selectedRowKeys[0] ? { ...mca, ...values } : mca));
        message.success('Marca editada');
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
    <div className="marcasAuto-container" style={{ padding: 24 }}>
      <h1 className="marcasAuto-title">Marcas de auto</h1>
      <Space className="marcasAuto-actions" style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar</Button>
        <Button onClick={handleEditar} disabled={selectedRowKeys.length !== 1}>Editar</Button>
        <Button danger onClick={handleEliminar} disabled={selectedRowKeys.length === 0}>Eliminar</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={marcasAuto}
        rowSelection={rowSelection}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        open={isModalOpen}
        title={formType === 'agregar' ? 'Agregar Marca' : 'Editar Marca'}
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

export default MarcasAuto;
