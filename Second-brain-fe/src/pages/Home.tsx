import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ContentGrid from '../components/ContentGrid';
import QueryLLMSection from '../components/QueryLLMSection';

// Sample data
const sampleItems  = [
  { title: "React Docs", url: "https://react.dev ", tags: ["react", "docs"] },
  { title: "Tailwind CSS Guide", url: "https://tailwindcss.com ", tags: ["ui", "tailwind"] },
  { title: "Tailwind CSS Guide", url: "https://tailwindcss.com ", tags: ["ui", "tailwind"] },
  { title: "Tailwind CSS Guide", url: "https://tailwindcss.com ", tags: ["ui", "tailwind"] },
];

const Home = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="p-6 overflow-auto">
          <ContentGrid items={sampleItems} />
          <QueryLLMSection />
        </main>
      </div>
    </div>
  );
};

export default Home;