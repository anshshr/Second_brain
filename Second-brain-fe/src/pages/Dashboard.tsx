import { useState, useEffect } from 'react';
import ContentGrid from '../components/ContentGrid';
import AddContentModal from '../components/AddContentModal';
import { useAuth } from '../contexts/AuthContext';
import type { ContentType } from '../components/NoteCard';

interface ApiContent {
  _id: string;
  title: string;
  link: string;
  type: string;
  tags: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [content, setContent] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const { logout } = useAuth();

  const categories = [
    { id: 'all', name: 'All Content', icon: '📚' },
    { id: 'image', name: 'Images', icon: '🖼️' },
    { id: 'audio', name: 'Audio', icon: '🎵' },
    { id: 'video', name: 'Videos', icon: '🎥' },
    { id: 'article', name: 'Articles', icon: '📄' }
  ];

  const fetchContent = async (type?: string) => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please sign in to view content');
        return;
      }

      const url = type && type !== 'all' 
        ? `http://localhost:3000/get-content-by-type/${type}`
        : 'http://localhost:3000/get-content';

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }

      const data = await response.json();
      
      // Transform API data to match ContentType interface
      const transformedContent: ContentType[] = data.content.map((item: ApiContent) => ({
        _id: item._id,
        title: item.title,
        url: item.link,
        tags: item.tags,
        type: item.type
      }));
      
      setContent(transformedContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Second Brain</h1>
          
          <nav className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl mr-3">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </nav>
          
          {/* AI Query Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <a
              href="/query"
              className="w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors duration-200 text-purple-600 hover:bg-purple-50 border border-purple-200"
            >
              <span className="text-xl mr-3">🤖</span>
              <span className="font-medium">AI Assistant</span>
            </a>
          </div>
          
          {/* Logout Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors duration-200 text-red-600 hover:bg-red-50"
            >
              <span className="text-xl mr-3">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {categories.find(cat => cat.id === selectedCategory)?.name || 'Content'}
              </h2>
              <p className="text-gray-600">
                {content.length} item{content.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add Content
            </button>
          </div>

          {/* Content Area */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 font-medium">{error}</p>
              <button 
                onClick={() => fetchContent(selectedCategory)}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : content.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No content found</h3>
              <p className="text-gray-600">
                {selectedCategory === 'all' 
                  ? 'Start by adding some content to your brain!'
                  : `No ${categories.find(cat => cat.id === selectedCategory)?.name.toLowerCase()} found.`
                }
              </p>
            </div>
          ) : (
            <ContentGrid items={content} />
          )}
        </div>
      </main>

      {/* Add Content Modal */}
      <AddContentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onContentAdded={() => fetchContent(selectedCategory)}
      />
    </div>
  );
};

export default Dashboard;