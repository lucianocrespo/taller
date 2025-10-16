import React, { useState } from 'react';
import { Table, Button, Modal, Form, Select, DatePicker, Space, InputNumber, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './OrdenCompra.css';

interface OrdenCompraItem {
  id: number;
  fecha: string;
  idProveedor: number;
  proveedor: string;
  items: OrdenItem[];
}

interface OrdenItem {
  idDet: number;
  idRepuesto: number;
  repuesto: string;
  cant: number;
  importe?: number;
}

const repuestosCatalog = [
  { id: 1, nombre: 'Filtro de aire' },
  { id: 2, nombre: 'Pastillas' },
  { id: 3, nombre: 'Bujía' },
  { id: 4, nombre: 'Amortiguador' },
];

const proveedores = [
  { id: 1, nombre: 'Proveedor A' },
  { id: 2, nombre: 'Proveedor B' },
  { id: 3, nombre: 'Proveedor C' },
];

const initialOrdenes: OrdenCompraItem[] = [];

const OrdenCompra = () => {
  const [ordenes, setOrdenes] = useState<OrdenCompraItem[]>(initialOrdenes);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar' | 'editar' | ''>('');
  const [form] = Form.useForm();
  const [items, setItems] = useState<OrdenItem[]>([]);

  const columns: ColumnsType<OrdenCompraItem> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    { title: 'Proveedor', dataIndex: 'proveedor', key: 'proveedor' },
    { title: 'Cantidad de items', key: 'items', render: (_, record) => record.items.length },
  ];

  const itemColumns = [
    { title: 'ID', dataIndex: 'idDet', key: 'idDet', width: 80 },
    { title: 'Repuesto', dataIndex: 'repuesto', key: 'repuesto' },
    { title: 'Cantidad', dataIndex: 'cant', key: 'cant' },
    { title: 'Importe', dataIndex: 'importe', key: 'importe' },
    { title: 'Acciones', key: 'acciones', render: (_: any, record: OrdenItem) => <Button danger size="small" onClick={() => removeItem(record.idDet)}>Eliminar</Button> }
  ];

  const handleAgregar = () => {
    setFormType('agregar');
    form.resetFields();
    setItems([]);
    setIsModalOpen(true);
  };

  const handleEditar = () => {
    if (selectedRowKeys.length !== 1) return;
    setFormType('editar');
    const o = ordenes.find(o => o.id === selectedRowKeys[0]);
    if (o) {
      form.setFieldsValue({ fecha: dayjs(o.fecha), idProveedor: o.idProveedor });
      setItems(o.items || []);
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar orden(es)?',
      content: '¿Estás seguro que deseas eliminar la(s) orden(es) seleccionada(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setOrdenes(ordenes.filter(o => !selectedRowKeys.includes(o.id)));
        setSelectedRowKeys([]);
        message.success('Orden(es) eliminada(s)');
      }
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (!items.length) {
        message.error('Debe agregar al menos un repuesto a la orden');
        return;
      }
      const proveedorObj = proveedores.find(p => p.id === values.idProveedor);
      if (!proveedorObj) {
        message.error('Proveedor inválido');
        return;
      }
      const newOrden: OrdenCompraItem = {
        id: formType === 'agregar' ? (ordenes.length ? Math.max(...ordenes.map(o => o.id)) + 1 : 1) : (selectedRowKeys[0] as number),
        fecha: values.fecha.format('YYYY-MM-DD'),
        idProveedor: values.idProveedor,
        proveedor: proveedorObj.nombre,
        items: items,
      };

      if (formType === 'agregar') {
        setOrdenes([...ordenes, newOrden]);
        message.success('Orden de compra agregada');
      } else {
        setOrdenes(ordenes.map(o => o.id === newOrden.id ? newOrden : o));
        message.success('Orden de compra actualizada');
      }

      setIsModalOpen(false);
      setFormType('');
      form.resetFields();
      setItems([]);
      setSelectedRowKeys([]);
    } catch (err) {
      // validation errors
    }
  };

  // helpers para manejar items dentro del modal
  const removeItem = (id: number) => setItems(items.filter(i => i.idDet !== id));

  // helpers para manejar items dentro del modal (agregar repuesto igual que Presupuesto)
  const addRepuesto = (values: any) => {
    const nextId = items.length ? Math.max(...items.map(r => r.idDet)) + 1 : 1;
    const repObj = repuestosCatalog.find(r => r.id === values.idRepuesto);
    setItems([...items, { idDet: nextId, idRepuesto: values.idRepuesto, repuesto: repObj ? repObj.nombre : '', cant: values.cant || 1, importe: values.importe || 0 }]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    type: 'radio' as const,
  };

  return (
    <div className="presupuesto-container" style={{ padding: 24 }}>
      <h1>Ordenes de compra</h1>
      <Space style={{ marginBottom: 16 }}>
  <Button type="primary" onClick={handleAgregar}>Agregar orden de compra</Button>
        <Button disabled={selectedRowKeys.length !== 1} onClick={handleEditar}>Editar</Button>
        <Button danger disabled={selectedRowKeys.length === 0} onClick={handleEliminar}>Eliminar</Button>
      </Space>

      <Table rowKey="id" columns={columns} dataSource={ordenes} rowSelection={rowSelection} pagination={{ pageSize: 8 }} />

      <Modal
        title={formType === 'agregar' ? 'Agregar Orden de compra' : 'Editar Orden de compra'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); setItems([]); setSelectedRowKeys([]); }}
        okText="Guardar"
        cancelText="Cancelar"
        width={900}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="fecha" label="Fecha" rules={[{ required: true, message: 'Ingrese la fecha' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="idProveedor" label="Proveedor" rules={[{ required: true, message: 'Seleccione el proveedor' }]}> 
            <Select style={{ width: 300 }} options={proveedores.map(p => ({ value: p.id, label: p.nombre }))} />
          </Form.Item>

          <div className="detalle-section" style={{ marginTop: 12 }}>
            <h3>Repuestos</h3>
            <Form onFinish={addRepuesto} layout="inline" style={{ marginBottom: 8 }}>
              <Form.Item name="idRepuesto" rules={[{ required: true, message: 'Seleccione el repuesto' }]}> 
                <Select style={{ width: 300 }} options={repuestosCatalog.map(r => ({ value: r.id, label: r.nombre }))} placeholder="Repuesto" />
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
            <Table columns={itemColumns} dataSource={items} rowKey="idDet" pagination={false} />
          </div>

        </Form>
      </Modal>
    </div>
  );
};

export default OrdenCompra;
