import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Button, Space, Typography, Modal, Form, Input, Select, DatePicker, InputNumber, message, Tag } from 'antd';
import { 
    DollarOutlined, 
    FileTextOutlined, 
    CheckCircleOutlined,
    PlusOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const FinanceDashboard = () => {

    const [transactions, setTransactions] = useState([
        { id: 1, type: 'Expense', description: 'IT Equipment Purchase', amount: 2500000, category: 'Capital Expenditure', department: 'IT Department', date: '2024-01-10', status: 'Approved', approver: 'John Doe' },
        { id: 2, type: 'Income', description: 'Grant Funding', amount: 15000000, category: 'Grant', department: 'Finance', date: '2024-01-09', status: 'Received', approver: 'System' },
        { id: 3, type: 'Expense', description: 'Maintenance Services', amount: 850000, category: 'Operating Expenses', department: 'Facilities', date: '2024-01-08', status: 'Pending', approver: 'Pending' }
    ]);
    const [budgets] = useState([
        { id: 1, department: 'IT Department', allocated: 89000000, spent: 67000000, remaining: 22000000, fiscalYear: '2024' },
        { id: 2, department: 'Medical Services', allocated: 120000000, spent: 89000000, remaining: 31000000, fiscalYear: '2024' },
        { id: 3, department: 'Administration', allocated: 45000000, spent: 32000000, remaining: 13000000, fiscalYear: '2024' },
        { id: 4, department: 'Fleet Management', allocated: 34000000, spent: 28000000, remaining: 6000000, fiscalYear: '2024' }
    ]);
    const [departments] = useState([
        { id: 1, name: 'IT Department', manager: 'John Doe', contact: '+256 701 111 111' },
        { id: 2, name: 'Medical Services', manager: 'Dr. Jane Smith', contact: '+256 702 222 222' },
        { id: 3, name: 'Administration', manager: 'Mike Johnson', contact: '+256 703 333 333' },
        { id: 4, name: 'Fleet Management', manager: 'Sarah Wilson', contact: '+256 704 444 444' }
    ]);

    // Modal states
    const [newTransactionModal, setNewTransactionModal] = useState(false);
    const [budgetReportsModal, setBudgetReportsModal] = useState(false);
    const [approveExpensesModal, setApproveExpensesModal] = useState(false);
    const [viewTransactionsModal, setViewTransactionsModal] = useState(false);
    const [viewBudgetsModal, setViewBudgetsModal] = useState(false);

    // Form instances
    const [transactionForm] = Form.useForm();
    const [approvalForm] = Form.useForm();

    const handleNewTransaction = () => {
        setNewTransactionModal(true);
    };

    const handleNewTransactionSubmit = (values) => {
        const newTransaction = {
            id: transactions.length + 1,
            type: values.type,
            description: values.description,
            amount: values.amount,
            category: values.category,
            department: values.department,
            date: values.date.format('YYYY-MM-DD'),
            status: 'Pending',
            approver: 'Pending'
        };
        setTransactions([...transactions, newTransaction]);
        message.success('Transaction created successfully!');
        setNewTransactionModal(false);
        transactionForm.resetFields();
    };

    const handleBudgetReports = () => {
        setBudgetReportsModal(true);
    };

    const handleApproveExpenses = () => {
        setApproveExpensesModal(true);
    };

    const handleApprovalSubmit = (values) => {
        const updatedTransactions = transactions.map(transaction => 
            transaction.id === values.transaction ? { ...transaction, status: values.approval, approver: 'Finance Manager' } : transaction
        );
        setTransactions(updatedTransactions);
        message.success('Expense approval processed successfully!');
        setApproveExpensesModal(false);
        approvalForm.resetFields();
    };

    const handleViewTransactions = () => {
        setViewTransactionsModal(true);
    };

    const handleViewBudgets = () => {
        setViewBudgetsModal(true);
    };

    const getTotalBudget = () => {
        return budgets.reduce((total, b) => total + b.allocated, 0);
    };

    const getSpentBudget = () => {
        return budgets.reduce((total, b) => total + b.spent, 0);
    };

    const getRemainingBudget = () => {
        return budgets.reduce((total, b) => total + b.remaining, 0);
    };

    const getPendingApprovalsCount = () => {
        return transactions.filter(t => t.status === 'Pending').length;
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2} style={{ margin: '0 0 20px 0', color: '#0f172a' }}>
                Finance Management
            </Title>

            {/* Simple Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col xs={12} sm={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Total Budget"
                            value={`UGX ${(getTotalBudget() / 1000000).toFixed(1)}M`}
                            prefix={<DollarOutlined style={{ color: '#0f172a' }} />}
                            valueStyle={{ color: '#0f172a', fontSize: '20px' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Spent Budget"
                            value={`UGX ${(getSpentBudget() / 1000000).toFixed(1)}M`}
                            prefix={<DollarOutlined style={{ color: '#0f172a' }} />}
                            valueStyle={{ color: '#0f172a', fontSize: '20px' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Remaining Budget"
                            value={`UGX ${(getRemainingBudget() / 1000000).toFixed(1)}M`}
                            prefix={<DollarOutlined style={{ color: '#0f172a' }} />}
                            valueStyle={{ color: '#0f172a', fontSize: '20px' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
                        <Statistic
                            title="Pending Approvals"
                            value={getPendingApprovalsCount()}
                            prefix={<FileTextOutlined style={{ color: '#0f172a' }} />}
                            valueStyle={{ color: '#0f172a', fontSize: '20px' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Simple Actions */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col xs={24} sm={12}>
                    <Card title="Quick Actions" style={{ borderRadius: '8px' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />} 
                                block
                                onClick={handleNewTransaction}
                            >
                                New Transaction
                            </Button>
                            <Button 
                                icon={<FileTextOutlined />} 
                                block
                                onClick={handleBudgetReports}
                            >
                                Budget Reports
                            </Button>
                            <Button 
                                icon={<CheckCircleOutlined />} 
                                block
                                onClick={handleApproveExpenses}
                            >
                                Approve Expenses
                            </Button>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={12}>
                    <Card title="View Data" style={{ borderRadius: '8px' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button 
                                icon={<DollarOutlined />} 
                                block
                                onClick={handleViewTransactions}
                            >
                                View All Transactions ({transactions.length})
                            </Button>
                            <Button 
                                icon={<FileTextOutlined />} 
                                block
                                onClick={handleViewBudgets}
                            >
                                View All Budgets ({budgets.length})
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* New Transaction Modal */}
            <Modal
                title="New Transaction"
                open={newTransactionModal}
                onCancel={() => setNewTransactionModal(false)}
                footer={null}
                width={600}
            >
                <Form form={transactionForm} onFinish={handleNewTransactionSubmit} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="type" label="Transaction Type" rules={[{ required: true, message: 'Please select transaction type!' }]}>
                                <Select placeholder="Select type">
                                    <Option value="Income">Income</Option>
                                    <Option value="Expense">Expense</Option>
                                    <Option value="Transfer">Transfer</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select category!' }]}>
                                <Select placeholder="Select category">
                                    <Option value="Capital Expenditure">Capital Expenditure</Option>
                                    <Option value="Operating Expenses">Operating Expenses</Option>
                                    <Option value="Grant">Grant</Option>
                                    <Option value="Donation">Donation</Option>
                                    <Option value="Maintenance">Maintenance</Option>
                                    <Option value="Training">Training</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter description!' }]}>
                        <Input placeholder="e.g., IT Equipment Purchase" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="amount" label="Amount (UGX)" rules={[{ required: true, message: 'Please enter amount!' }]}>
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="department" label="Department" rules={[{ required: true, message: 'Please select department!' }]}>
                                <Select placeholder="Select department">
                                    {departments.map(dept => (
                                        <Option key={dept.id} value={dept.name}>{dept.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="date" label="Transaction Date" rules={[{ required: true, message: 'Please select date!' }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Create Transaction
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Budget Reports Modal */}
            <Modal
                title="Budget Reports Generated"
                open={budgetReportsModal}
                onCancel={() => setBudgetReportsModal(false)}
                footer={null}
                width={500}
            >
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <FileTextOutlined style={{ fontSize: '48px', color: '#0f172a', marginBottom: '16px' }} />
                    <Title level={4}>Budget Reports Ready!</Title>
                    <Text type="secondary">
                        Your comprehensive budget reports have been generated successfully.
                    </Text>
                    <div style={{ marginTop: '20px' }}>
                        <Space>
                            <Button type="primary">Download Summary</Button>
                            <Button>Download Detailed</Button>
                        </Space>
                    </div>
                </div>
            </Modal>

            {/* Approve Expenses Modal */}
            <Modal
                title="Approve Expenses"
                open={approveExpensesModal}
                onCancel={() => setApproveExpensesModal(false)}
                footer={null}
                width={600}
            >
                <Form form={approvalForm} onFinish={handleApprovalSubmit} layout="vertical">
                    <Form.Item name="transaction" label="Select Transaction" rules={[{ required: true, message: 'Please select transaction!' }]}>
                        <Select placeholder="Select transaction to approve">
                            {transactions.filter(t => t.status === 'Pending').map(transaction => (
                                <Option key={transaction.id} value={transaction.id}>
                                    {transaction.description} - UGX {transaction.amount.toLocaleString()}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="approval" label="Approval Decision" rules={[{ required: true, message: 'Please select approval decision!' }]}>
                        <Select placeholder="Select decision">
                            <Option value="Approved">Approve</Option>
                            <Option value="Rejected">Reject</Option>
                            <Option value="Under Review">Under Review</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="comments" label="Comments">
                        <TextArea rows={3} placeholder="Add any comments or notes..." />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Process Approval
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* View Transactions Modal */}
            <Modal
                title="Transactions Overview"
                open={viewTransactionsModal}
                onCancel={() => setViewTransactionsModal(false)}
                footer={null}
                width={1000}
            >
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {transactions.map(transaction => (
                        <Card key={transaction.id} style={{ marginBottom: '10px' }}>
                            <Row gutter={16} align="middle">
                                <Col span={6}>
                                    <Text strong>{transaction.description}</Text>
                                </Col>
                                <Col span={3}>
                                    <Tag color={transaction.type === 'Income' ? 'success' : 'orange'}>
                                        {transaction.type}
                                    </Tag>
                                </Col>
                                <Col span={4}>
                                    <Text strong>UGX {transaction.amount.toLocaleString()}</Text>
                                </Col>
                                <Col span={3}>
                                    <Text>{transaction.department}</Text>
                                </Col>
                                <Col span={3}>
                                    <Text type="secondary">{transaction.date}</Text>
                                </Col>
                                <Col span={3}>
                                    <Tag color={
                                        transaction.status === 'Approved' ? 'success' : 
                                        transaction.status === 'Received' ? 'blue' : 
                                        transaction.status === 'Pending' ? 'orange' : 'red'
                                    }>
                                        {transaction.status}
                                    </Tag>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>
            </Modal>

            {/* View Budgets Modal */}
            <Modal
                title="Budget Overview"
                open={viewBudgetsModal}
                onCancel={() => setViewBudgetsModal(false)}
                footer={null}
                width={1000}
            >
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {budgets.map(budget => (
                        <Card key={budget.id} style={{ marginBottom: '10px' }}>
                            <Row gutter={16} align="middle">
                                <Col span={6}>
                                    <Text strong>{budget.department}</Text>
                                </Col>
                                <Col span={4}>
                                    <Text>UGX {(budget.allocated / 1000000).toFixed(1)}M</Text>
                                </Col>
                                <Col span={4}>
                                    <Text type="secondary">UGX {(budget.spent / 1000000).toFixed(1)}M</Text>
                                </Col>
                                <Col span={4}>
                                    <Text type="success" strong>UGX {(budget.remaining / 1000000).toFixed(1)}M</Text>
                                </Col>
                                <Col span={3}>
                                    <Text>{budget.fiscalYear}</Text>
                                </Col>
                                <Col span={3}>
                                    <Text type="secondary">
                                        {Math.round((budget.spent / budget.allocated) * 100)}%
                                    </Text>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default FinanceDashboard;
