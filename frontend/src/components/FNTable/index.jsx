
import React from "react";
import { Table, Checkbox, Button, Spin, Empty } from "antd";

const FNTable = ({
  columns = [],
  data = [],
  actions,
  title,
  selectable,
  onSelectRow,
  selectedRows,
  loading,
  emptyText,
}) => {
  // Defensively normalize: ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];
  const safeColumns = Array.isArray(columns) ? columns : [];

  // Convert columns to Ant Design format
  const antdColumns = [
    ...(selectable
      ? [
          {
            title: "",
            dataIndex: "select",
            key: "select",
            width: 48,
            render: (_, row) => (
              <Checkbox
                checked={selectedRows && selectedRows.includes(row)}
                onChange={() => onSelectRow && onSelectRow(row)}
                aria-label="Select row"
              />
            ),
          },
        ]
      : []),
    ...safeColumns.map((col) => ({
      title: col.label,
      dataIndex: col.key,
      key: col.key,
      render: col.render
        ? (value, row) => col.render(value, row)
        : (value, row) => {
            // Support nested keys
            if (col.key.includes(".")) {
              const keys = col.key.split(".");
              return keys.reduce((acc, key) => acc && acc[key], row);
            }
            return value;
          },
    })),
    ...(actions
      ? [
          {
            title: "Actions",
            key: "actions",
            render: (row) => (
              <div style={{ display: "flex", gap: 8 }}>
                {actions.map((action, idx) => (
                  <Button
                    key={idx}
                    size="small"
                    style={{ background: "var(--moh-accent)", color: "#fff", borderRadius: 6, fontWeight: 500 }}
                    icon={action.icon}
                    onClick={() => action.onClick(row)}
                    aria-label={action.label}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif" }}>
      {title && <h3 style={{ marginBottom: 16 }}>{title}</h3>}
      <Table
        columns={antdColumns}
        dataSource={safeData}
        rowKey={(row, idx) => row?.id || idx}
        loading={loading ? { indicator: <Spin /> } : false}
        locale={{
          emptyText: emptyText || <Empty description="No data available" />,
        }}
        pagination={{ pageSize: 10 }}
        style={{ background: "var(--moh-header-bg)", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      />
    </div>
  );
};

export default FNTable;
