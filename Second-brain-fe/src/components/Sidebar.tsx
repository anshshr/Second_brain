const Sidebar = () => {
  const categories = ['All', 'Links', 'Tweets', 'Videos', 'Documents', 'Tags'];

  return (
    <aside className="w-64 bg-gray-100 p-4 h-full">
      <h2 className="font-semibold text-gray-700 mb-4">Categories</h2>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat}>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-200">
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;