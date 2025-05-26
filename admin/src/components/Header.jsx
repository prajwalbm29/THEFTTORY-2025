import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { isAdmin } = useContext(AuthContext)

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
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Header;