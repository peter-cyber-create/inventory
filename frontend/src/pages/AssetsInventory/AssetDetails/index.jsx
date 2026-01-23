/**
 * Ministry of Health Uganda - ICT Asset Details Page
 * Official asset register format - Professional, institutional design
 */
import React, { useState, useEffect } from "react";
import { Tabs, Card } from 'antd';
import { 
    InfoCircleOutlined, 
    UserOutlined, 
    SwapOutlined, 
    ToolOutlined, 
    DeleteOutlined, 
    HistoryOutlined 
} from '@ant-design/icons';
import API from "../../../helpers/api";
import PageLayout from "../../../components/Layout/PageLayout";
import AssetInfo from "./AssetInfo";
import AssignedUser from "./AssignedUser";
import Transfer from "./TransferHistory";
import Maintenance from "./Maintenance";
import Disposal from "./Disposal";
import AuditHistory from "./AuditHistory";
import '../../../theme/moh-institutional-theme.css';

const AssetDetails = ({ match }) => {
    const [asset, setAsset] = useState({})
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('asset-info')

    const { id } = match.params;

    const getAsset = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/api/assets/${id}`);
            setLoading(false);
            setAsset(res.data.asset);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAsset();
    }, []);

    const tabItems = [
        {
            key: 'asset-info',
            label: (
                <span>
                    <InfoCircleOutlined style={{ marginRight: '8px' }} />
                    Asset Information
                </span>
            ),
            children: <AssetInfo asset={asset} />
        },
        {
            key: 'user',
            label: (
                <span>
                    <UserOutlined style={{ marginRight: '8px' }} />
                    Assigned User
                </span>
            ),
            children: <AssignedUser id={id} />
        },
        {
            key: 'movement',
            label: (
                <span>
                    <SwapOutlined style={{ marginRight: '8px' }} />
                    Transfer History
                </span>
            ),
            children: <Transfer id={id} />
        },
        {
            key: 'maintenance',
            label: (
                <span>
                    <ToolOutlined style={{ marginRight: '8px' }} />
                    Preventive Maintenance
                </span>
            ),
            children: <Maintenance id={id} />
        },
        {
            key: 'disposal',
            label: (
                <span>
                    <DeleteOutlined style={{ marginRight: '8px' }} />
                    Asset Disposal
                </span>
            ),
            children: <Disposal id={id} />
        },
        {
            key: 'history',
            label: (
                <span>
                    <HistoryOutlined style={{ marginRight: '8px' }} />
                    Audit History
                </span>
            ),
            children: <AuditHistory id={id} />
        }
    ];

    return (
        <PageLayout
            title={`ICT Asset Details`}
            subtitle={`Serial: ${asset.serialNo || 'N/A'} | Engraved: ${asset.engravedNo || 'N/A'}`}
            loading={loading}
        >
            <Card 
                className="institutional-card"
                style={{ 
                    border: '1px solid #E1E5E9',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0, 103, 71, 0.08)'
                }}
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    style={{
                        fontFamily: 'var(--font-family)'
                    }}
                    tabBarStyle={{
                        borderBottom: '2px solid #E2E8F0',
                        marginBottom: '24px'
                    }}
                />
            </Card>
        </PageLayout>
    )
}

export default AssetDetails