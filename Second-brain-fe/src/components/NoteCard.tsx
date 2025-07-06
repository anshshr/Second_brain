export interface ContentType {
    title : string,
    url :string,
    tags : string[]
}


const NoteCard = ({ title  , url, tags } : ContentType) => {
  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow border border-gray-200">
      <a href={url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600">
        {title}
      </a>
      <div className="mt-2">
        {tags.map((tag) => (
          <span key={tag} className="inline-block mr-2 text-xs bg-gray-200 px-2 py-1 rounded">
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-3 flex justify-between">
        <button className="text-sm text-red-500">Delete</button>
        <button className="text-sm text-blue-500">Share</button>
      </div>
    </div>
  );
};

export default NoteCard;