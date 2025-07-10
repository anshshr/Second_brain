import NoteCard, { type ContentType } from './NoteCard';
interface Data {
    items: ContentType[]
}

const ContentGrid = ({ items }: Data) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {items.map((item) => (
        <NoteCard key={item._id || Math.random()} {...item} />
      ))}
    </div>
  );
};

export default ContentGrid;