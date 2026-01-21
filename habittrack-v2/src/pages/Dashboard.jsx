import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';


function Dashboard() {
  const [username, setUsername] = useState('');
  const [habits, setHabits] = useState([]);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    // Decode token to get username 
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUsername(payload.username || 'User');
    } catch (error) {
      console.error('Invalid token');
      navigate('/');
    }

    fetchHabits();
  }, [navigate]);

  const fetchHabits = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/habits`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setHabits(data);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/api/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: newHabitTitle })
      });

      if (response.ok) {
        setNewHabitTitle('');
        setMessage('Habit created!');
        fetchHabits();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error creating habit');
    }
  };

  const handleDeleteHabit = async (habitId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/api/habits/${habitId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage('Habit deleted!');
        fetchHabits();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error deleting habit');
    }
  };

  const handleCompleteHabit = async (habitId, imageFile) => {
    const token = localStorage.getItem('token');
  
    try {
      let imageUrl = null;
  
      // If there's an image, upload it first
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
  
        const uploadResponse = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
  
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.imageUrl;
        } else {
          setMessage('Image upload failed');
          return;
        }
      }
  
      // Then mark habit as complete with the image URL
      const response = await fetch(`${API_URL}/api/habits/${habitId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imageUrl })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage('Habit completed for today!');
        fetchHabits();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error completing habit');
    }
  };
  
  // Helper function to check if habit is completed today
  const isCompletedToday = (habit) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    return habit.completions?.some(completion => {
      const completedDate = new Date(completion.date);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px' }}>
          Logout
        </button>
      </div>
      
      <p>Welcome back, <strong>{username}</strong>!</p>

      {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}

      <div style={{ marginTop: '30px' }}>
        <h2>Create New Habit</h2>
        <form onSubmit={handleCreateHabit} style={{ marginTop: '10px' }}>
          <input
            type="text"
            placeholder="Habit title (e.g., Drink water)"
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            style={{ padding: '8px', width: '300px' }}
          />
          <button type="submit" style={{ padding: '8px 16px', marginLeft: '10px' }}>
            Add Habit
          </button>
        </form>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>Your Habits</h2>
        {habits.length === 0 ? (
          <p>No habits yet. Create one above!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
          {habits.map((habit) => {
            const completedToday = isCompletedToday(habit);
            const todayCompletion = habit.completions?.find(completion => {
              const completedDate = new Date(completion.date);
              completedDate.setHours(0, 0, 0, 0);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return completedDate.getTime() === today.getTime();
            });
            
            return (
              <li key={habit._id} style={{ 
                padding: '15px', 
                border: '1px solid #ddd', 
                marginBottom: '10px',
                background: completedToday ? '#d4edda' : 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px' }}>
                    {completedToday && '✓ '}
                    {habit.title}
                  </span>
                  <div>
                    {!completedToday && (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          id={`file-${habit._id}`}
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              handleCompleteHabit(habit._id, e.target.files[0]);
                            }
                          }}
                        />
                        <label
                          htmlFor={`file-${habit._id}`}
                          style={{ 
                            padding: '6px 12px', 
                            background: '#007bff', 
                            color: 'white', 
                            border: 'none', 
                            cursor: 'pointer',
                            marginRight: '10px',
                            display: 'inline-block'
                          }}
                        >
                          Complete with Photo
                        </label>
                        <button 
                          onClick={() => handleCompleteHabit(habit._id, null)}
                          style={{ padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px' }}
                        >
                          Complete (No Photo)
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleDeleteHabit(habit._id)}
                      style={{ padding: '6px 12px', background: '#ff4444', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {/* Show image if completed today with photo */}
                {completedToday && todayCompletion?.imageUrl && (
                  <div style={{ marginTop: '10px' }}>
                    <img 
                      src={todayCompletion.imageUrl} 
                      alt="Completion proof" 
                      style={{ maxWidth: '300px', borderRadius: '8px' }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;