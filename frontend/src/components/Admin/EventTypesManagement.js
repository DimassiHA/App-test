// EventTypesManagement.js
import React, { useState, useEffect } from 'react';
import API from '../../api';
import { FaEdit, FaTrash } from 'react-icons/fa';

const EventTypesManagement = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [newEventType, setNewEventType] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    setIsLoading(true);
    try {
      const response = await API.get('/admin/event-types/');
      setEventTypes(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch event types');
      console.error('Error details:', err.response);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await API.post('/admin/event-types/', newEventType);
      setEventTypes([...eventTypes, response.data]);
      setNewEventType({ name: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event type');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const eventTypeToUpdate = eventTypes.find(et => et.id === id);
      await API.put(`/admin/event-types/${id}/`, eventTypeToUpdate);
      setEditingId(null);
      fetchEventTypes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event type');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/event-types/${id}/`);
      setEventTypes(eventTypes.filter(et => et.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event type');
    }
  };

  return (
    <div className="event-types-container">
      <h2>Manage Event Types</h2>
      
      <div className="create-form">
        <h3>{editingId ? 'Edit Event Type' : 'Create New Event Type'}</h3>
        <input
          type="text"
          placeholder="Event Type Name"
          value={editingId ? 
            eventTypes.find(et => et.id === editingId)?.name : 
            newEventType.name}
          onChange={(e) => editingId ?
            setEventTypes(eventTypes.map(et => 
              et.id === editingId ? {...et, name: e.target.value} : et
            )) :
            setNewEventType({...newEventType, name: e.target.value})
          }
        />
        <textarea
          placeholder="Description"
          value={editingId ? 
            eventTypes.find(et => et.id === editingId)?.description : 
            newEventType.description}
          onChange={(e) => editingId ?
            setEventTypes(eventTypes.map(et => 
              et.id === editingId ? {...et, description: e.target.value} : et
            )) :
            setNewEventType({...newEventType, description: e.target.value})
          }
        />
        {editingId ? (
          <>
            <button onClick={() => handleUpdate(editingId)}>Update</button>
            <button onClick={() => setEditingId(null)}>Cancel</button>
          </>
        ) : (
          <button onClick={handleCreate}>Create</button>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="event-types-list">
        <h3>Existing Event Types</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {eventTypes.map(eventType => (
                <tr key={eventType.id}>
                  <td>{eventType.name}</td>
                  <td>{eventType.description}</td>
                  <td>
                    <button onClick={() => setEditingId(eventType.id)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(eventType.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EventTypesManagement;