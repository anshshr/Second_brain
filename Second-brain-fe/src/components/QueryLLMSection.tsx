const QueryLLMSection = () => {
  return (
    <div className="mt-8 bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Ask Your Second Brain</h3>
      <textarea
        placeholder="Type your query..."
        className="w-full p-3 border border-gray-300 rounded mb-4"
      ></textarea>
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Ask LLM
      </button>
    </div>
  );
};

export default QueryLLMSection;