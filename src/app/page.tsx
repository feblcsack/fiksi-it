export default function Home() {
  return (
    <>
      <div className="container flex flex-col items-center justify-center w-full">
        <h1>Welcome to My Website</h1>
        <p>This is a simple Next.js app.</p>
        <button className="w-20 rounded-3xl bg-red-700 text-white hover:bg-white-800 hover:text-green-400">
          Click Me
        </button>
        <button className="w-20 rounded-3xl bg-red-700 text-white hover:bg-white-800 hover:text-green-400">
          Click Me
        </button>
      </div>
      
    </>
  );
}
