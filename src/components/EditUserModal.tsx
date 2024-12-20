import React, { useState } from 'react';
import { updateUser } from '../services/api.ts';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa'; // Importing icons for loader and success check

interface EditUserModalProps {
  user: any;
  onClose: () => void;
  onUpdateUser: React.Dispatch<React.SetStateAction<any[]>>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onUpdateUser }) => {
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // State to manage loading
  const [success, setSuccess] = useState(false);   // State to manage success message

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);  // Reset success message before update

    try {
      await updateUser(user.id, { first_name: firstName, last_name: lastName, email });
      onUpdateUser((prevUsers) => 
        prevUsers.map(u => u.id === user.id ? { ...u, first_name: firstName, last_name: lastName, email } : u)
      );
      setLoading(false);
      setSuccess(true);  // Show success message on successful update
      setTimeout(() => {
        onClose();  // Close modal after a short delay to show success
      }, 1500); // Delay to allow user to see success
    } catch (err) {
      setLoading(false);
      setError('Failed to update user');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h3 className="text-xl mb-4">Edit User</h3>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Success message */}
        {success && (
          <div className="text-green-500 mb-4 flex items-center">
            <FaCheckCircle className="mr-2" />
            User successfully updated!
          </div>
        )}

        {/* Form fields */}
        {!success && (
          <>
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-black">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border rounded text-black"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-black">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border rounded text-black"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-black">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded text-black"
              />
            </div>
          </>
        )}

        {/* Loader or Update Button */}
        <div className="flex justify-end">
          {loading ? (
            <div className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md mx-2">
              <FaSpinner className="animate-spin mr-2" />
              Updating...
            </div>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-500 text-white rounded-md mx-2"
              >
                Update
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-md mx-2"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
