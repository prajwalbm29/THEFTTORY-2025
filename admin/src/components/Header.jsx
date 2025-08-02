import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Header = () => {
  const { isAdmin, logout } = useContext(AuthContext)
  const navigate = useNavigate();

  const handleLogout = () => {
    const logoutResult = logout();
    if (logoutResult) {
      navigate('/');
    } else {
      toast.error('Failed to Logout')
    }
  }

  return (
    <div className="bg-white text-gray-800 px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold tracking-wide">
          Thefttory
        </Link>

        <nav className="flex space-x-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          {!isAdmin && (<Link to="/login" className="hover:text-blue-600 transition-colors">Login</Link>)}
          {isAdmin && (
            <>
              <Link to="/admin/complaints" className="hover:text-blue-600 transition-colors">Complaints</Link>
              <Link to="/admin/polices" className="hover:text-blue-600 transition-colors">Polices</Link>
              <Link to="/admin/assignment" className="hover:text-blue-600 transition-colors">Allocation</Link>
              <Link to="/admin/general-safety" className="hover:text-blue-600 transition-colors">Safety Tips</Link>
              <Link to="/admin/resolved-complaints" className="hover:text-blue-600 transition-colors">Resolved</Link>
              <button className='bg-red-500 p-2 rounded-2xl text-white hover:bg-red-600 cursor-pointer align-middle justify-center' onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Header;