"use client";

import Link from "next/link";

const Header = () => (
  <header className="bg-blue-100 p-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-3xl font-bold text-blue 800"> TrainSmart</h1>
      <nav>
        <ul className="flex slace-x-4">
          <li>
            <NavButton href="./exercises/create">Create Exercise</NavButton>
          </li>
          <li>
            <NavButton href="/exercises/edit">Edit Exercise</NavButton>
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
    <button className="submit-buton bg-blue-500 hover: bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
      {children}
    </button>
  </Link>
);
export default Header;
