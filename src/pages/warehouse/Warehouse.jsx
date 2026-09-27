import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
    useGetProductsQuery,
    useAddProductMutation,
    useDeleteProductMutation,
    useUpdateProductMutation
} from '../../context/products';
import './Warehouse.css';

const { Title } = Typography;

const Warehouse = () => {
    const { data: products, isLoading } = useGetProductsQuery();
    const [addProduct] = useAddProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const [updateProduct] = useUpdateProductMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); 
    const [form] = Form.useForm();

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            form.setFieldsValue(product); 
        } else {
            setEditingProduct(null);
            form.resetFields(); 
        }
        setIsModalOpen(true);
    };

    const handleSave = async (values) => {
        try {
            if (editingProduct) {
                await updateProduct({ id: editingProduct._id, body: values }).unwrap();
                message.success("Mahsulot muvaffaqiyatli yangilandi!");
            } else {
                await addProduct(values).unwrap();
                message.success("Mahsulot muvaffaqiyatli qo'shildi!");
            }
            setIsModalOpen(false);
            form.resetFields();
            setEditingProduct(null);
        } catch (err) {
            message.error("Xatolik yuz berdi");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProduct(id).unwrap();
            message.success("Mahsulot o'chirildi");
        } catch (err) {
            message.error("O'chirishda xatolik yuz berdi");
        }
    };

    const columns = [
        { title: 'Nomi', dataIndex: 'name', key: 'name' },
        {
            title: 'Turi',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                if (type === 'donali') return 'Donali';
                if (type === 'kiloli') return 'Kiloli';
                return type;
            }
        },
        {
            title: 'Narxi',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price} so'm`,
        },
        { title: 'Miqdori', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Umumiy narx', render: (i,item) => item.price*item.quantity },
        {
            title: 'Amallar',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => openModal(record)}
                    >
                        Tahrirlash
                    </Button>
                    <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record._id)}
                    >
                        O'chirish
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="warehouse-container">
            <div className="warehouse-header">
                <Title level={2} className="warehouse-title">Ombor</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openModal()}
                >
                    Mahsulot qo'shish
                </Button>
            </div>

            <div className="warehouse-table-wrapper">
                <Table
                    dataSource={products?.data || []}
                    columns={columns}
                    rowKey="_id"
                    loading={isLoading}
                />
            </div>

            <Modal
                title={editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="name" label="Nomi" rules={[{ required: true, message: 'Iltimos nomini kiriting!' }]}>
                        <Input placeholder="Mahsulot nomi" />
                    </Form.Item>

                    <Form.Item name="type" label="Turi" rules={[{ required: true, message: 'Iltimos turini tanlang!' }]}>
                        <Select placeholder="Turini tanlang">
                            <Select.Option value="dona">Dona</Select.Option>
                            <Select.Option value="kg">Kg</Select.Option>
                            <Select.Option value="metr">Metr</Select.Option>
                            <Select.Option value="litr">Litr</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="price" label="Narxi" rules={[{ required: true, message: 'Iltimos narxini kiriting!' }]}>
                        <InputNumber style={{ width: '100%' }} placeholder="0" min={0} />
                    </Form.Item>

                    <Form.Item name="quantity" label="Miqdori" rules={[{ required: true, message: 'Iltimos miqdorini kiriting!' }]}>
                        <InputNumber style={{ width: '100%' }} placeholder="0" min={0} />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsModalOpen(false)}>Bekor qilish</Button>
                            <Button type="primary" htmlType="submit">
                                {editingProduct ? "Yangilash" : "Saqlash"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Warehouse;