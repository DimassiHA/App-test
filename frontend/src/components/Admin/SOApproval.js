import React, { useState, useEffect } from 'react';
import axios from "../../api";
import { Table, Button, Tag, message, Modal, Input, Spin } from 'antd';
import { useNavigate } from "react-router-dom";

const ServiceOwnerApproval = () => {
  const [serviceOwners, setServiceOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOwner, setCurrentOwner] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPendingOwners = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/admin/service-owners/`, {
        params: { status: 'pending' },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminAccessToken')}`
        }
      });
      console.log("Full raw API response:", response.data);
      console.log("Fetched owners:", response.data);
      const formattedData = response.data.map(owner => {
        const serviceOwnerId = owner.id;
        const userId = owner.user?.id;
      
        return {
          key: serviceOwnerId,
          id: serviceOwnerId,  // This is now correctly populated
          user_id: userId,
          username: owner.user?.username || 'N/A',
          email: owner.user?.email || 'N/A',
          business_name: owner.business_name || 'N/A',
          status: 'pending',
          rawData: owner
        };
      });
      
      setServiceOwners(formattedData);
    } catch (error) {
      console.error('Fetch error:', error.response?.data || error.message);
      message.error('Failed to fetch service owners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOwners();

  },[]);

  const handleApprove = async (id) => {
    if (!id) {
      message.error("Missing service owner ID");
      return;
    }
  
    setActionLoading(true);
    try {
      await axios.patch(
        `/admin/service-owners/${id}/approve/`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('adminAccessToken')}` } }
      );
      message.success('Service owner approved successfully');
      fetchPendingOwners();
    } catch (error) {
      console.error('Approve error:', error.response?.data || error.message);
      message.error('Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      message.warning('Please provide a reason for rejection');
      return;
    }

    setActionLoading(true);
    try {
      await axios.patch(
        `/admin/service-owners/${currentOwner.id}/reject/`,
        { reason: rejectReason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminAccessToken')}`
          }
        }
      );
      message.success('Service owner rejected successfully');
      setIsModalVisible(false);
      setRejectReason('');
      fetchPendingOwners();
    } catch (error) {
      console.error('Reject error:', error.response?.data || error.message);
      message.error('Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  const showRejectModal = (owner) => {
    setCurrentOwner(owner);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setRejectReason('');
  };

  const handleBack = () => {
    navigate("/admin/dashboard");
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Business Name',
      dataIndex: 'business_name',
      key: 'business_name'
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const status = record.status || record.rawData?.status || 'pending';
        let tagColor = 'orange';
        let statusText = 'PENDING';

        if (status.toLowerCase() === 'approved') {
          tagColor = 'green';
          statusText = 'APPROVED';
        } else if (status.toLowerCase() === 'rejected') {
          tagColor = 'red';
          statusText = 'REJECTED';
        }

        return <Tag color={tagColor}>{statusText}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        console.log("Record data:", record); // Log the full record object
        const status = record.status || record.rawData?.status || 'pending';
        return (
          <div className="flex gap-2">
            <Button 
              type="primary" 
              onClick={() => {
                console.log("Approve clicked for ID:", record.id); // Log ID
                handleApprove(record.id);
              }}
              disabled={status !== 'pending' || actionLoading}
              loading={actionLoading && currentOwner?.id === record.id}
            >
              Approve
            </Button>
            <Button 
              danger
              onClick={() => {
                console.log("Reject clicked for ID:", record.id); // Log ID
                showRejectModal(record);
              }}
              disabled={status !== 'pending' || actionLoading}
            >
              Reject
            </Button>
          </div>
        );
      },
    }
  ];

  return (
    <div className="p-6">
      <div className="dashboard-header">
        <h1 className="text-2xl font-bold">Service Owner Approvals</h1>
        <div className="dashboard-actions">
          <Button onClick={handleBack} className="back-button">
            Back to Dashboard
          </Button>
        </div>
      </div>
      
      <Spin spinning={loading}>
        <Table 
          columns={columns} 
          dataSource={serviceOwners}
          loading={loading}
          rowKey="id"
          locale={{ emptyText: 'No pending service owners found' }}
        />
      </Spin>

      <Modal
        title={`Reject ${currentOwner?.business_name || 'Application'}`}
        visible={isModalVisible}
        onOk={handleReject}
        onCancel={handleModalCancel}
        confirmLoading={actionLoading}
      >
        <Input.TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Explain why you're rejecting this application..."
        />
      </Modal>
    </div>
  );
};

export default ServiceOwnerApproval;