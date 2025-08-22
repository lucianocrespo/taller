
import React, { useState } from "react";
import "./Turnos.css";
import { Modal, Button, Form, Select, DatePicker, TimePicker, Space, message } from "antd";
import dayjs from "dayjs";

// Datos simulados de clientes y autos (deberían venir de un contexto o props en una app real)
const clientes = [
  { id: 1, nombre: "Juan Pérez" },
  { id: 2, nombre: "Ana Gómez" },
];
const autos = [
  { id: 1, marca: "Toyota", modelo: "Corolla", patente: "ABC123" },
  { id: 2, marca: "Ford", modelo: "Fiesta", patente: "XYZ789" },
];

const initialTurnos = [
  { id: 1, cliente: "Juan Pérez", auto: "Ford Fiesta", fecha: "2025-08-21", hora: "10:00", estado: "Pendiente" },
  { id: 2, cliente: "Ana Gómez", auto: "Chevrolet Onix", fecha: "2025-08-21", hora: "11:00", estado: "Confirmado" },
  { id: 3, cliente: "Carlos Ruiz", auto: "Toyota Corolla", fecha: "2025-08-21", hora: "12:00", estado: "Pendiente" },
];

export default function Turnos() {
  const [turnos, setTurnos] = useState(initialTurnos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAgregarTurno = () => {
    form.resetFields();
    setIsModalOpen(true);
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
      const newTurno = {
        id: turnos.length ? Math.max(...turnos.map(t => t.id)) + 1 : 1,
        cliente: clienteObj.nombre,
        auto: `${autoObj.marca} ${autoObj.modelo}`,
        fecha: values.fecha.format("YYYY-MM-DD"),
        hora: values.hora.format("HH:mm"),
        estado: "Pendiente",
      };
      setTurnos([...turnos, newTurno]);
      setIsModalOpen(false);
      form.resetFields();
      message.success("Turno agregado");
    } catch (err) {
      // validation error
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div className="turnos-container">
      <h1>Turnos</h1>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregarTurno}>Agregar Turno</Button>
      </Space>
      <table className="turnos-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Auto</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((turno) => (
            <tr key={turno.id}>
              <td>{turno.cliente}</td>
              <td>{turno.auto}</td>
              <td>{turno.fecha}</td>
              <td>{turno.hora}</td>
              <td>{turno.estado}</td>
              <td>
                <button className="btn-confirmar">Confirmar</button>
                <button className="btn-cancelar">Cancelar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        open={isModalOpen}
        title="Agregar Turno"
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Cliente"
            name="clienteId"
            rules={[{ required: true, message: "Seleccione un cliente" }]}
          >
            <Select placeholder="Seleccione un cliente">
              {clientes.map(c => (
                <Select.Option key={c.id} value={c.id}>{c.nombre}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Auto"
            name="autoId"
            rules={[{ required: true, message: "Seleccione un auto" }]}
          >
            <Select placeholder="Seleccione un auto">
              {autos.map(a => (
                <Select.Option key={a.id} value={a.id}>{`${a.marca} ${a.modelo} (${a.patente})`}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Fecha"
            name="fecha"
            rules={[{ required: true, message: "Seleccione la fecha" }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Hora"
            name="hora"
            rules={[{ required: true, message: "Seleccione la hora" }]}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
