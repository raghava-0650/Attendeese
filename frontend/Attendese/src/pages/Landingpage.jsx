import React from 'react';

import { Link } from 'react-router-dom';

import Logo from '../assets/Logo.png';

const Landingpage = () => {
  return (
    <div>
      <header className="fixed w-full">
        <nav className="bg-white border-gray-200 py-3 dark:bg-gray-900">
          <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
            <Link to={'/landingpage'}>
                <div className="flex items-center">
                <img
                    src={Logo}
                    className='h-10 w-full mr-0 sm:h-12'
                    alt="attendese Logo"
                />
                <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                    Attendeese
                </span>
                </div>
            </Link>
            <div className="flex items-center lg:order-2">
              <Link to="/timetable">
                <button className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800">
                  Login
                </button>
              </Link>
            </div>
            <div className="items-center justify-between hidden w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
              <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                <li>
                  <div
                    className="block py-2 pl-3 pr-4 text-white bg-purple-700 rounded lg:bg-transparent lg:text-purple-700 lg:p-0 dark:text-white"
                    aria-current="page"
                  >
                    Home
                  </div>
                </li>
                <li>
                  <div
                    className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Features
                  </div>
                </li>
                <li>
                  <div
                    className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Team
                  </div>
                </li>
                <li>
                  <div
                    className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Contact
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <section className="bg-white-300 h-screen">
        <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-2 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-10xl dark:text-black">
              Tracking Attendence <br />Made Easy
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              this is a free open source attendence tracking application that will track and manage your attendence and it will also keep your attendence above 75% so you can get your certificate easily.
            </p>
            <div className="flex justify-center flex-wrap gap-4">
                <Link to="/subjects">
                    <button className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800">
                     Signup
                    </button>
                </Link>
            </div>
          </div>

          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img
              src="https://hrsoftware.in/wp-content/uploads/2023/04/Choosing-The-Right-Attendance-Management-System.jpg"
              alt="hero image"
              className="w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landingpage;
