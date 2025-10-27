
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Select, DatePicker, TimePicker, Input, InputNumber, Space, message } from "antd";
import type { ColumnsType } from 'antd/es/table';
import './Mecanicos.module.css';

interface Mecanico {
  id: number;
  nombre: string;
  apellido: string;
  idCalle: number;
  altura: number;
  telefono: string;
  email: string;
  cuit: string;
}

const initialMecanicos: Mecanico[] = [
  { id: 1, nombre: 'Pedro', apellido: 'Castro', idCalle: 4, altura: 1235, telefono: '123446297', email: 'pedro@gmail.com', cuit: '20345678901' },
  { id: 2, nombre: 'Agustin', apellido: 'Morales', idCalle: 7, altura: 568, telefono: '123481246', email: 'agustin@gmail.com', cuit: '10345670640' },
  { id: 3, nombre: 'Maximo', apellido: 'Ramos', idCalle: 2, altura: 1350, telefono: '123432164', email: 'Maximo@gmail.com', cuit: '23345694851' },
  { id: 4, nombre: 'Adrian', apellido: 'Tuerca', idCalle: 6, altura: 320, telefono: '123454825', email: 'adrian@gmail.com', cuit: '21345361294' },
];

const Mecanicos = () => {
  const [mecanicos, setMecanicos] = useState<Mecanico[]>(initialMecanicos);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'agregar' | 'editar' | ''>('');
  const [form] = Form.useForm();

  const calles = [
  { id: 1, nombre: 'San Martin' },
  { id: 2, nombre: 'Del Campo' },
  { id: 3, nombre: 'Alsina' },
  { id: 4, nombre: 'Varela' },
  { id: 5, nombre: 'Gutierrez' },
  { id: 6, nombre: 'Artigas' },
  { id: 7, nombre: 'Estrada' },
  { id: 8, nombre: 'Mitre' },
  { id: 9, nombre: 'Balcarse' },
  { id: 10, nombre: 'Encina' },
];

  const columns: ColumnsType<Mecanico> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Apellido', dataIndex: 'apellido', key: 'apellido' },
    { title: 'ID Calle', dataIndex: 'idCalle', key: 'idCalle' },
    { title: 'Altura', dataIndex: 'altura', key: 'altura' },
    { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'CUIT', dataIndex: 'cuit', key: 'cuit' },
  ];

  const handleAgregar = () => {
    setFormType('agregar');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditar = () => {
    if (selectedRowKeys.length !== 1) return;
    setFormType('editar');
    const mecanico = mecanicos.find(m => m.id === selectedRowKeys[0]);
    if (mecanico) {
      const calleObj = calles.find(cll => cll.id === mecanico.idCalle);             //////////////
      form.setFieldsValue(mecanico);
      idCalle: calleObj ? calleObj.id : undefined,                                  /////////////
      setIsModalOpen(true);
    }
  };

  const handleEliminar = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: '¿Eliminar mecanico(s)?',
      content: '¿Estás seguro que deseas eliminar el/los mecanico(s) seleccionado(s)?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        setMecanicos(mecanicos.filter(m => !selectedRowKeys.includes(m.id)));
        setSelectedRowKeys([]);
        message.success('Mecanico(s) eliminado(s)');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (formType === 'agregar') {
        const newId = mecanicos.length ? Math.max(...mecanicos.map(m => m.id)) + 1 : 1;
        setMecanicos([...mecanicos, { id: newId, ...values }]);
        message.success('Mecanico agregado');
      } else if (formType === 'editar') {
        setMecanicos(mecanicos.map(m => m.id === selectedRowKeys[0] ? { ...m, ...values } : m));
        message.success('Mecanico editado');
      }
      setIsModalOpen(false);
      setFormType('');
      form.resetFields();
      setSelectedRowKeys([]);
    } catch (err) {
      // validation error
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setFormType('');
    form.resetFields();
  };

  const rowSelection = {
    type: 'radio' as const,
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div className="mecanicos-container" style={{ padding: 24 }}>
      <h1 className="mecanicos-title">Mecanicos</h1>
      <Space className="mecanicos-actions" style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAgregar}>Agregar</Button>
        <Button onClick={handleEditar} disabled={selectedRowKeys.length !== 1}>Editar</Button>
        <Button danger onClick={handleEliminar} disabled={selectedRowKeys.length === 0}>Eliminar</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={mecanicos}
        rowSelection={rowSelection}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        open={isModalOpen}
        title={formType === 'agregar' ? 'Agregar Mecanico' : 'Editar Mecanico'}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ nombre: '', apellido: '', idCalle: '', altura: '', telefono: '', email: '', cuit: '' }}
        >
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Ingrese el nombre' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Apellido"
            name="apellido"
            rules={[{ required: true, message: 'Ingrese el apellido' }]}
          >
            <Input />
          </Form.Item>
          {/*AGREGAR DESPLEGABLE DE ID CALLE*/}
          <Form.Item name="idCalle" label="Calle" 
            rules={[{ required: true, message: 'Seleccione una calle' }]}> 
            <Select options={calles.map(cll => ({ value: cll.id, label: cll.nombre }))} 
            /> 

          </Form.Item>

          <Form.Item
            label="Altura"
            name="altura"
            rules={[{ required: true, message: 'Ingrese la altura de la casa' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Ingrese un email válido' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Teléfono"
            name="telefono"
            rules={[{ required: true, message: 'Ingrese el teléfono' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="CUIT"
            name="cuit"
            rules={[{ required: true, message: 'Ingrese el CUIT' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Mecanicos;
