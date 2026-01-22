import { Link, useLocation } from 'react-router-dom';
import '../styles/Navigation.css';

function Navigation() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/';

  // Don't show navigation on auth page
  if (isAuthPage) {
    return null;
  }

  return (
    <nav className="navigation">
      <Link to="/dashboard" className="navigation-brand">
        HabitTrack
      </Link>
      <div className="navigation-links">
        <Link 
          to="/dashboard" 
          className={`navigation-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/progress" 
          className={`navigation-link ${location.pathname === '/progress' ? 'active' : ''}`}
        >
          Progress
        </Link>
        <Link 
          to="/groups" 
          className={`navigation-link ${location.pathname === '/groups' ? 'active' : ''}`}
        >
          Groups
        </Link>
        <Link 
          to="/profile" 
          className={`navigation-link ${location.pathname === '/profile' ? 'active' : ''}`}
        >
          My Profile
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;
