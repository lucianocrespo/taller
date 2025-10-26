
import React, { useState } from "react";
import { Table, Button, Modal, Form, Select, DatePicker, TimePicker, Space, message } from "antd";
import dayjs from "dayjs";
import "./Reparacion.module.css";

interface Reparacion {
  id: number;
  cliente: string;
  auto: string;
  fecha: string;
  hora: string;
  estado: string;
}

const clientes = [
  { id: 1, nombre: "Juanes Pérez" },
  { id: 2, nombre: "Ana Gómez" },
];
const autos = [
  { id: 1, marca: "Toyota", modelo: "Corolla", patente: "ABC123" },
  { id: 2, marca: "Ford", modelo: "Fiesta", patente: "XYZ789" },
];

const initialReparaciones: Reparacion[] = [
  { id: 1, cliente: "Juanes Pérez", auto: "Ford Fiesta", fecha: "2025-08-21", hora: "10:00", estado: "Pendiente" },
  { id: 2, cliente: "Ana Gómez", auto: "Chevrolet Onix", fecha: "2025-08-21", hora: "11:00", estado: "Confirmado" },
  { id: 3, cliente: "Carlos Ruiz", auto: "Toyota Corolla", fecha: "2025-08-21", hora: "12:00", estado: "Pendiente" },
];

const Reparaciones = () => {
  const [turnos, setTurnos] = useState<Reparacion[]>(initialReparaciones);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar' | 'editar' | ''>('');
  const [form] = Form.useForm();

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Cliente', dataIndex: 'cliente', key: 'cliente' },
    { title: 'Auto', dataIndex: 'auto', key: 'auto' },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    { title: 'Hora', dataIndex: 'hora', key: 'hora' },
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
    const turno = turnos.find(t => t.id === selectedRowKeys[0]);
    if (turno) {
      const clienteObj = clientes.find(c => c.nombre === turno.cliente);
      const autoObj = autos.find(a => `${a.marca} ${a.modelo}` === turno.auto);
      form.setFieldsValue({
        clienteId: clienteObj ? clienteObj.id : undefined,
        autoId: autoObj ? autoObj.id : undefined,
        fecha: dayjs(turno.fecha),
        hora: dayjs(turno.hora, 'HH:mm'),
        estado: turno.estado,
      });
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar turno(s)?',
      content: '¿Estás seguro que deseas eliminar el/los turno(s) seleccionado(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setTurnos(turnos.filter(t => !selectedRowKeys.includes(t.id)));
        setSelectedRowKeys([]);
        message.success('Turno(s) eliminado(s)');
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
      const newTurno: Reparacion = {
        id: formType === 'agregar'
          ? (turnos.length ? Math.max(...turnos.map(t => t.id)) + 1 : 1)
          : selectedRowKeys[0] as number,
        cliente: clienteObj.nombre,
        auto: `${autoObj.marca} ${autoObj.modelo}`,
        fecha: values.fecha.format("YYYY-MM-DD"),
        hora: values.hora.format("HH:mm"),
        estado: values.estado,
      };
      if (formType === 'agregar') {
        setTurnos([...turnos, newTurno]);
        message.success("Reparacion agregada");
      } else if (formType === 'editar') {
        setTurnos(turnos.map(t => t.id === selectedRowKeys[0] ? newTurno : t));
        message.success("Reparacion editada");
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
        dataSource={turnos}
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
          <Form.Item
            name="clienteId"
            label={<span>Cliente <Button size="small" type="link">Nuevo Cliente</Button></span>}
            rules={[{ required: true, message: 'Seleccione un cliente' }]}
          >
            <Select options={clientes.map(c => ({ value: c.id, label: c.nombre }))} />
          </Form.Item>
          <Form.Item name="autoId" label="Auto" rules={[{ required: true, message: 'Seleccione un auto' }]}> <Select options={autos.map(a => ({ value: a.id, label: `${a.marca} ${a.modelo} (${a.patente})` }))} /> </Form.Item>
          <Form.Item name="fecha" label="Fecha" rules={[{ required: true, message: 'Seleccione la fecha' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="hora" label="Hora" rules={[{ required: true, message: 'Seleccione la hora' }]}> <TimePicker format="HH:mm" style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="estado" label="Estado" rules={[{ required: true, message: 'Seleccione el estado' }]}> <Select options={[{ value: 'Pendiente', label: 'Pendiente' }, { value: 'Confirmado', label: 'Confirmado' }, { value: 'Finalizado', label: 'Finalizado' }]} /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Reparaciones;
