import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUser } from '../services/api.ts';
import { useNavigate } from 'react-router-dom';
import UserCard from '../components/UserCard.tsx';
import EditUserModal from '../components/EditUserModal.tsx';
import { FaCheckCircle } from 'react-icons/fa'; // For success tick
import { FaSpinner } from 'react-icons/fa'; // For loading spinner

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loader state
  const [successMessage, setSuccessMessage] = useState(''); // Success message state
  const navigate = useNavigate();

  // Fetch users when the page changes or search query is updated
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getUsers(currentPage);
      setUsers(response.data.data);
    };

    fetchUsers();
  }, [currentPage]);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(user =>
          user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, users]);

  const handleDelete = async (id: number) => {
    setIsLoading(true); // Show loader while deleting
    try {
      await deleteUser(id); // Assuming deleteUser sends a request to delete the user
      setUsers(users.filter(user => user.id !== id)); // Remove the deleted user from the list
      setSuccessMessage('User deleted successfully!');
      setTimeout(() => {
        setSuccessMessage(''); // Clear success message after 3 seconds
      }, 3000);
    } catch (error) {
      setSuccessMessage('Failed to delete user');
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleLogout = () => {
    // Clear authentication tokens if stored
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleUpdateUser = async (id: number, firstName: string, lastName: string, email: string) => {
    setIsLoading(true); // Show loader
    try {
      await updateUser(id, { first_name: firstName, last_name: lastName, email });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, first_name: firstName, last_name: lastName, email } : user
        )
      );
      setSuccessMessage('User updated successfully!');
      setTimeout(() => {
        setSuccessMessage(''); // Clear success message after 3 seconds
      }, 3000);
    } catch (error) {
      setSuccessMessage('Failed to update user');
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-400 to-blue-500 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">User List</h2>
        {/* Search Input */}
        <div className="w-1/3">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="px-4 py-2 w-full max-w-lg rounded-md bg-white text-black text-center"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-md flex items-center">
          <FaCheckCircle className="mr-2 text-2xl" />
          <span>{successMessage}</span>
          <button
            className="ml-4 bg-transparent border-0 text-white"
            onClick={() => setSuccessMessage('')}
          >
            OK
          </button>
        </div>
      )}

      {/* User List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center text-lg font-semibold mt-8">No users available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete} // Pass the delete handler to UserCard
              onUpdateUser={handleUpdateUser} // Pass the update handler to UserCard
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handlePrevPage}
          className="px-6 py-3 bg-blue-600 text-white rounded-md mx-3 hover:bg-blue-700 disabled:bg-gray-400"
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {filteredUsers.length > 0 && (
          <button
            onClick={handleNextPage}
            className="px-6 py-3 bg-blue-600 text-white rounded-md mx-3 hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>

      {showEditModal && selectedUser && (
        <EditUserModal user={selectedUser} onClose={() => setShowEditModal(false)} onUpdateUser={setUsers} />
      )}

      {/* Loader */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <FaSpinner className="text-white text-4xl animate-spin" />
        </div>
      )}
    </div>
  );
};

export default UserListPage;
