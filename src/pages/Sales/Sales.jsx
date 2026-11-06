import React, { useState } from 'react';
import { Table, Card, Typography, Button, Modal, Form, Input, InputNumber, Select, Tag, message } from 'antd';
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useGetSalesQuery, useAddSaleMutation } from '../../context/sale';
import { useGetFinishedProductsQuery } from '../../context/finishedProductsApi';
import './Sales.css';

const Sales = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const { data: salesData, isLoading: salesLoading } = useGetSalesQuery();
    const { data: productsData } = useGetFinishedProductsQuery();
    const [addSale, { isLoading: isSubmitting }] = useAddSaleMutation();

    const sales = Array.isArray(salesData) ? salesData : salesData?.data || [];
    const products = Array.isArray(productsData) ? productsData : productsData?.data || [];

    const handleOpenModal = () => {
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleFinish = async (values) => {
        try {
            await addSale(values).unwrap();
            message.success("Sotuv muvaffaqiyatli amalga oshirildi!");
            setIsModalOpen(false);
            form.resetFields();
        } catch (err) {
            message.error(err?.data?.message || "Xatolik yuz berdi!");
        }
    };

    const columns = [
        {
            title: 'Mijoz ismi',
            dataIndex: 'customerName',
            key: 'customerName',
            render: (text) => <b>{text}</b>
        },
        {
            title: 'Telefon raqami',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Mahsulot',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Miqdori',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Jami summa',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (val) => `${val?.toLocaleString()} so'm`
        },
        {
            title: 'To\'langan',
            dataIndex: 'paidAmount',
            key: 'paidAmount',
            render: (val) => `${val?.toLocaleString()} so'm`
        },
        {
            title: 'Qarz',
            dataIndex: 'debt',
            key: 'debt',
            render: (val) => (
                <Tag color={val > 0 ? 'volcano' : 'green'}>
                    {val?.toLocaleString() || 0} so'm
                </Tag>
            )
        },
        {
            title: 'Sana',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (val) => new Date(val).toLocaleString()
        }
    ];

    return (
        <div className="sales-page">
            <Card className="sales-card">
                <div className="sales-header">
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        <ShoppingCartOutlined /> Sotuvlar tarixi va savdo
                    </Typography.Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
                        Yangi sotuv qilish
                    </Button>
                </div>

                <Table
                    dataSource={sales}
                    columns={columns}
                    rowKey="_id"
                    loading={salesLoading}
                    pagination={{ pageSize: 8 }}
                />
            </Card>

            <Modal
                title="Yangi sotuv yaratish"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item
                        name="customerName"
                        label="Mijoz ismi va familiyasi"
                        rules={[{ required: true, message: 'Iltimos, mijoz ismini kiriting!' }]}
                    >
                        <Input placeholder="Masalan: Anvar Toshmatov" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Telefon raqami"
                        rules={[{ required: true, message: 'Iltimos, telefon raqamini kiriting!' }]}
                    >
                        <Input placeholder="+998 90 123 45 67" />
                    </Form.Item>

                    <Form.Item name="address" label="Manzili">
                        <Input placeholder="Shahar, ko'cha, uy..." />
                    </Form.Item>

                    <Form.Item
                        name="productName"
                        label="Mahsulotni tanlang (Kostyum)"
                        rules={[{ required: true, message: 'Mahsulotni tanlang!' }]}
                    >
                        <Select placeholder="Ombordagi tayyor mahsulotni tanlang">
                            {products.map((prod) => (
                                <Select.Option key={prod._id} value={prod.productName}>
                                    {prod.productName} (Mavjud: {prod.quantity} ta)
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="quantity"
                        label="Soni (Nechta olyapti)"
                        rules={[{ required: true, message: 'Miqdorni kiriting!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} placeholder="1" min={1} />
                    </Form.Item>

                    <Form.Item
                        name="totalPrice"
                        label="Umumiy summa (so'm)"
                        rules={[{ required: true, message: 'Umumiy summani kiriting!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} placeholder="500000" />
                    </Form.Item>

                    <Form.Item name="paidAmount" label="To'langan summa (so'm)">
                        <InputNumber style={{ width: '100%' }} placeholder="300000" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block loading={isSubmitting}>
                        Sotuvni yakunlash
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Sales;