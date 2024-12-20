import React from 'react';

interface UserCardProps {
  user: any;
  onEdit: (user: any) => void;
  onDelete: (id: number) => void;
  onUpdateUser: (id: number, firstName: string, lastName: string, email: string) => Promise<void>; // Add onUpdateUser
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <img src={user.avatar} alt={user.first_name} className="w-24 h-24 rounded-full mx-auto mb-4" />
      <h3 className="text-black text-xl font-semibold text-center">{user.first_name} {user.last_name}</h3>
      <p className="text-center text-gray-600">{user.email}</p>
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => onEdit(user)}
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mx-2 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 mx-2 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
