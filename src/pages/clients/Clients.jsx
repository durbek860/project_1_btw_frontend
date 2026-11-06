import React, { useState } from 'react';
import { Table, Card, Typography, Tag, Input, Button, Modal, Form, InputNumber, message, Row, Col, Statistic, Space, Segmented } from 'antd';
import { SearchOutlined, EyeOutlined, DollarOutlined, ShoppingCartOutlined, WarningOutlined, UserOutlined } from '@ant-design/icons';
import { useGetCustomersQuery, usePayDebtMutation } from '../../context/sale';
import './Client.css';

const Clients = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [activeSale, setActiveSale] = useState(null);
  const [payForm] = Form.useForm();

  const { data: rawData, isLoading, isError } = useGetCustomersQuery();
  const [payDebt, { isLoading: isPaying }] = usePayDebtMutation();

  const customers = Array.isArray(rawData) ? rawData : rawData?.data || [];

  const overallTotalSpent = customers.reduce((acc, item) => acc + (item.totalSpent || 0), 0);
  const overallTotalDebt = customers.reduce((acc, item) => acc + (item.totalDebt || 0), 0);

  const filteredCustomers = customers.filter(item =>
    (item.customerName || '').toLowerCase().includes(searchText.toLowerCase()) ||
    (item.phone || '').includes(searchText)
  );

  const handleViewHistory = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleOpenPayModal = (sale) => {
    setActiveSale(sale);
    payForm.setFieldsValue({ amountPaid: sale.debt });
    setPayModalOpen(true);
  };

  const handlePaySubmit = async (values) => {
    try {
      await payDebt({ saleId: activeSale._id, amountPaid: values.amountPaid }).unwrap();
      message.success("Qarz muvaffaqiyatli to'landi!");
      setPayModalOpen(false);
      setIsModalOpen(false);
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
      key: 'phone'
    },
    {
      title: 'Manzili',
      dataIndex: 'address',
      key: 'address',
      render: (text) => text || '-'
    },
    {
      title: 'Jami xaridlar soni',
      dataIndex: 'purchasesCount',
      key: 'purchasesCount',
      align: 'center'
    },
    {
      title: 'Umumiy savdo summasi',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (val) => `${val?.toLocaleString() || 0} so'm`
    },
    {
      title: 'Qarzi',
      dataIndex: 'totalDebt',
      key: 'totalDebt',
      render: (val) => (
        <Tag color={val > 0 ? 'volcano' : 'green'}>
          {val?.toLocaleString() || 0} so'm
        </Tag>
      )
    },
    {
      title: 'Amallar',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          ghost
          icon={<EyeOutlined />}
          onClick={() => handleViewHistory(record)}
        >
          Sotuv tarixi
        </Button>
      )
    }
  ];

  if (isError) return <div className="clients-error-message">Mijozlar ma'lumotini olishda xatolik yuz berdi!</div>;

  return (
    <div className="clients-page">
      <Card className="clients-card">
        <div className="clients-header">
          <Typography.Title level={3} style={{ margin: 0 }}>
            Mijozlar va Qarzdorlar
          </Typography.Title>
          <Input
            placeholder="Ism yoki telefon bo'yicha qidirish..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 280 }}
          />
        </div>

        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card bordered={false} style={{ background: '#f0f5ff', borderRadius: 8 }}>
              <Statistic
                title="Barcha mijozlar bo'yicha Umumiy Savdo"
                value={overallTotalSpent}
                precision={0}
                valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                suffix="so'm"
                prefix={<ShoppingCartOutlined />}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false} style={{ background: '#fff2f0', borderRadius: 8 }}>
              <Statistic
                title="Barcha mijozlar bo'yicha Jami Qarz"
                value={overallTotalDebt}
                precision={0}
                valueStyle={{ color: '#ff4d4f', fontWeight: 'bold' }}
                suffix="so'm"
                prefix={<WarningOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Table
          dataSource={filteredCustomers}
          columns={columns}
          rowKey="phone"
          loading={isLoading}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <UserOutlined />
            <span><b>{selectedCustomer?.customerName}</b> — Barcha xaridlar va sotuv tarixi</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={900}
        destroyOnHidden
      >
        <Row gutter={16} style={{ marginBottom: 16, marginTop: 16 }}>
          <Col span={8}>
            <Card size="small" style={{ background: '#fafafa' }}>
              <Statistic
                title="Xaridlar soni"
                value={selectedCustomer?.history?.length || 0}
                suffix="ta"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ background: '#e6f7ff' }}>
              <Statistic
                title="Umumiy xaridi"
                value={selectedCustomer?.totalSpent}
                suffix="so'm"
                valueStyle={{ color: '#1890ff', fontSize: 16 }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ background: '#fff1f0' }}>
              <Statistic
                title="Umumiy qarzi"
                value={selectedCustomer?.totalDebt}
                suffix="so'm"
                valueStyle={{ color: '#ff4d4f', fontSize: 16 }}
              />
            </Card>
          </Col>
        </Row>

        <Table
          dataSource={selectedCustomer?.history || []}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          columns={[
            {
              title: 'Sana',
              dataIndex: 'createdAt',
              key: 'createdAt',
              render: val => new Date(val).toLocaleString('uz-UZ')
            },
            { title: 'Mahsulot', dataIndex: 'productName', key: 'productName' },
            { title: 'Soni', dataIndex: 'quantity', key: 'quantity', align: 'center' },
            { title: 'Jami Summa', dataIndex: 'totalPrice', key: 'totalPrice', render: val => `${val?.toLocaleString()} so'm` },
            { title: 'To\'langan', dataIndex: 'paidAmount', key: 'paidAmount', render: val => `${val?.toLocaleString()} so'm` },
            {
              title: 'Qarz',
              dataIndex: 'debt',
              key: 'debt',
              render: val => <Tag color={val > 0 ? 'red' : 'green'}>{val?.toLocaleString()} so'm</Tag>
            },
            {
              title: 'Amal',
              key: 'action',
              align: 'center',
              render: (_, record) => record.debt > 0 ? (
                <Button
                  type="primary"
                  size="small"
                  danger
                  icon={<DollarOutlined />}
                  onClick={() => handleOpenPayModal(record)}
                >
                  To'lash
                </Button>
              ) : <Tag color="green">To'langan</Tag>
            }
          ]}
        />
      </Modal>

      <Modal
        title="Qarzni to'lash"
        open={payModalOpen}
        onCancel={() => setPayModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form form={payForm} layout="vertical" onFinish={handlePaySubmit}>
          <p style={{ fontSize: 15 }}><b>Mahsulot:</b> {activeSale?.productName}</p>
          <p style={{ fontSize: 15 }}>
            <b>Mavjud qarz:</b> <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{activeSale?.debt?.toLocaleString()} so'm</span>
          </p>

          <Form.Item
            name="amountPaid"
            label="To'lanayotgan summa (so'm)"
            rules={[
              { required: true, message: 'Iltimos, summani kiriting!' },
              {
                validator: (_, value) => {
                  if (value > activeSale?.debt) {
                    return Promise.reject(new Error('Kiritilgan summa qarzdan ko\'p bo\'lmasligi kerak!'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="Summani kiriting" min={1} />
          </Form.Item>

          <Segmented
            block
            size="normal"
            options={[
              { label: 'Naqx', value: 'naqx' },
              { label: 'Click', value: 'click' },
              { label: 'PayMe', value: 'payme' }
            ]}
          />

          <Button type="primary" htmlType="submit" block loading={isPaying}>
            To'lovni qabul qilish
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Clients;