import NoteCard, { type ContentType } from './NoteCard';
interface Data {
    items : ContentType[]
}

const ContentGrid = ({ items  } : Data) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {items.map((item, index) => (
        <NoteCard key={index} {...item} />
      ))}
    </div>
  );
};

export default ContentGrid;