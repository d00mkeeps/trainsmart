"use client";

import Link from "next/link";

const Header = () => (
  <header className="bg-blue-100 p-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-3xl font-bold text-blue-800">TrainSmart</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <NavButton href="/CreateExercise">Create Exercise</NavButton>
          </li>
          <li>
            <NavButton href="/exercises">Exercises</NavButton>
          </li>
          <li>
            <NavButton href="/workouts">Workouts</NavButton>
          </li>
          <li>
            <NavButton href="/profile">Profile</NavButton>
          </li>
        </ul>
      </nav>
    </div>
  </header>
);

const NavButton = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => (
  <Link href={href}>
    <button className="submit-button bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
      {children}
    </button>
  </Link>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Welcome to TrainSmart</h2>
          <p className="mb-8">
            Your personal fitness companion. Start your journey to a healthier
            you today!
          </p>
        </section>
      </main>
    </div>
  );
};

export default Home;
