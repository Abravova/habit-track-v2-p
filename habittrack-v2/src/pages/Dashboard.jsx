import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      const response = await fetch('http://localhost:5000/api/habits', {
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
      const response = await fetch('http://localhost:5000/api/habits', {
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
      const response = await fetch(`http://localhost:5000/api/habits/${habitId}`, {
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

  const handleCompleteHabit = async (habitId) => {
    const token = localStorage.getItem('token');
  
    try {
      const response = await fetch(`http://localhost:5000/api/habits/${habitId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
      setMessage('Error completing habit');
    }
  };
  
  // Helper function to check if habit is completed today
  const isCompletedToday = (habit) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    return habit.completedDates.some(date => {
      const completedDate = new Date(date);
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
              
              return (
                <li key={habit._id} style={{ 
                  padding: '15px', 
                  border: '1px solid #ddd', 
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: completedToday ? '#d4edda' : 'white'
                }}>
                  <span style={{ fontSize: '18px' }}>
                    {completedToday && '✓ '}
                    {habit.title}
                  </span>
                  <div>
                    {!completedToday && (
                      <button 
                        onClick={() => handleCompleteHabit(habit._id)}
                        style={{ padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px' }}
                      >
                        Complete Today
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteHabit(habit._id)}
                      style={{ padding: '6px 12px', background: '#ff4444', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
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