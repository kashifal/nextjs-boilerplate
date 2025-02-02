import React from 'react'
import '@/app/globals.css'

const DashNavBar = () => {
  return (
    <>
          <nav className="bg-white">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex flex-1 items-center gap-x-4">
          <button type="button" className="lg:hidden">
            <span className="sr-only">Open menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
  
          <form className="relative flex-1 max-w-lg" action="#" method="GET">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </div>
            <input type="search" name="search" 
                   className="block w-full bg-gray-100 rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900   placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                   placeholder="Search" />
          </form>
        </div>
  
         
      </div>
    </div>
  
    <div className="lg:hidden hidden" id="mobile-menu">
      <div className="space-y-1 px-2 pb-3 pt-2">
        <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Dashboard</a>
        <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Team</a>
        <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Projects</a>
      </div>
    </div>
  </nav>
  

    </>
  )
}

export default DashNavBar