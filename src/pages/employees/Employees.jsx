import React, { useState } from 'react';
import { Table, Button, Input, Space, Tooltip, Modal, Form, Select, InputNumber, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import {
    useGetEmployeesQuery,
    useAddEmployeeMutation,
    useDeleteEmployeeMutation,
    useUpdateEmployeeMutation
} from '../../context/employee';
import './Employees.css';

const Employees = () => {
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();

    const { data: responseData, isLoading, refetch } = useGetEmployeesQuery();
    const [addEmployee, { isLoading: isAdding }] = useAddEmployeeMutation();
    const [deleteEmployee] = useDeleteEmployeeMutation();
    const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();

    const rawData = responseData?.data || responseData || [];

    const getId = (record) => record?._id || record?.id || record?.key;

    const handleDelete = async (id) => {
        Modal.confirm({
            title: "Haqiqatan ham bu xodimni o'chirmoqchimisiz?",
            okText: 'Ha',
            okType: 'danger',
            cancelText: "Yo'q",
            onOk: async () => {
                try {
                    await deleteEmployee(id).unwrap();
                    message.success("Xodim o'chirildi");
                    refetch();
                } catch (err) {
                    message.error(err?.data?.message || "O'chirishda xatolik");
                }
            }
        });
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            username: record.username,
            password: record.password,
            firstname: record.firstname,
            lastname: record.lastname,
            role: record.role,
            alloweds: record.alloweds,
            salary: record.salary
        });
        setIsModalVisible(true);
    };

    const handleAddClick = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            if (editingRecord) {
                const id = getId(editingRecord);
                await updateEmployee({ id: id, body: values }).unwrap();
                message.success("Xodim ma'lumotlari yangilandi!");
            } else {
                await addEmployee(values).unwrap();
                message.success("Yangi xodim qo'shildi!");
            }

            setIsModalVisible(false);
            setEditingRecord(null);
            refetch();
        } catch (err) {
            if (err.errorFields) return;
            message.error(err?.data?.message || "Xatolik yuz berdi");
        }
    };

    const columns = [
        {
            title: 'Ism',
            dataIndex: 'firstname',
            key: 'firstname'
        },
        {
            title: 'Familiya',
            dataIndex: 'lastname',
            key: 'lastname'
        },
        {
            title: 'Lavozim',
            dataIndex: 'role',
            key: 'role'
        },
        {
            title: 'Oylik',
            dataIndex: 'salary',
            key: 'salary',
            render: (value) => (value ? value.toLocaleString('ru-RU') : '0'),
        },
        {
            title: 'Login',
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: 'Ruxsatlar',
            dataIndex: 'alloweds',
            key: 'alloweds',
            render: (text) => (
                <span className="ruxsatlar-tag">
                    <MenuOutlined style={{ fontSize: '11px' }} /> {text || '0 ta'}
                </span>
            ),
        },
        {
            title: 'Amal',
            key: 'amal',
            render: (_, record) => {
                const id = getId(record);
                return (
                    <Space size="middle">
                        <Tooltip title="Tahrirlash">
                            <EditOutlined className="action-icon-edit" onClick={() => handleEdit(record)} />
                        </Tooltip>
                        <Tooltip title="O'chirish">
                            <DeleteOutlined className="action-icon-delete" onClick={() => handleDelete(id)} />
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];

    const filteredData = rawData.filter((item) => {
        if (!item) return false;
        const searchLower = searchText.toLowerCase();
        return (
            (item.firstname?.toLowerCase().includes(searchLower)) ||
            (item.lastname?.toLowerCase().includes(searchLower)) ||
            (item.username?.toLowerCase().includes(searchLower)) ||
            (item.role?.toLowerCase().includes(searchLower))
        );
    });

    return (
        <div className="page-container">
            <div className="content-card">
                <div className="table-controls">
                    <h1 className="table-title">Xodimlar ro'yxati</h1>
                    <div className="search-actions">
                        <Input
                            className="search-input"
                            placeholder="Qidirish..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
                            Yangi xodim
                        </Button>
                    </div>
                </div>

                <Table
                    size='small'
                    columns={columns}
                    dataSource={filteredData}
                    loading={isLoading}
                    pagination={false}
                    rowKey={(record) => getId(record)}
                    locale={{ emptyText: "Xodimlar topilmadi" }}
                />
            </div>

            <Modal
                title={editingRecord ? "Xodim ma'lumotlarini tahrirlash" : "Yangi xodim qo'shish"}
                open={isModalVisible}
                onOk={handleOk}
                confirmLoading={isAdding || isUpdating}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingRecord(null);
                }}
                okText="Saqlash"
                cancelText="Bekor qilish"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="firstname" label="Ism" rules={[{ required: true, message: 'Ismni kiriting!' }]}>
                        <Input placeholder="Ismni kiriting" />
                    </Form.Item>
                    <Form.Item name="lastname" label="Familiya">
                        <Input placeholder="Familiyani kiriting" />
                    </Form.Item>
                    <Form.Item name="username" label="Login" rules={[{ required: true, message: 'Loginni kiriting!' }]}>
                        <Input placeholder="Loginni kiriting" />
                    </Form.Item>
                    <Form.Item name="password" label="Parol" rules={[{ required: !editingRecord, message: 'Parolni kiriting!' }]}>
                        <Input.Password placeholder="Parolni kiriting" />
                    </Form.Item>
                    <Form.Item name="role" label="Lavozim" rules={[{ required: true, message: 'Lavozimni tanlang!' }]}>
                        <Select placeholder="Lavozimni tanlang">
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="manager">Manager</Select.Option>
                            <Select.Option value="employee">Employee</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="alloweds" label="Ruxsatlar" rules={[{ required: true, message: 'Ruxsatlarni kiriting!' }]}>
                        <Input placeholder="Masalan: read, write" />
                    </Form.Item>
                    <Form.Item name="salary" label="Oylik" rules={[{ required: true, message: 'Oylikni kiriting!' }]}>
                        <InputNumber placeholder="Summa" style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Employees;
