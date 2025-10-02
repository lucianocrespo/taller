
import React, { useState } from "react";
import { Table, Button, Modal, Form, Select, DatePicker, TimePicker, Space, message } from "antd";
import dayjs from "dayjs";

interface ComprobanteVenta {
  idCV: number;
  idReparacion: number;
  idCliente: number;
  cliente: string;
  auto: string;
  fecha: string;
  hora: string;
  total: number;
  subtotal: number;
  observaciones: string;
}

const clientes = [
  { id: 1, nombre: "Juanes Pérez" },
  { id: 2, nombre: "Ana Gómez" },
];
const autos = [
  { id: 1, marca: "Toyota", modelo: "Corolla", patente: "ABC123" },
  { id: 2, marca: "Ford", modelo: "Fiesta", patente: "XYZ789" },
];

const initialCompVenta: ComprobanteVenta[] = [
  { idCV: 10, idReparacion: 20, idCliente: 1, cliente: "Juanes Pérez", auto: "Ford Fiesta", fecha: "2025-08-21", hora: "10:00", total: 15000, subtotal: 13000, observaciones: "-" },
  { idCV: 11, idReparacion: 21, idCliente: 2, cliente: "Ana Gómez", auto: "Chevrolet Onix", fecha: "2025-08-21", hora: "11:00", total: 21000, subtotal: 24000, observaciones: "-" },
  { idCV: 12, idReparacion: 22, idCliente: 3, cliente: "Carlos Ruiz", auto: "Toyota Corolla", fecha: "2025-08-21", hora: "12:00", total: 19000, subtotal: 23000, observaciones: "-" },
];

const ComprobanteVenta = () => {
  const [reparaciones, setReparaciones] = useState<ComprobanteVenta[]>(initialCompVenta);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar' | 'editar' | ''>('');
  const [form] = Form.useForm();

  const columns = [
    { title: 'ID', dataIndex: 'idCV', key: 'idCV', width: 80 },
    { title: 'ID Reparacion', dataIndex: 'idReparacion', key: 'idReparacion'},
    { title: 'ID Cliente', dataIndex: 'idCliente', key: 'idCliente'},
    { title: 'Cliente', dataIndex: 'cliente', key: 'cliente' },
    { title: 'Auto', dataIndex: 'auto', key: 'auto' },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    { title: 'Hora', dataIndex: 'hora', key: 'hora' },
    { title: 'Total', dataIndex: 'total', key: 'total' },
    { title: 'Subtotal', dataIndex: 'subtotal', key: 'subtotal'},
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
    const reparacion = reparaciones.find(t => t.id === selectedRowKeys[0]);
    if (reparacion) {
      // Para editar, se debe mapear cliente y auto a sus IDs si existen
      const clienteObj = clientes.find(c => c.nombre === reparacion.cliente);
      const autoObj = autos.find(a => `${a.marca} ${a.modelo}` === reparacion.auto);
      form.setFieldsValue({
        clienteId: clienteObj ? clienteObj.id : undefined,
        autoId: autoObj ? autoObj.id : undefined,
        fecha: dayjs(reparacion.fecha),
        hora: dayjs(reparacion.hora, 'HH:mm'),
      });
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar reparaciones(s)?',
      content: '¿Estás seguro que deseas eliminar el/los reparaciones(s) seleccionado(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setReparaciones(reparaciones.filter(t => !selectedRowKeys.includes(t.id)));
        setSelectedRowKeys([]);
        message.success('reparaciones(s) eliminado(s)');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const clienteObj = clientes.find(c => c.id === values.clienteId);
      const autoObj = autos.find(a => a.id === values.autoId);
      if (!clienteObj || !autoObj) {
        message.error("Debe seleccionar cliente y auto válidos");
        return;
      }
      const newReparacion: ComprobanteVenta = {
        id: formType === 'agregar'
          ? (reparaciones.length ? Math.max(...reparaciones.map(t => t.id)) + 1 : 1)
          : selectedRowKeys[0] as number,
        idCV: 10,
        idReparacion: 20,
        idCliente: clienteObj.id,
        cliente: clienteObj.nombre,
        auto: `${autoObj.marca} ${autoObj.modelo}`,
        fecha: values.fecha.format("YYYY-MM-DD"),
        hora: values.hora.format("HH:mm"),
      };
      if (formType === 'agregar') {
        setReparaciones([...reparaciones, newReparacion]);
        message.success("Reparacion agregada");
      } else if (formType === 'editar') {
        setReparaciones(reparaciones.map(t => t.id === selectedRowKeys[0] ? newreparaciones : t));
        message.success("Reparacion editada");
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
      <h1>Reparacion</h1>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar Reparacion</Button>
        <Button disabled={selectedRowKeys.length !== 1} onClick={handleEditar}>Editar</Button>
        <Button danger disabled={selectedRowKeys.length === 0} onClick={handleEliminar}>Eliminar</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={reparaciones}
        rowSelection={rowSelection}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        title={formType === 'agregar' ? 'Agregar Reparacion' : 'Editar Reparacion'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="clienteId" label="Cliente" rules={[{ required: true, message: 'Seleccione un cliente' }]}> <Select options={clientes.map(c => ({ value: c.id, label: c.nombre }))} /> </Form.Item>
          <Form.Item name="autoId" label="Auto" rules={[{ required: true, message: 'Seleccione un auto' }]}> <Select options={autos.map(a => ({ value: a.id, label: `${a.marca} ${a.modelo} (${a.patente})` }))} /> </Form.Item>
          <Form.Item name="fecha" label="Fecha" rules={[{ required: true, message: 'Seleccione la fecha' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="hora" label="Hora" rules={[{ required: true, message: 'Seleccione la hora' }]}> <TimePicker format="HH:mm" style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="estado" label="Estado" rules={[{ required: true, message: 'Seleccione el estado' }]}> <Select options={[{ value: 'Pendiente', label: 'Pendiente' }, { value: 'Confirmado', label: 'Confirmado' }, { value: 'Finalizado', label: 'Finalizado' }]} /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ComprobanteVenta;
