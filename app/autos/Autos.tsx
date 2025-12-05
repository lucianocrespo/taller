import React, { useState } from 'react';
import './Autos.css';
import { Table, Button, Modal, Form, Input, Space, message, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Cliente {
  id: number;
  nombre: string;
}

interface Modelo {
  id: number;
  nombre: string;
}

interface Patente {
  id: number;
  codigo: string;
}

interface Auto {
  id: number;
  idCliente: number;
  patente: string;
  modelo: string;
}

const clientes: Cliente[] = [
  { id: 1, nombre: 'Juan Pérez' },
  { id: 2, nombre: 'Ana Gómez' },
  { id: 3, nombre: 'Carlos López' },
  { id: 4, nombre: 'María García' },
  { id: 5, nombre: 'Pedro Rodríguez' },
];

const modelos: Modelo[] = [
  { id: 1, nombre: 'Corolla' },
  { id: 2, nombre: 'Cruze' },
  { id: 3, nombre: 'Kangoo' },
  { id: 4, nombre: 'Bora' },
  { id: 5, nombre: 'Fun' },
  { id: 6, nombre: 'Vento' },
  { id: 7, nombre: 'Duster' },
  { id: 8, nombre: 'Partner' },
];

const patentes: Patente[] = [
  { id: 1, codigo: 'ABC123' },
  { id: 2, codigo: 'XYZ789' },
  { id: 3, codigo: 'AFG728' },
  { id: 4, codigo: 'HWR349' },
  { id: 5, codigo: 'LKF196' },
  { id: 6, codigo: 'PED461' },
  { id: 7, codigo: 'KSJ564' },
  { id: 8, codigo: 'GSI278' },
];

const initialAutos: Auto[] = [
  { id: 1, idCliente: 1, patente: 'ABC123', modelo: 'Corolla' },
  { id: 2, idCliente: 2, patente: 'XYZ789', modelo: 'Cruze' },
  { id: 3, idCliente: 3, patente: 'AFG728', modelo: 'Kangoo' },
  { id: 4, idCliente: 4, patente: 'HWR349', modelo: 'Bora' },
  { id: 5, idCliente: 5, patente: 'LKF196', modelo: 'Fun' },
  { id: 6, idCliente: 6, patente: 'PED461', modelo: 'Vento' },
  { id: 7, idCliente: 7, patente: 'KSJ564', modelo: 'Duster' },
  { id: 8, idCliente: 8, patente: 'GSI278', modelo: 'Partner' },
];

const Autos = () => {
  const [autos, setAutos] = useState<Auto[]>(initialAutos);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar' | 'editar' | ''>('');
  const [form] = Form.useForm();

  const columns: ColumnsType<Auto> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'ID Cliente', dataIndex: 'idCliente', key: 'idCliente' },
    { title: 'Patente', dataIndex: 'patente', key: 'patente' },
    { title: 'Modelo', dataIndex: 'modelo', key: 'modelo' },
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
          initialValues={{ idCliente: undefined, patente: '', modelo: '' }}
        >
          <Form.Item
            label={<span>Cliente <Button size="small" type="link">Nuevo Cliente</Button></span>}
            name="idCliente"
            rules={[{ required: true, message: 'Seleccione un cliente' }]}
          >
            <Select placeholder="Seleccione un cliente" options={clientes.map(c => ({ value: c.id, label: c.nombre }))} />
          </Form.Item>
          <Form.Item
            label={<span>Patente <Button size="small" type="link">Nueva Patente</Button></span>}
            name="patente"
            rules={[{ required: true, message: 'Seleccione una patente' }]}
          >
            <Select placeholder="Seleccione una patente" options={patentes.map(p => ({ value: p.codigo, label: p.codigo }))} />
          </Form.Item>
          <Form.Item
            label={<span>Modelo <Button size="small" type="link">Nuevo Modelo</Button></span>}
            name="modelo"
            rules={[{ required: true, message: 'Seleccione un modelo' }]}
          >
            <Select placeholder="Seleccione un modelo" options={modelos.map(m => ({ value: m.nombre, label: m.nombre }))} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Autos;
