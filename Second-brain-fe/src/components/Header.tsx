const Header = () => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold text-gray-800">🧠 Second Brain</span>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Share Brain
      </button>
    </header>
  );
};

export default Header;