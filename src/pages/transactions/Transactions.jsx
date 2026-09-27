import React, { useState, useMemo, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker, Space, Row, Col, Card, Statistic, Segmented, message } from 'antd';
import { PlusOutlined, CalendarOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
    useGetFilteredTransactionsQuery,
    useAddTransactionsMutation,
    useChangeTransactionsMutation,
    useDeleteTransactionsMutation
} from '../../context/bloknot';
import './Transactions.css';

const Transactions = () => {
    const [dates, setDates] = useState([]);
    const [selectedType, setSelectedType] = useState('all');
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const startDate = dates?.[0] ? dates[0].startOf('day').toISOString() : undefined;
    const endDate = dates?.[1] ? dates[1].endOf('day').toISOString() : undefined;

    const { data: rawList = [], isLoading: isListLoading } = useGetFilteredTransactionsQuery({
        type: selectedType !== 'all' ? selectedType : undefined,
        startDate,
        endDate,
    });

    const [addTransactions, { isLoading: isAdding }] = useAddTransactionsMutation();
    const [changeTransactions, { isLoading: isChanging }] = useChangeTransactionsMutation();
    const [deleteTransactions] = useDeleteTransactionsMutation();

    const transactionsList = Array.isArray(rawList) ? rawList : rawList?.data || [];

    const { totalIncome, totalExpense, totalBalance } = useMemo(() => {
        const income = transactionsList
            .filter((item) => item.type === 'income')
            .reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

        const expense = transactionsList
            .filter((item) => item.type === 'expense')
            .reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

        return {
            totalIncome: income,
            totalExpense: expense,
            totalBalance: income - expense,
        };
    }, [transactionsList]);

    const handleOpenAddModal = () => {
        setEditingRecord(null);
        form.resetFields();
        form.setFieldsValue({ type: 'income' });
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            type: record.type,
            amount: record.amount,
            category: record.category,
            description: record.description,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (editingRecord) {
                const recordId = editingRecord._id || editingRecord.id;
                await changeTransactions({ id: recordId, body: values }).unwrap();
                message.success("Operatsiya muvaffaqiyatli tahrirlandi!");
            } else {
                await addTransactions({ body: values }).unwrap();
                message.success("Operatsiya muvaffaqiyatli qo'shildi!");
            }

            setIsModalOpen(false);
            setEditingRecord(null);
            form.resetFields();
        } catch (error) {
            console.error("Xatolik yuz berdi:", error);
            message.error("Xatolik yuz berdi!");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTransactions({ id }).unwrap();
            message.success("Operatsiya o'chirildi!");
        } catch (error) {
            console.error("O'chirishda xatolik:", error);
            message.error("O'chirishda xatolik yuz berdi!");
        }
    };

    const handleCancelModal = () => {
        setIsModalOpen(false);
        setEditingRecord(null);
        form.resetFields();
    };

    const columns = [
        {
            title: 'Sana',
            dataIndex: 'createdAt',
            key: 'date',
            render: (d, record) => {
                const dateVal = record.createdAt || record.date;
                return <span>{dateVal ? new Date(dateVal).toLocaleDateString() : '—'}</span>;
            }
        },
        { title: 'Izoh', dataIndex: 'description', key: 'description', render: (t) => <span>{t || '—'}</span> },
        { title: 'Kategoriya', dataIndex: 'category', key: 'category', render: (t) => <span>{t}</span> },
        {
            title: 'Turi',
            dataIndex: 'type',
            key: 'type',
            render: (t) => (
                <span className={t === 'income' ? 'text-income' : 'text-expense'}>
                    {t === 'income' ? 'Kirim' : 'Xarajat'}
                </span>
            )
        },
        {
            title: 'Miqdor',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            render: (a) => <strong className="table-amount-text">{(a || 0).toLocaleString()} so'm</strong>
        },
        {
            title: 'Amallar',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        ghost
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record._id || record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="content-wrapper">
            <div className="dashboard-container">
                <h2 className="dashboard-title">Umumiy statistika</h2>
                <Row gutter={16}>
                    <Col xs={24} sm={8}>
                        <Card bordered={false} className="dashboard-card card-income">
                            <Statistic
                                title="Umumiy Kirim"
                                value={totalIncome}
                                suffix="so'm"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card bordered={false} className="dashboard-card card-expense">
                            <Statistic
                                title="Umumiy Xarajat"
                                value={totalExpense}
                                suffix="so'm"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card bordered={false} className="dashboard-card card-balance">
                            <Statistic
                                title="Balans"
                                value={totalBalance}
                                suffix="so'm"
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            <div className="content-header">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAddModal} className="action-button">
                    Yangi qo'shish
                </Button>
                <Space size="middle">
                    <Select
                        value={selectedType}
                        onChange={(value) => setSelectedType(value)}
                        className="filter-select"
                        options={[
                            { value: 'all', label: 'Barchasi' },
                            { value: 'income', label: 'Kirim' },
                            { value: 'expense', label: 'Xarajat' },
                        ]}
                    />
                    <DatePicker.RangePicker onChange={(v) => setDates(v || [])} suffixIcon={<CalendarOutlined />} className="filter-input" />
                </Space>
            </div>

            {!mobile ? (
                <Table
                    size='small'
                    dataSource={transactionsList}
                    columns={columns}
                    rowKey={(record) => record._id || record.id}
                    loading={isListLoading}
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 'max-content' }}
                    className="table-custom"
                    footer={() => (
                        <div className="table-footer-custom">
                            <span>Jami (Balans)</span>
                            <span>{totalBalance.toLocaleString()} so'm</span>
                        </div>
                    )}
                />
            ) : (
                <div className="cards">
                    {transactionsList.length === 0 && !isListLoading ? (
                        <div className="empty-message">Ma'lumot topilmadi</div>
                    ) : (
                        transactionsList.map((item) => {
                            const dateVal = item.createdAt || item.date;
                            const isIncome = item.type === 'income';
                            return (
                                <div className="card-item" key={item._id || item.id}>
                                    <div className="card-item-row">
                                        <span className="card-label">Sana:</span>
                                        <span className="card-value">{dateVal ? new Date(dateVal).toLocaleDateString() : '—'}</span>
                                    </div>
                                    <div className="card-item-row">
                                        <span className="card-label">Kategoriya:</span>
                                        <span className="card-value">{item.category || '—'}</span>
                                    </div>
                                    <div className="card-item-row">
                                        <span className="card-label">Turi:</span>
                                        <span className={`card-value ${isIncome ? 'text-income' : 'text-expense'}`}>
                                            {isIncome ? 'Kirim' : 'Xarajat'}
                                        </span>
                                    </div>
                                    <div className="card-item-row">
                                        <span className="card-label">Miqdor:</span>
                                        <span className={`card-value amount-value ${isIncome ? 'text-income' : 'text-expense'}`}>
                                            {(item.amount || 0).toLocaleString()} so'm
                                        </span>
                                    </div>
                                    {item.description && (
                                        <div className="card-item-row">
                                            <span className="card-label">Izoh:</span>
                                            <span className="card-value">{item.description}</span>
                                        </div>
                                    )}
                                    <div className="card-item-actions">
                                        <Button
                                            type="primary"
                                            ghost
                                            size="small"
                                            icon={<EditOutlined />}
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            danger
                                            size="small"
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleDelete(item._id || item.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            <Modal
                title={editingRecord ? "Operatsiyani tahrirlash" : "Yangi operatsiya qo'shish"}
                open={isModalOpen}
                onCancel={handleCancelModal}
                onOk={() => form.submit()}
                confirmLoading={isAdding || isChanging}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="type" label="Turi" rules={[{ required: true, message: 'Iltimos, turini tanlang!' }]}>
                        <Segmented
                            block
                            size="large"
                            options={[
                                { label: 'Kirim', value: 'income' },
                                { label: 'Xarajat', value: 'expense' }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="amount" label="Miqdori" rules={[{ required: true, message: 'Iltimos, miqdorni kiriting!' }]}>
                        <InputNumber className="modal-input-number" min={0} />
                    </Form.Item>
                    <Form.Item name="category" label="Kategoriya" rules={[{ required: true, message: 'Iltimos, kategoriyani kiriting!' }]}>
                        <Input placeholder="Masalan: Oylik, Oziq-ovqat" />
                    </Form.Item>
                    <Form.Item name="description" label="Izoh (Ixtiyoriy)">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Transactions;