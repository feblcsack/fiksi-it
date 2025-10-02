export default function Home() {
  return (
    <>
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
          Your Universe of Music Awaits
        </h1>
        <p className="max-w-2xl text-lg text-gray-600">
          Discover new artists, create personalized playlists, and stream
          millions of songs, ad-free.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="rounded-full bg-purple-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-purple-700">
            Start Listening
          </button>
          <button className="rounded-full bg-gray-100 px-8 py-3 font-semibold text-gray-800 shadow-lg transition hover:bg-gray-200">
            Explore Genres
          </button>
        </div>
      </div>
    </>
  );
}
