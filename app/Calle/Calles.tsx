
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './Calles.module.css';

interface Calle {
  id: number;
  nombre: string;
}

const initialCalles: Calle[] = [
  { id: 1, nombre: 'San Martin' },
  { id: 2, nombre: 'Del Campo' },
  { id: 3, nombre: 'Alsina' },
  { id: 4, nombre: 'Varela' },
  { id: 5, nombre: 'Gutierrez' },
  { id: 6, nombre: 'Artigas' },
  { id: 7, nombre: 'Estrada' },
  { id: 8, nombre: 'Mitre' },
  { id: 9, nombre: 'Balcarse' },
  { id: 10, nombre: 'Encina' },
];

const Calles = () => {
  const [calles, setCalle] = useState<Calle[]>(initialCalles);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar' | 'editar' | ''>('');
  const [form] = Form.useForm();

  const columns: ColumnsType<Calle> = [
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
    const calle = calles.find(cll => cll.id === selectedRowKeys[0]);
    if (calle) {
      form.setFieldsValue(calle);
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar calle?',
      content: '¿Estás seguro que deseas eliminar la(s) calle(s) seleccionada(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setCalle(calles.filter(cll => !selectedRowKeys.includes(cll.id)));
        setSelectedRowKeys([]);
        message.success('Calle(s) eliminada(s)');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (formType === 'agregar') {
        const newId = calles.length ? Math.max(...calles.map(cll => cll.id)) + 1 : 1;
        setCalle([...calles, { id: newId, ...values }]);
        message.success('Calle agregada');
      } else if (formType === 'editar') {
        setCalle(calles.map(cll => cll.id === selectedRowKeys[0] ? { ...cll, ...values } : cll));
        message.success('Calle editada');
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
    <div className="calles-container" style={{ padding: 24 }}>
      <h1 className="calles-title">Calles</h1>
      <Space className="calles-actions" style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar</Button>
        <Button onClick={handleEditar} disabled={selectedRowKeys.length !== 1}>Editar</Button>
        <Button danger onClick={handleEliminar} disabled={selectedRowKeys.length === 0}>Eliminar</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={calles}
        rowSelection={rowSelection}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        open={isModalOpen}
        title={formType === 'agregar' ? 'Agregar Calle' : 'Editar Calle'}
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

export default Calles;
