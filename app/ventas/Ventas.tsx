import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import "./Ventas.css";


interface Cliente {
  id: number;
  nombre: string;
}

interface Venta {
  id: number;
  cliente: string;
  vehiculo: string;
  descripcion: string;
  fecha: string;
  monto: number;
}

const clientes: Cliente[] = [
  { id: 1, nombre: 'Juan Pérez' },
  { id: 2, nombre: 'María Gómez' },
  { id: 3, nombre: 'Carlos López' },
];

const initialVentas: Venta[] = [
  {
    id: 1,
    cliente: 'Juan Pérez',
    vehiculo: 'Ford Fiesta',
    descripcion: 'Cambio de aceite y filtro',
    fecha: '2025-08-20',
    monto: 5000,
  },
  {
    id: 2,
    cliente: 'María Gómez',
    vehiculo: 'Renault Clio',
    descripcion: 'Reparación de frenos',
    fecha: '2025-08-22',
    monto: 12000,
  },
  {
    id: 3,
    cliente: 'Carlos López',
    vehiculo: 'Peugeot 208',
    descripcion: 'Cambio de correa de distribución',
    fecha: '2025-08-25',
    monto: 18000,
  },
];

const Ventas = () => {
  const [ventas, setVentas] = useState<Venta[]>(initialVentas);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar' | 'editar' | ''>('');
  const [form] = Form.useForm();

  const columns: ColumnsType<Venta> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Cliente', dataIndex: 'cliente', key: 'cliente' },
    { title: 'Vehículo', dataIndex: 'vehiculo', key: 'vehiculo' },
    { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    { title: 'Monto', dataIndex: 'monto', key: 'monto', render: (monto: number) => `$${monto}` },
  ];

  const handleAgregar = () => {
    setFormType('agregar');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setFormType('');
    form.resetFields();
  };

  const handleEditar = () => {
    if (selectedRowKeys.length !== 1) return;
    setFormType('editar');
    const venta = ventas.find(v => v.id === selectedRowKeys[0]);
    if (venta) {
      // Buscar el cliente por nombre y setear el id
      const clienteObj = clientes.find(c => c.nombre === venta.cliente);
      form.setFieldsValue({
        clienteId: clienteObj ? clienteObj.id : undefined,
        vehiculo: venta.vehiculo,
        descripcion: venta.descripcion,
        fecha: venta.fecha,
        monto: venta.monto,
      });
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar venta(s)?',
      content: '¿Estás seguro que deseas eliminar la/s venta/s seleccionada/s?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setVentas(ventas.filter(v => !selectedRowKeys.includes(v.id)));
        setSelectedRowKeys([]);
        message.success('Venta(s) eliminada(s)');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const clienteObj = clientes.find(c => c.id === values.clienteId);
      if (!clienteObj) {
        message.error('Debe seleccionar un cliente válido');
        return;
      }
      const ventaData: Venta = {
        id: formType === 'agregar'
          ? (ventas.length ? Math.max(...ventas.map(v => v.id)) + 1 : 1)
          : selectedRowKeys[0] as number,
        cliente: clienteObj.nombre,
        vehiculo: values.vehiculo,
        descripcion: values.descripcion,
        fecha: values.fecha,
        monto: values.monto,
      };
      if (formType === 'agregar') {
        setVentas([...ventas, ventaData]);
        message.success('Venta agregada');
      } else if (formType === 'editar') {
        setVentas(ventas.map(v => v.id === selectedRowKeys[0] ? ventaData : v));
        message.success('Venta editada');
      }
      setIsModalOpen(false);
      setFormType('');
      form.resetFields();
      setSelectedRowKeys([]);
    } catch (err) {
      // validation error
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    type: 'radio' as const,
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Ventas (Reparaciones Realizadas)</h1>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar Venta</Button>
        <Button disabled={selectedRowKeys.length !== 1} onClick={handleEditar}>Editar</Button>
        <Button danger disabled={selectedRowKeys.length === 0} onClick={handleEliminar}>Eliminar</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={ventas}
        rowSelection={rowSelection}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        title={formType === 'agregar' ? 'Agregar Venta' : 'Editar Venta'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="clienteId"
            label={<span>Cliente <Button size="small" type="link">Nuevo Cliente</Button></span>}
            rules={[{ required: true, message: 'Seleccione un cliente' }]}
          >
            <Select options={clientes.map(c => ({ value: c.id, label: c.nombre }))} />
          </Form.Item>
          <Form.Item name="vehiculo" label="Vehículo" rules={[{ required: true, message: 'Ingrese el vehículo' }]}> <Input /> </Form.Item>
          <Form.Item name="descripcion" label="Descripción" rules={[{ required: true, message: 'Ingrese la descripción' }]}> <Input.TextArea /> </Form.Item>
          <Form.Item name="fecha" label="Fecha" rules={[{ required: true, message: 'Ingrese la fecha' }]}> <Input type="date" /> </Form.Item>
          <Form.Item name="monto" label="Monto" rules={[{ required: true, message: 'Ingrese el monto' }]}> <InputNumber min={0} style={{ width: '100%' }} /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Ventas;
