import React from 'react';

const Landingpage = () => {
  return (
    <div>
        <header>

        </header>

        <section className='bg-white-300 h-screen'>
            <div className='grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28'>
                <div className='mr-auto place-self-center lg:col-span-7'>
                    <h1 className='max-w-2xl mb-2 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-10xl dark:text-black'>
                        Tracking Attendence <br></br>Made Easy
                    </h1>
                    <p className='max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400'>
                        this is a free open source attendence tracking application the will track and manage your attendenceand it will also keep your attendence above 75% so you can get your certificate easily.
                    </p>
                    <div className='flex justify-center flex-wrap gap-4'>
                        <a className='inline-flex items-center justify-center w-full px-0 py-0 mb-2 mr-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:w-auto focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'>
                            <button type="submit" className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">Signup</button>
                        </a>
                    </div>
                    
                </div>
                

                <div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
			        <img src="https://hrsoftware.in/wp-content/uploads/2023/04/Choosing-The-Right-Attendance-Management-System.jpg" alt="hero image"></img>
                </div>

            </div>
        </section>     
    </div>
  )
}

export default Landingpage