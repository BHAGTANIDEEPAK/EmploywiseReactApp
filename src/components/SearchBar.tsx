import React from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="mb-4 flex justify-center">
      <input
        type="text"
        placeholder="Search users"
        onChange={handleSearch}
        className="px-4 py-2 border rounded-md w-64"
      />
    </div>
  );
};

export default SearchBar;
