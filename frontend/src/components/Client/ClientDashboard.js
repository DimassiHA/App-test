import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import './ClientDashboard.css';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [showEventForm, setShowEventForm] = useState(false);
  const [serviceOwners, setServiceOwners] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
    event_type: '',
    budget: '',
    guests: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await API.get('/event-types/');
        setEventTypes(response.data);
      } catch (error) {
        console.error('Error fetching event types:', error);
        setError('Failed to load event types');
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEventTypes();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const eventResponse = await API.post('/events/', {
        ...eventData,
        event_type: parseInt(eventData.event_type),
        budget: parseFloat(eventData.budget),
        guests: parseInt(eventData.guests)
      });

      console.log('Event created:', eventResponse.data);

      const ownersResponse = await API.get('/service-owners/filter/', {
        params: {
          event_type: eventData.event_type,
          min_budget: eventData.budget * 0.9,
          max_budget: eventData.budget * 1.1,
          capacity: eventData.guests
        }
      });

      setServiceOwners(ownersResponse.data);
      setShowEventForm(false);
    } catch (eventError) {
      console.error('Error creating event:', eventError);
      setError('Failed to create event. Please try again.');

      if (eventError.response?.status === 401) {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const refreshResponse = await API.post('/token/refresh/', {
            refresh: refreshToken
          });

          localStorage.setItem('accessToken', refreshResponse.data.access);
          handleCreateEvent(e); // Retry
        } catch (refreshError) {
          console.error('Refresh failed:', refreshError);
          navigate('/login');
        }
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <h1>Welcome to your Dashboard</h1>

      <div className="dashboard-actions">
        <button onClick={() => navigate('/profile')} className="dashboard-button">
          View Profile
        </button>

        <button onClick={() => setShowEventForm(true)} className="dashboard-button primary">
          Create New Event
        </button>
      </div>

      {showEventForm && (
        <div className="event-form-modal">
          <div className="event-form-container">
            <h2>Create New Event</h2>
            <form onSubmit={handleCreateEvent}>
              <div className="form-group">
                <label>Event Name</label>
                <input
                  type="text"
                  name="name"
                  value={eventData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={eventData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Event Type</label>
                <select
                  name="event_type"
                  value={eventData.event_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Event Type</option>
                  {eventTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Budget</label>
                <input
                  type="number"
                  name="budget"
                  value={eventData.budget}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Number of Guests</label>
                <input
                  type="number"
                  name="guests"
                  value={eventData.guests}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-button">
                  Create Event
                </button>
                <button
                  type="button"
                  onClick={() => setShowEventForm(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {serviceOwners.length > 0 && (
        <div className="service-owner-list">
          {serviceOwners.map(owner => (
            <div key={owner.id} className="service-owner-card">
              <h3>{owner.business_name}</h3>
              <img
                src={owner.profile_picture || '/default-profile.jpg'}
                alt={owner.business_name}
                className="owner-avatar"
              />
              <p>{owner.description}</p>
              <div className="owner-details">
                <p><strong>Price Range:</strong> ${owner.min_budget} - ${owner.max_budget}</p>
                {owner.max_capacity && (
                  <p><strong>Max Capacity:</strong> {owner.max_capacity} people</p>
                )}
                <p>
                  <strong>Specializes in:</strong>{' '}
                  {owner.event_types?.map(et => et.name).join(', ') || 'N/A'}
                </p>
              </div>
              <button
                onClick={() => navigate(`/service-owner/${owner.id}`)}
                className="view-profile-button"
              >
                View Full Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
