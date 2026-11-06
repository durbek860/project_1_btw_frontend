import React, { useState } from 'react';
import {
    Table, Form, Input, InputNumber, Button, Space,
    Popconfirm, Card, Typography, message, Row, Col,
    Divider, Tabs, Select
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons';
import {
    useGetNormsQuery,
    useAddNormMutation,
    useUpdateNormMutation,
    useDeleteNormMutation
} from '../../context/norm';
import { useGetProductsQuery } from '../../context/products';
import './Norms.css';

const Norms = () => {
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState(null);

    const { data: rawNorms, isLoading, isError } = useGetNormsQuery();
    const [addNorm] = useAddNormMutation();
    const [updateNorm] = useUpdateNormMutation();
    const [deleteNorm] = useDeleteNormMutation();

    const { data: rawProducts, isLoading: isProductsLoading } = useGetProductsQuery();

    const norms = Array.isArray(rawNorms) ? rawNorms : rawNorms?.data || [];
    const products = Array.isArray(rawProducts) ? rawProducts : rawProducts?.data || [];

    const onFinish = async (values) => {
        try {
            if (editingId) {
                await updateNorm({ id: editingId, body: values }).unwrap();
                message.success('Yangilandi!');
                setEditingId(null);
            } else {
                await addNorm(values).unwrap();
                message.success('Qo‘shildi!');
            }
            form.resetFields();
        } catch (err) {
            message.error('Xatolik yuz berdi!');
        }
    };

    const handleEdit = (r) => {
        setEditingId(r._id || r.id);
        form.setFieldsValue({
            productName: r.productName,
            unit: r.unit,
            quantity: r.quantity,
            materials: r.materials || []
        });
    };

    const handleMaterialSelect = (selectedName, fieldIndex) => {
        const item = products.find(p => (p.name || p.title || p.productName) === selectedName);
        if (item && item.unit) {
            const currentMaterials = form.getFieldValue('materials') || [];
            currentMaterials[fieldIndex] = {
                ...currentMaterials[fieldIndex],
                unit: item.unit
            };
            form.setFieldsValue({ materials: currentMaterials });
        }
    };

    const columns = [
        {
            title: 'Mahsulot nomi',
            dataIndex: 'productName',
            key: 'productName',
            render: (t) => <b className="table-title-text">{t}</b>
        },
        {
            title: 'Amallar',
            key: 'actions',
            width: 240,
            align: 'center',
            render: (_, r) => (
                <Space size="middle">
                    <Button type="primary" ghost icon={<EditOutlined />} onClick={() => handleEdit(r)}>
                        O‘zgartirish
                    </Button>
                    <Popconfirm title="O‘chirish?" onConfirm={() => deleteNorm(r._id || r.id).unwrap()}>
                        <Button danger icon={<DeleteOutlined />}>O‘chirish</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const expandedRowRender = (r) => (
        <Table
            columns={[
                { title: 'Material nomi', dataIndex: 'materialName' },
                { title: 'Sarfi', dataIndex: 'quantityPerUnit', render: (v, m) => `${v} ${m.unit}` }
            ]}
            dataSource={r.materials || []}
            pagination={false}
            size="small"
            rowKey={(m, idx) => m._id || m.id || idx}
        />
    );

    if (isError) return <div className="norms-error-message">Server xatoligi.</div>;

    return (
        <div id="norm">
            <Tabs defaultActiveKey="tab1">
                <Tabs.TabPane tab="New Normative" key="tab1">
                    <div className="norms-wrapper">
                        <Typography.Title level={2} className="norms-main-title">Normativlar</Typography.Title>

                        <Card title={editingId ? 'Tahrirlash' : 'Yangi qo‘shish'} className="norms-card-form" bordered={false}>
                            <Form form={form} layout="vertical" onFinish={onFinish}>
                                <Row gutter={16}>
                                    <Col xs={24} md={10}>
                                        <Form.Item
                                            name="productName"
                                            label="Mahsulot"
                                            rules={[{ required: true, message: 'Mahsulot nomini kiriting!' }]}
                                        >
                                            <Input className="norms-input" placeholder="Mahsulot nomini kiriting" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Divider orientation="left">Materiallar</Divider>

                                <Form.List name="materials">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, ...f }) => (
                                                <Row gutter={16} key={key} align="bottom" style={{ marginBottom: 12 }}>
                                                    <Col xs={24} md={9}>
                                                        <Form.Item
                                                            {...f}
                                                            name={[name, 'materialName']}
                                                            rules={[{ required: true, message: 'Materialni tanlang!' }]}
                                                            label={name === 0 ? "Nomi" : ""}
                                                        >
                                                            <Select
                                                                showSearch
                                                                loading={isProductsLoading}
                                                                placeholder="Ombordan material tanlang"
                                                                optionFilterProp="children"
                                                                onChange={(val) => handleMaterialSelect(val, name)}
                                                                filterOption={(input, option) =>
                                                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                                }
                                                            >
                                                                {products.map((item) => {
                                                                    const matName = item.name || item.productName || item.title;
                                                                    return (
                                                                        <Select.Option key={item._id || item.id} value={matName}>
                                                                            {matName}
                                                                        </Select.Option>
                                                                    );
                                                                })}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col xs={11} md={6}>
                                                        <Form.Item {...f} name={[name, 'quantityPerUnit']} rules={[{ required: true }]} label={name === 0 ? "Sarfi" : ""}>
                                                            <InputNumber min={0.001} style={{ width: '100%' }} className="norms-input" />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col xs={11} md={6}>
                                                        <Form.Item {...f} name={[name, 'unit']} rules={[{ required: true }]} label={name === 0 ? "Birligi" : ""}>
                                                            <Input className="norms-input" placeholder="kg, dona" />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col xs={2} md={3} style={{ textAlign: 'center' }}>
                                                        <MinusCircleOutlined
                                                            onClick={() => remove(name)}
                                                            style={{ fontSize: '20px', color: '#e53e3e', marginBottom: name === 0 ? '10px' : '14px', cursor: 'pointer' }}
                                                        />
                                                    </Col>
                                                </Row>
                                            ))}

                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Material qo'shish
                                            </Button>
                                        </>
                                    )}
                                </Form.List>

                                <Row justify="end" style={{ marginTop: 20 }}>
                                    <Space>
                                        {editingId && (
                                            <Button onClick={() => { setEditingId(null); form.resetFields(); }}>
                                                Bekor qilish
                                            </Button>
                                        )}
                                        <Button type="primary" htmlType="submit" className="norms-submit-btn">
                                            {editingId ? 'Saqlash' : 'Yaratish'}
                                        </Button>
                                    </Space>
                                </Row>
                            </Form>
                        </Card>
                    </div>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Normatives" key="tab2">
                    <div className="norms-table-container-container">
                        <div className="norms-table-container">
                            <Table
                                dataSource={norms}
                                columns={columns}
                                rowKey={(r) => r._id || r.id}
                                loading={isLoading}
                                expandable={{ expandedRowRender }}
                                pagination={{ pageSize: 5 }}
                            />
                        </div>
                    </div>
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default Norms;