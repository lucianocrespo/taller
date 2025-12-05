
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './repuestos.module.css';

interface Modelo {
  id: number;
  nombre: string;
}

interface Repuesto {
  id: number;
  nombre: string;
  modelo: string;
  anio: number;
}

const modelos: Modelo[] = [
  { id: 1, nombre: 'Toyota Corolla' },
  { id: 2, nombre: 'Suzuki Fun' },
  { id: 3, nombre: 'Volkswagen Vento' },
  { id: 4, nombre: 'Renault Duster' },
  { id: 5, nombre: 'Peugeot Partner' },
  { id: 6, nombre: 'Chevrolet Cruze' },
  { id: 7, nombre: 'Renault Kangoo' },
  { id: 8, nombre: 'Volkswagen Bora' },
];

const anios = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  value: new Date().getFullYear() - i,
}));

const initialRepuestos: Repuesto[] = [
  { id: 1, nombre: 'Amortiguador', modelo: 'Toyota Corolla', anio: 2014 },
  { id: 2, nombre: 'Pastilla de freno', modelo: 'Suzuki Fun', anio: 2009 },
  { id: 3, nombre: 'Buje de parrilla', modelo: 'Volkswagen Vento', anio: 2012 },
  { id: 4, nombre: 'Rotula', modelo: 'Reanault Duster', anio: 2017 },
  { id: 5, nombre: 'Cazoleta', modelo: 'Peugeot Partner', anio: 2011 },
  { id: 6, nombre: 'Espiral', modelo: 'Chevrolet Cruze', anio: 2013 },
  { id: 7, nombre: 'Bieleta', modelo: 'Renault kangoo', anio: 2010 },
  { id: 8, nombre: 'Precap', modelo: 'Volkswagen Bora', anio: 2008 },
];

const Repuestos = () => {
  const [repuestos, setRepuestos] = useState<Repuesto[]>(initialRepuestos);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar' | 'editar' | ''>('');
  const [form] = Form.useForm();

  const columns: ColumnsType<Repuesto> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Modelo', dataIndex: 'modelo', key: 'modelo' },
    { title: 'Año', dataIndex: 'anio', key: 'anio' },
  ];

  const handleAgregar = () => {
    setFormType('agregar');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditar = () => {
    if (selectedRowKeys.length !== 1) return;
    setFormType('editar');
    const repuesto = repuestos.find(r => r.id === selectedRowKeys[0]);
    if (repuesto) {
      form.setFieldsValue(repuesto);
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar repuesto(s)?',
      content: '¿Estás seguro que deseas eliminar el/los repuesto(s) seleccionado(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setRepuestos(repuestos.filter(r => !selectedRowKeys.includes(r.id)));
        setSelectedRowKeys([]);
        message.success('Repuesto(s) eliminado(s)');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (formType === 'agregar') {
        const newId = repuestos.length ? Math.max(...repuestos.map(r => r.id)) + 1 : 1;
        setRepuestos([...repuestos, { id: newId, ...values }]);
        message.success('Repuesto agregado');
      } else if (formType === 'editar') {
        setRepuestos(repuestos.map(r => r.id === selectedRowKeys[0] ? { ...r, ...values } : r));
        message.success('Repuesto editado');
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
    <div className="repuestos-container" style={{ padding: 24 }}>
      <h1 className="repuestos-title">Repuestos</h1>
      <Space className="repuestos-actions" style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar</Button>
        <Button onClick={handleEditar} disabled={selectedRowKeys.length !== 1}>Editar</Button>
        <Button danger onClick={handleEliminar} disabled={selectedRowKeys.length === 0}>Eliminar</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={repuestos}
        rowSelection={rowSelection}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        open={isModalOpen}
        title={formType === 'agregar' ? 'Agregar Repuesto' : 'Editar Repuesto'}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ nombre: '', modelo: '', anio: '' }}
        >
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Ingrese el nombre' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Modelo" label={<span> Modelo <Button size="small" type="link">Nuevo Modelo</Button></span>}
            rules={[{ required: true, message: 'Seleccione un modelo' }]}
          >
            <Select placeholder="Seleccione un modelo" options={modelos.map(m => ({ value: m.nombre, label: m.nombre }))} />
          </Form.Item>
          <Form.Item
            label="Año"
            name="anio"
            rules={[{ required: true, message: 'Seleccione el año' }]}
          >
            <Select placeholder="Seleccione un año" options={anios.map(a => ({ value: a.value, label: a.value.toString() }))} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Repuestos;
