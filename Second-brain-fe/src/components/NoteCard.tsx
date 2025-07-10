export interface ContentType {
    title: string;
    url: string;
    tags: string[];
    type?: string;
    _id?: string;
}

const getTypeIcon = (url: string, type?: string) => {
  if (type) {
    switch (type) {
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'article': return '📄';
      default: return '🔗';
    }
  }
  
  // Fallback based on URL
  if (url.includes('youtube.com') || url.includes('youtu.be')) return '🎥';
  if (url.includes('spotify.com') || url.includes('soundcloud.com')) return '🎵';
  if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return '🖼️';
  return '🔗';
};

const NoteCard = ({ title, url, tags, type, _id }: ContentType) => {
  const handleDelete = async () => {
    if (!_id) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/delete-content/${_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Reload the page to refresh content
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const handleShare = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/share-link', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Copy share link to clipboard
        navigator.clipboard.writeText(`${window.location.origin}/brain/${data.link.username}`);
        alert('Share link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{getTypeIcon(url, type)}</span>
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
        </div>
      </div>
      
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-3 block truncate"
      >
        {url}
      </a>
      
      <div className="mb-4">
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="inline-block mr-2 mb-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <button 
          onClick={handleDelete}
          className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          🗑️ Delete
        </button>
        <button 
          onClick={handleShare}
          className="text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors"
        >
          📤 Share
        </button>
      </div>
    </div>
  );
};

export default NoteCard;