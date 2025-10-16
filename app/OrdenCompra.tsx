import React, { useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, Select, DatePicker, Space, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './Presupuesto.css';

interface OrdenCompraItem {
  id: number;
  idProveedor: number;
  fecha: string;
  detRepuestos: RepuestoDetalle[];
}

interface RepuestoDetalle {
  idDetRepuestosP: number;
  idRepuesto: number;
  repuesto: string;
  cant: number;
  importe: number;
}

const repuestosCatalog = [
  { id: 1, nombre: 'Pastillas de freno' },
  { id: 2, nombre: 'Pastillas' },
  { id: 3, nombre: 'Amortiguadores' },
];

const proveedores = [
  { id: 1, nombre: 'Carlos Perez' },
  { id: 2, nombre: 'Susana Marquez' },
];

const initialOrdenCompra: OrdenCompraItem[] = [
  {
    id: 1,
    idProveedor: 1,
    fecha: '2025-09-01',
    detRepuestos: [ { idDetRepuestosP: 1, idRepuesto: 2, repuesto: 'Pastillas de freno', cant: 4, importe: 20000 },
        { idDetRepuestosP: 1, idRepuesto: 3, repuesto: 'Amortiguadores', cant: 2, importe: 30000 }],
  }
];

const OrdenCompra = () => {
  const [ordenCompra, setOrdenCompra] = useState<OrdenCompraItem[]>(initialOrdenCompra);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar'|'editar'|' '>(' ');
  const [form] = Form.useForm();
  const [repuestos, setRepuestos] = useState<RepuestoDetalle[]>([]);

  const columns: ColumnsType<OrdenCompraItem> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'ID Proveedor', dataIndex: 'idProveedor', key: 'idProveedor' },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    { title: 'Repuestos', key: 'repuestos', render: (_, record) => record.detRepuestos.length },
  ];

  const handleAgregar = () => {
    setFormType('agregar');
    form.resetFields();
    setRepuestos([]);
    setIsModalOpen(true);
  };

  const handleEditar = () => {
    if (selectedRowKeys.length !== 1) return;
    setFormType('editar');
    const oC = OrdenCompra.find(oC => oC.id === selectedRowKeys[0]);
    if (oC) {
      form.setFieldsValue({
        idProveedor: oC.idProveedor,
        fecha: dayjs(oC.fecha),
        detRepuestos: oC.detRepuestos,
      });
      setRepuestos(oC.repuestos || []);
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar orden de compra(s)?',
      content: '¿Estás seguro que deseas eliminar la/las orden(es) de compra seleccionada(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setOrdenCompra(ordenCompra.filter(p => !selectedRowKeys.includes(p.id)));
        setSelectedRowKeys([]);
        message.success('Presupuesto(s) eliminado(s)');
      }
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const newPresupuesto: OrdenCompraItem = {
        id: formType === 'agregar' ? (ordenCompra.length ? Math.max(...ordenCompra.map(p => p.id)) + 1 : 1) : (selectedRowKeys[0] as number),
        idProveedor: values.idProveedor,
        fecha: values.fecha.format('YYYY-MM-DD'),
        detRepuestos: repuestos,
      };
      if (formType === 'agregar') {
        setOrdenCompra([...ordenCompra, newPresupuesto]);
        message.success('Presupuesto agregado');
      } else {
        setOrdenCompra(ordenCompra.map(p => p.id === newPresupuesto.id ? newPresupuesto : p));
        message.success('Presupuesto editado');
      }
      setIsModalOpen(false);
      form.resetFields();
      setRepuestos([]);
      setSelectedRowKeys([]);
    } catch (err) {
      // validation error
    }
  };

  // helpers to add detalle items inside modal

  const addRepuesto = (values: any) => {
    const nextId = repuestos.length ? Math.max(...repuestos.map(r => r.idDetRepuestosP)) + 1 : 1;
    const repObj = repuestosCatalog.find(r => r.id === values.idRepuesto);
    setRepuestos([...repuestos, { idDetRepuestosP: nextId, idRepuesto: values.idRepuesto, repuesto: repObj ? repObj.nombre : '', cant: values.cant || 1, importe: values.importe || 0 }]);
  };

  const removeRepuesto = (id: number) => setRepuestos(repuestos.filter(r => r.idDetRepuestosP !== id));

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
    <div className="OrdenCompra-container" style={{ padding: 24 }}>
      <h1>Orden de compra</h1>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar orden de compra</Button>
        <Button disabled={selectedRowKeys.length !== 1} onClick={handleEditar}>Editar</Button>
        <Button danger disabled={selectedRowKeys.length === 0} onClick={handleEliminar}>Eliminar</Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={ordenCompra} rowSelection={rowSelection} pagination={{ pageSize: 8 }} />

      <Modal
        title={formType === 'agregar' ? 'Agregar orden de compra' : 'Editar orden de compra'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); setRepuestos([]); }}
        okText="Guardar"
        cancelText="Cancelar"
        width={900}
      >
        <Form form={form} layout="vertical">
            <Form.Item name="idProveedor" label="Proveedor" rules={[{ required: true, message: 'Seleccione el proveedor' }]}>
          <Form.Item name="fecha" label="Fecha" rules={[{ required: true, message: 'Ingrese la fecha' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
            <Select options={proveedores.map(c => ({ value: c.id, label: c.nombre }))} />
          </Form.Item>

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

export default OrdenCompra;
