import React, { useState } from 'react';
import {
    Table, Form, Input, InputNumber, Button, Space,
    Popconfirm, Card, Typography, message, Row, Col,
    Modal, Tag, Select
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import {
    useGetFinishedProductsQuery,
    useAddFinishedProductMutation,
    useUpdateFinishedProductMutation,
    useDeleteFinishedProductMutation
} from '../../context/finishedProductsApi';
import { useGetNormsQuery } from '../../context/norm';
import './FinishedProducts.css';

const FinishedProducts = () => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchText, setSearchText] = useState('');

    const { data: rawData, isLoading, isError } = useGetFinishedProductsQuery();
    const { data: normsData } = useGetNormsQuery();
    const [addProduct, { isLoading: isAdding }] = useAddFinishedProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateFinishedProductMutation();
    const [deleteProduct] = useDeleteFinishedProductMutation();

    const products = Array.isArray(rawData) ? rawData : rawData?.data || [];
    const norms = Array.isArray(normsData) ? normsData : normsData?.data || [];

    const filteredProducts = products.filter(item =>
        (item.productName || item.name || '')
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    const handleOpenModal = (record = null) => {
        if (record) {
            setEditingId(record._id || record.id);
            form.setFieldsValue({
                productName: record.productName || record.name,
                quantity: record.quantity,
                unit: record.unit,
                price: record.price
            });
        } else {
            setEditingId(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingId(null);
        form.resetFields();
    };

    const handleNormChange = (value) => {
        const selectedNorm = norms.find(n => n.productName === value);
        if (selectedNorm && selectedNorm.unit) {
            form.setFieldsValue({ unit: selectedNorm.unit });
        }
    };

    const onFinish = async (values) => {
        try {
            if (editingId) {
                await updateProduct({ id: editingId, body: values }).unwrap();
                message.success('Mahsulot yangilandi!');
            } else {
                await addProduct(values).unwrap();
                message.success('Tayyor mahsulot yaratildi va xomashyolar ombordan ayrildi!');
            }
            handleCancel();
        } catch (err) {
            const errorMsg = err?.data?.message || err?.message || 'Xatolik yuz berdi!';
            message.error(errorMsg);
        }
    };

    const columns = [
        {
            title: 'Mahsulot nomi',
            dataIndex: 'productName',
            key: 'productName',
            render: (text, record) => <b>{text || record.name}</b>
        },
        {
            title: 'Qoldiq miqdori',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (val, record) => (
                <Tag color={val > 10 ? 'green' : 'volcano'}>
                    {val} {record.unit}
                </Tag>
            )
        },
        {
            title: 'Birligi',
            dataIndex: 'unit',
            key: 'unit'
        },
        {
            title: 'Narxi',
            dataIndex: 'price',
            key: 'price',
            render: (val) => val ? `${val.toLocaleString()} so'm` : '-'
        },
        {
            title: 'Amallar',
            key: 'actions',
            width: 220,
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        ghost
                        icon={<EditOutlined />}
                        onClick={() => handleOpenModal(record)}
                    >
                        Tahrirlash
                    </Button>
                    <Popconfirm
                        title="O‘chirishni tasdiqlaysizmi?"
                        onConfirm={() => deleteProduct(record._id || record.id).unwrap()}
                        okText="Ha"
                        cancelText="Yo'q"
                    >
                        <Button danger icon={<DeleteOutlined />}>O‘chirish</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (isError) return <div className="fp-error-message">Serverdan ma'lumot olishda xatolik!</div>;

    return (
        <div id="finished-products">
            <Card className="fp-card">
                <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                    <Col xs={24} sm={12}>
                        <Typography.Title level={3} style={{ margin: 0 }}>
                            Tayyor Mahsulotlar Ombori
                        </Typography.Title>
                    </Col>
                    <Col xs={24} sm={12} style={{ textAlign: 'right', marginTop: '10px' }}>
                        <Space wrap>
                            <Input
                                placeholder="Qidirish..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ width: 200 }}
                            />
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => handleOpenModal()}
                                className="fp-add-btn"
                            >
                                Mahsulot qo'shish
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Table
                    dataSource={filteredProducts}
                    columns={columns}
                    rowKey={(record) => record._id || record.id}
                    loading={isLoading}
                    pagination={{ pageSize: 8 }}
                />
            </Card>

            <Modal
                title={editingId ? "Mahsulotni tahrirlash" : "Yangi tayyor mahsulot ishlab chiqarish"}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="productName"
                        label="Mahsulot nomi (Normativ bo'yicha)"
                        rules={[{ required: true, message: 'Mahsulot nomini tanlang yoki kiriting!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Normativdagi mahsulotni tanlang"
                            optionFilterProp="children"
                            onChange={handleNormChange}
                            disabled={!!editingId}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={norms.map(norm => ({
                                value: norm.productName,
                                label: norm.productName
                            }))}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="quantity"
                                label="Ishlab chiqarish miqdori"
                                rules={[{ required: true, message: 'Miqdorni kiriting!' }]}
                            >
                                <InputNumber min={0.1} step="any" style={{ width: '100%' }} placeholder="0" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="unit"
                                label="Birligi"
                                rules={[{ required: true, message: 'Birlikni kiriting!' }]}
                            >
                                <Input placeholder="kg, dona..." />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="price" label="Sotuv narxi">
                        <InputNumber min={0} style={{ width: '100%' }} placeholder="So'mda kiriting" />
                    </Form.Item>

                    <Row justify="end" style={{ marginTop: 20 }}>
                        <Space>
                            <Button onClick={handleCancel}>Bekor qilish</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isAdding || isUpdating}
                                className="fp-add-btn"
                            >
                                {editingId ? 'Saqlash' : 'Ishlab chiqarish'}
                            </Button>
                        </Space>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default FinishedProducts;