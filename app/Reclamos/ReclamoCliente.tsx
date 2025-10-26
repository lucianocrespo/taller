import React, { useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, Select, DatePicker, Space, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './ReclamoCliente.css';

interface ReclamoClienteItem {
  id: number;
  idCliente: number;
  fecha: string;
  descripcion: string;
  estado: string;
}

const clientes = [
  { id: 1, nombre: 'Juan Perez' },
  { id: 2, nombre: 'Ana Gomez' },
];

const estados = [
  { id: 1, nombre: 'Pendiente' },
  { id: 2, nombre: 'En progreso' },
  { id: 3, nombre: 'Completado' },
];

const initialReclamosCliente: ReclamoClienteItem[] = [
  {
    id: 1,
    idCliente: 1,
    fecha: '2025-08-25',
    descripcion: '',
    estado: 'En progreso',
  }
];

const ReclamoCliente = () => {
  const [reclamoscliente, setReclamosCliente] = useState<ReclamoClienteItem[]>(initialReclamosCliente);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar'|'editar'|' '>(' ');
  const [form] = Form.useForm();

  const columns: ColumnsType<ReclamoClienteItem> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'ID Cliente', dataIndex: 'idCliente', key: 'idCliente', width: 80 },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    { title: 'Descripcion', dataIndex: 'descripcion', key: 'descripcion' },
    { title: 'Estado', dataIndex: 'estado', key: 'estado' },
  ];

  const handleAgregar = () => {
    setFormType('agregar');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditar = () => {
    if (selectedRowKeys.length !== 1) return;
    setFormType('editar');
    const rc = reclamoscliente.find(rc => rc.id === selectedRowKeys[0]);
    if (rc) {
      form.setFieldsValue({
        idCliente: rc.idCliente,
        fecha: dayjs(rc.fecha),
        descripcion: rc.descripcion,
        estado: rc.estado,
      });
      setIsModalOpen(true);           
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar reclamo de cliente(s)?',
      content: '¿Estás seguro que deseas eliminar el/los reclamo(s) de cliente(s) seleccionado(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setReclamosCliente(reclamoscliente.filter(rc => !selectedRowKeys.includes(rc.id)));
        setSelectedRowKeys([]);
        message.success('Reclamo(s) de cliente(s) eliminado(s)');
      }
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const newReclamoCliente: ReclamoClienteItem = {
        id: formType === 'agregar' ? (reclamoscliente.length ? Math.max(...reclamoscliente.map(rc => rc.id)) + 1 : 1) : (selectedRowKeys[0] as number),
        idCliente: values.idCliente,
        fecha: values.fecha.format('YYYY-MM-DD'),
        descripcion: values.descripcion,
        estado: values.estado,
      };
      if (formType === 'agregar') {
        setReclamosCliente([...reclamoscliente, newReclamoCliente]);
        message.success('Reclamo de cliente agregado');
      } else {
        setReclamosCliente(reclamoscliente.map(rc => rc.id === newReclamoCliente.id ? newReclamoCliente : rc));
        message.success('Reclamo de Cliente editado');
      }
      setIsModalOpen(false);
      form.resetFields();
      setSelectedRowKeys([]);
    } catch (err) {
      // validation error
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    //setFormType('');
    form.resetFields();
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    type: 'radio' as const,
  };

  return (
    <div className="ReclamoCliente-container" style={{ padding: 24 }}>
      <h1>Reclamos de Clientes</h1>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar reclamo de Cliente</Button>
        <Button disabled={selectedRowKeys.length !== 1} onClick={handleEditar}>Editar</Button>
        <Button danger disabled={selectedRowKeys.length === 0} onClick={handleEliminar}>Eliminar</Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={reclamoscliente} rowSelection={rowSelection} pagination={{ pageSize: 8 }} />

      <Modal
        title={formType === 'agregar' ? 'Agregar reclamo de Cliente' : 'Editar reclamo de Cliente'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Guardar"
        cancelText="Cancelar"
        width={900}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="idCliente" label="Clientes" rules={[{ required: true, message: 'Seleccione el cliente' }]}>
            <Select options={clientes.map(c => ({ value: c.id }))} />
          </Form.Item>
          <Form.Item name="fecha" label="Fecha" rules={[{ required: true, message: 'Ingrese la fecha' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="descripcion" label="Descripciones"> <Input style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="estado" label="estados" rules={[{ required: true, message: 'Seleccione el estado' }]}>
            <Select options={estados.map(e => ({ value: e.id, label: e.nombre }))} />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default ReclamoCliente;
