import React, { useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, Select, DatePicker, Space, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './ReclamoProveedor.css';

interface ReclamoProveedorItem {
  id: number;
  idProveedor: number;
  fecha: string;
  descripcion: string;
  estado: string;
}

const proveedores = [
  { id: 1, nombre: 'Casa de repuestos 1' },
  { id: 2, nombre: 'Casa de repuestos 2' },
];

const estados = [
  { id: 1, nombre: 'Pendiente' },
  { id: 2, nombre: 'En progreso' },
  { id: 3, nombre: 'Completado' },
];

const initialReclamosPreveedor: ReclamoProveedorItem[] = [
  {
    id: 1,
    idProveedor: 1,
    fecha: '2025-08-25',
    descripcion: '',
    estado: 'En progreso',
  }
];

const ReclamoProveedor = () => {
  const [reclamosproveedor, setReclamosProveedor] = useState<ReclamoProveedorItem[]>(initialReclamosPreveedor);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar'|'editar'|' '>(' ');
  const [form] = Form.useForm();

  const columns: ColumnsType<ReclamoProveedorItem> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'ID Proveedor', dataIndex: 'idProeedor', key: 'idProveedor', width: 80 },
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
    const rc = reclamosproveedor.find(rc => rc.id === selectedRowKeys[0]);
    if (rc) {
      form.setFieldsValue({
        idCliente: rc.idProveedor,
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
      title: '¿Eliminar reclamo a proveedor(es)?',
      content: '¿Estás seguro que deseas eliminar el/los reclamo(s) a proveedor(es) seleccionado(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setReclamosProveedor(reclamosproveedor.filter(rc => !selectedRowKeys.includes(rc.id)));
        setSelectedRowKeys([]);
        message.success('Reclamo(s) a proveedor(es) eliminado(s)');
      }
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const newReclamoProveedor: ReclamoProveedorItem = {
        id: formType === 'agregar' ? (reclamosproveedor.length ? Math.max(...reclamosproveedor.map(rp => rp.id)) + 1 : 1) : (selectedRowKeys[0] as number),
        idProveedor: values.idCliente,
        fecha: values.fecha.format('YYYY-MM-DD'),
        descripcion: values.descripcion,
        estado: values.estado,
      };
      if (formType === 'agregar') {
        setReclamosProveedor([...reclamosproveedor, newReclamoProveedor]);
        message.success('Reclamo a proveedor agregado');
      } else {
        setReclamosProveedor(reclamosproveedor.map(rp => rp.id === newReclamoProveedor.id ? newReclamoProveedor : rp));
        message.success('Reclamo a proveedor editado');
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
    <div className="ReclamoProveedor-container" style={{ padding: 24 }}>
      <h1>Reclamos a Proveedores</h1>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar reclamo a Proveedor</Button>
        <Button disabled={selectedRowKeys.length !== 1} onClick={handleEditar}>Editar</Button>
        <Button danger disabled={selectedRowKeys.length === 0} onClick={handleEliminar}>Eliminar</Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={reclamosproveedor} rowSelection={rowSelection} pagination={{ pageSize: 8 }} />

      <Modal
        title={formType === 'agregar' ? 'Agregar reclamo a proveedor' : 'Editar reclamo a proveedor'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Guardar"
        cancelText="Cancelar"
        width={900}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="idProveedor" label={<span> Proveedor <Button size="small" type="link">Nuevo Proveedor</Button></span>} rules={[{ required: true, message: 'Seleccione el proveedor' }]}>
            <Select options={proveedores.map(pr => ({ value: pr.id }))} />
          </Form.Item>
          <Form.Item name="fecha" label="Fecha" rules={[{ required: true, message: 'Ingrese la fecha' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="descripcion" label="Descripciones"> <Input style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="estado" label="Estado" rules={[{ required: true, message: 'Seleccione el estado' }]}>
            <Select options={estados.map(e => ({ value: e.id, label: e.nombre }))} />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default ReclamoProveedor;
