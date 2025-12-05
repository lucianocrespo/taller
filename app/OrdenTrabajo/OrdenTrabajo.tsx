import React, { useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, Select, DatePicker, Space, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './OrdenTrabajo.module.css';

interface OrdenTrabajoItem {
  id: number;
  idTurno: number;
  idMecanico: number;
  estado: string;
  fecha: string;
  servicios: ServicioDetalle[];
  repuestos: RepuestoDetalle[];
}

interface ServicioDetalle {
  idDetServicioP: number;
  idServicio: number;
  servicio: string;
  cant: number;
  importe: number;
}

interface RepuestoDetalle {
  idDetRepuestosP: number;
  idRepuesto: number;
  repuesto: string;
  cant: number;
  importe: number;
}

const serviciosCatalog = [
  { id: 1, nombre: 'Cambio de aceite' },
  { id: 2, nombre: 'Alineacion' },
  { id: 3, nombre: 'Frenos' },
];

const repuestosCatalog = [
  { id: 1, nombre: 'Filtro de aire' },
  { id: 2, nombre: 'Pastillas' },
  { id: 3, nombre: 'Bujia' },
];

const clientes = [
  { id: 1, nombre: 'Juan Perez' },
  { id: 2, nombre: 'Ana Gomez' },
];

const mecanicos = [                                      
  { id: 1, nombre: 'Carlos Ruiz' },
  { id: 2, nombre: 'Laura Martinez' },
];

const turnos = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
];
const estados = [
  { id: 1, nombre: 'Pendiente' },
  { id: 2, nombre: 'En progreso' },
  { id: 3, nombre: 'Completado' },
];

const initialOrdenesTrabajo: OrdenTrabajoItem[] = [
  {
    id: 1,
    idTurno: 1,
    idMecanico: 1,
    estado: 'En progreso',
    fecha: '2025-08-25',
    servicios: [ { idDetServicioP: 1, idServicio: 1, servicio: 'Cambio de aceite', cant: 1, importe: 3000 } ],
    repuestos: [ { idDetRepuestosP: 1, idRepuesto: 2, repuesto: 'Pastillas', cant: 1, importe: 4500 } ],
  }
];

const OrdenTrabajo = () => {
  const [ordenestrabajo, setOrdenesTrabajo] = useState<OrdenTrabajoItem[]>(initialOrdenesTrabajo);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar'|'editar'|' '>(' ');
  const [form] = Form.useForm();
  const [servicios, setServicios] = useState<ServicioDetalle[]>([]);
  const [repuestos, setRepuestos] = useState<RepuestoDetalle[]>([]);

  const columns: ColumnsType<OrdenTrabajoItem> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'ID Turno', dataIndex: 'idTurno', key: 'idTurno', width: 80 },
    { title: 'ID Mecanico', dataIndex: 'idMecanico', key: 'idMecanico', width: 80 },
    { title: 'Estado', dataIndex: 'estado', key: 'estado' },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    { title: 'Servicios', key: 'servicios', render: (_, record) => record.servicios.length },
    { title: 'Repuestos', key: 'repuestos', render: (_, record) => record.repuestos.length },
  ];

  const handleAgregar = () => {
    setFormType('agregar');
    form.resetFields();
    setServicios([]);
    setRepuestos([]);
    setIsModalOpen(true);
  };

  const handleEditar = () => {
    if (selectedRowKeys.length !== 1) return;
    setFormType('editar');
    const ot = ordenestrabajo.find(ot => ot.id === selectedRowKeys[0]);
    if (ot) {
      form.setFieldsValue({
        idTurno: ot.idTurno,
        idMecanico: ot.idMecanico,
        estado: ot.estado,
        fecha: dayjs(ot.fecha),
      });
      setServicios(ot.servicios || []);
      setRepuestos(ot.repuestos || []);
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar orden de trabajo(s)?',
      content: '¿Estás seguro que deseas eliminar la/las orden(es) de trabajo seleccionada(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setOrdenesTrabajo(ordenestrabajo.filter(ot => !selectedRowKeys.includes(ot.id)));
        setSelectedRowKeys([]);
        message.success('Orden(es) de trabajo eliminada(s)');
      }
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const newOrdenTrabajo: OrdenTrabajoItem = {
        id: formType === 'agregar' ? (ordenestrabajo.length ? Math.max(...ordenestrabajo.map(ot => ot.id)) + 1 : 1) : (selectedRowKeys[0] as number),
        idTurno: values.idTurno,
        idMecanico: values.idMecanico,
        estado: values.estado,
        fecha: values.fecha.format('YYYY-MM-DD'),
        servicios: servicios,
        repuestos: repuestos,
      };
      if (formType === 'agregar') {
        setOrdenesTrabajo([...ordenestrabajo, newOrdenTrabajo]);
        message.success('Orden de trabajo agregada');
      } else {
        setOrdenesTrabajo(ordenestrabajo.map(ot => ot.id === newOrdenTrabajo.id ? newOrdenTrabajo : ot));
        message.success('Orden de trabajo editada');
      }
      setIsModalOpen(false);
      form.resetFields();
      setServicios([]);
      setRepuestos([]);
      setSelectedRowKeys([]);
    } catch (err) {
      // validation error
    }
  };

  // helpers to add detalle items inside modal
  const addServicio = (values: any) => {
    const nextId = servicios.length ? Math.max(...servicios.map(s => s.idDetServicioP)) + 1 : 1;
    const servicioObj = serviciosCatalog.find(s => s.id === values.idServicio);
    setServicios([...servicios, { idDetServicioP: nextId, idServicio: values.idServicio, servicio: servicioObj ? servicioObj.nombre : '', cant: values.cant || 1, importe: values.importe || 0 }]);
  };

  const removeServicio = (id: number) => setServicios(servicios.filter(s => s.idDetServicioP !== id));

  const addRepuesto = (values: any) => {
    const nextId = repuestos.length ? Math.max(...repuestos.map(r => r.idDetRepuestosP)) + 1 : 1;
    const repObj = repuestosCatalog.find(r => r.id === values.idRepuesto);
    setRepuestos([...repuestos, { idDetRepuestosP: nextId, idRepuesto: values.idRepuesto, repuesto: repObj ? repObj.nombre : '', cant: values.cant || 1, importe: values.importe || 0 }]);
  };

  const removeRepuesto = (id: number) => setRepuestos(repuestos.filter(r => r.idDetRepuestosP !== id));

  const servicioColumns = [
    { title: 'ID', dataIndex: 'idDetServicioP', key: 'idDetServicioP', width: 80 },
    { title: 'Servicio', dataIndex: 'servicio', key: 'servicio' },
    { title: 'Cantidad', dataIndex: 'cant', key: 'cant' },
    { title: 'Importe', dataIndex: 'importe', key: 'importe' },
    { title: 'Acciones', key: 'acciones', render: (_: any, record: ServicioDetalle) => <Button danger size="small" onClick={() => removeServicio(record.idDetServicioP)}>Eliminar</Button> }
  ];

  const repuestoColumns = [
    { title: 'ID', dataIndex: 'idDetRepuestosP', key: 'idDetRepuestosP', width: 80 },
    { title: 'Repuesto', dataIndex: 'repuesto', key: 'repuesto' },
    { title: 'Cantidad', dataIndex: 'cant', key: 'cant' },
    { title: 'Importe', dataIndex: 'importe', key: 'importe' },
    { title: 'Acciones', key: 'acciones', render: (_: any, record: RepuestoDetalle) => <Button danger size="small" onClick={() => removeRepuesto(record.idDetRepuestosP)}>Eliminar</Button> }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    type: 'radio' as const,
  };

  return (
    <div className="ordentrabajo-container" style={{ padding: 24 }}>
      <h1>Ordenes de trabajo</h1>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar Orden de trabajo</Button>
        <Button disabled={selectedRowKeys.length !== 1} onClick={handleEditar}>Editar</Button>
        <Button danger disabled={selectedRowKeys.length === 0} onClick={handleEliminar}>Eliminar</Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={ordenestrabajo} rowSelection={rowSelection} pagination={{ pageSize: 8 }} />

      <Modal
        title={formType === 'agregar' ? 'Agregar Orden de trabajo' : 'Editar Orden de trabajo'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); setServicios([]); setRepuestos([]); }}
        okText="Guardar"
        cancelText="Cancelar"
        width={900}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="idTurnos" label={<span> Turno <Button size="small" type="link">Nuevo Turno</Button></span>} rules={[{ required: true, message: 'Seleccione el turno' }]}>
            <Select options={turnos.map(t => ({ value: t.id }))} />
          </Form.Item>
          <Form.Item name="idMecanico" label="Mecanico" rules={[{ required: true, message: 'Seleccione el mecanico' }]}>
            <Select options={mecanicos.map(m => ({ value: m.id, label: m.nombre }))} />
          </Form.Item>
          <Form.Item name="estado" label="Estado" rules={[{ required: true, message: 'Seleccione el estado' }]}>
            <Select options={estados.map(e => ({ value: e.id, label: e.nombre }))} />
          </Form.Item>
          <Form.Item name="fecha" label="Fecha" rules={[{ required: true, message: 'Ingrese la fecha' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>

          <div className="detalle-section">
            <h3>Servicios</h3>
            <Form
              onFinish={addServicio}
              layout="inline"
              style={{ marginBottom: 8 }}
            >
              <Form.Item name="idServicio" rules={[{ required: true, message: 'Seleccione el servicio' }]}>
                <Select style={{ width: 200 }} options={serviciosCatalog.map(s => ({ value: s.id, label: s.nombre }))} placeholder="Servicio" />
              </Form.Item>
              <Form.Item name="cant" rules={[{ required: true, message: 'Ingrese cantidad' }]}>
                <InputNumber min={1} placeholder="Cant" />
              </Form.Item>
              <Form.Item name="importe" rules={[{ required: true, message: 'Ingrese importe' }]}>
                <InputNumber min={0} placeholder="Importe" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Agregar</Button>
              </Form.Item>
            </Form>
            <Table columns={servicioColumns} dataSource={servicios} rowKey="idDetServicioP" pagination={false} />
          </div>

          <div className="detalle-section" style={{ marginTop: 12 }}>
            <h3>Repuestos</h3>
            <Form
              onFinish={addRepuesto}
              layout="inline"
              style={{ marginBottom: 8 }}
            >
              <Form.Item name="idRepuesto" rules={[{ required: true, message: 'Seleccione el repuesto' }]}>
                <Select style={{ width: 200 }} options={repuestosCatalog.map(r => ({ value: r.id, label: r.nombre }))} placeholder="Repuesto" />
              </Form.Item>
              <Form.Item name="cant" rules={[{ required: true, message: 'Ingrese cantidad' }]}>
                <InputNumber min={1} placeholder="Cant" />
              </Form.Item>
              <Form.Item name="importe" rules={[{ required: true, message: 'Ingrese importe' }]}>
                <InputNumber min={0} placeholder="Importe" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Agregar</Button>
              </Form.Item>
            </Form>
            <Table columns={repuestoColumns} dataSource={repuestos} rowKey="idDetRepuestosP" pagination={false} />
          </div>

        </Form>
      </Modal>
    </div>
  );
};

export default OrdenTrabajo;
