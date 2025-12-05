
import React, { useState } from "react";
import { Table, Button, Modal, Form, Select, DatePicker, TimePicker, Input, InputNumber, Space, message } from "antd";
import dayjs from "dayjs";
import "./compCompra.css";

interface Comprobantecompra {
  id: number;
  idProveedor: number;
  fecha: string;
  total: number;
  subtotal: number;
  observaciones: string;
}

const initialCompcompra: Comprobantecompra[] = [
  { id: 1, idProveedor: 3, fecha: "2025-08-21", total: 15000, subtotal: 13000, observaciones: " - " },
  { id: 2, idProveedor: 3, fecha: "2025-08-21", total: 21000, subtotal: 24000, observaciones: " - " },
  { id: 3, idProveedor: 3, fecha: "2025-08-21", total: 19000, subtotal: 23000, observaciones: " - " },
];

const proveedores = [
  { id: 1, nombre: 'Proveedor A' },
  { id: 2, nombre: 'Proveedor B' },
  { id: 3, nombre: 'Proveedor C' },
];

const Comprobantecompra = () => {
  const [comprobantes, setComprobantes] = useState<Comprobantecompra[]>(initialCompcompra);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar' | 'editar' | ''>('');
  const [form] = Form.useForm();

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'IDProveedor', dataIndex: 'idProveedor', key: 'idProveedor', width: 80 },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    { title: 'Total', dataIndex: 'total', key: 'total', render: (value: number) => `$${value}` },
    { title: 'Subtotal', dataIndex: 'subtotal', key: 'subtotal', render: (value: number) => `$${value}` },
    { title: 'Observaciones', dataIndex: 'observaciones', key: 'observaciones' },
  ];

  const handleAgregar = () => {
    setFormType('agregar');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditar = () => {
    if (selectedRowKeys.length !== 1) return;
    setFormType('editar');
    const comprobante = comprobantes.find(t => t.id === selectedRowKeys[0]);
    if (comprobante) {
      form.setFieldsValue({
        idProveedor: comprobante.idProveedor,
        fecha: dayjs(comprobante.fecha),
        total: comprobante.total,
        subtotal: comprobante.subtotal,
        observaciones: comprobante.observaciones,
      });
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar comprobante(s)?',
      content: '¿Estás seguro que deseas eliminar el/los comprobante(s) seleccionado(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setComprobantes(comprobantes.filter(t => !selectedRowKeys.includes(t.id)));
        setSelectedRowKeys([]);
        message.success('Comprobante(s) eliminado(s)');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const newComprobante: Comprobantecompra = {
        id: formType === 'agregar'
          ? (comprobantes.length ? Math.max(...comprobantes.map(t => t.id)) + 1 : 1)
          : selectedRowKeys[0] as number,
        idProveedor: values.idProveedor,
        fecha: values.fecha.format("YYYY-MM-DD"),
        total: values.total || 0,
        subtotal: values.subtotal || 0,
        observaciones: values.observaciones || " - ",

      };
      if (formType === 'agregar') {
        setComprobantes([...comprobantes, newComprobante]);
        message.success("Comprobante agregado");
      } else if (formType === 'editar') {
        setComprobantes(comprobantes.map(t => t.id === selectedRowKeys[0] ? newComprobante : t));
        message.success("Comprobante editado");
      }
      setIsModalOpen(false);
      setFormType('');
      form.resetFields();
      setSelectedRowKeys([]);
    } catch (err) {
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    type: 'radio' as const,
  };

  return (
    <div className="reparacion-container" style={{ padding: 24 }}>
      <h1>Comprobantes de compra</h1>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar Comprobante</Button>
        <Button disabled={selectedRowKeys.length !== 1} onClick={handleEditar}>Editar</Button>
        <Button danger disabled={selectedRowKeys.length === 0} onClick={handleEliminar}>Eliminar</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={comprobantes}
        rowSelection={rowSelection}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        title={formType === 'agregar' ? 'Agregar Comprobante' : 'Editar Comprobante'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="idProveedor" label={<span> Proveedor <Button size="small" type="link">Nuevo Proveedor</Button></span>} rules={[{ required: true, message: 'Seleccione el proveedor' }]}> 
            <Select placeholder="Seleccione proveedor" options={proveedores.map(p => ({ value: p.id, label: p.nombre }))} />
          </Form.Item>
          <Form.Item name="fecha" label="Fecha" rules={[{ required: true, message: 'Seleccione la fecha' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="total" label="Total" rules={[{ required: true, message: 'Ingrese el total' }]}> <InputNumber min={0} style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="subtotal" label="Subtotal" rules={[{ required: true, message: 'Ingrese el subtotal' }]}> <InputNumber min={0} style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="observaciones" label="Observaciones"> <Input style={{ width: '100%' }} /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Comprobantecompra;
