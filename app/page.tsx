"use client";

import Header from "./components/Header";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Welcome to TrainSmart</h2>
          <p className="mb-8">
            Current features: exercise management, program creation/editing,
            user profile management
          </p>
        </section>
      </main>
    </div>
  );
};

export default Home;
