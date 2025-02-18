import React, { useState } from 'react';
import SideBar from './SideBar';
import DashNavBar from './DashNavBar';
import '@/app/globals.css';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="md:block hidden">
        <SideBar />
      </div>

      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isSidebarOpen ? '0%' : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 w-[280px] h-full bg-white shadow-lg md:hidden z-50"
      >
        <SideBar />
      </motion.div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      <div className="md:pl-[280px] pl-0">
        <DashNavBar toggleSidebar={toggleSidebar} />
        {children}
      </div>
    </>
  );
};

export default MainLayout;
