import React from 'react'
import NextImage from 'next/image'
const Footer = () => {
  return (
    <>
    <footer className="">
  <div className="mx-auto max-w-7xl overflow-hidden px-4 py-10 mt-16 lg:px-4">
    
    <div className="flex flex-wrap  gap-3 justify-between">
      <div className="flex gap-2 -mt-2.5 text-center justify-center items-center">
      <NextImage src={"/logo.svg"} width={140} height={100} alt="logo" />


       
      </div>
    <nav className="-mb-6 flex flex-wrap  gap-x-9 gap-y-3 text-sm/6" aria-label="Footer">
      <a href="#" className="text-gray-400 hover:text-white">Staking calculator</a>
      <a href="#" className="text-gray-400 hover:text-white">About us</a>
      <a href="#" className="text-gray-400 hover:text-white">FAQ</a>
      <a href="#" className="text-gray-400 hover:text-white">Support</a>
    </nav>
    </div>
    
    <div className="flex gap-2 border-t border-black mt-6 pt-6 flex-wrap justify-between items-center">
     <p className=" text-center text-sm/6 text-gray-400">© 2025 — Copyright</p>
    <div >
       <p className=" flex gap-2 text-center text-sm/6 text-white">
    <span className="mt-1.5 cursor-pointer"> <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.3818 10.2931C19.6727 10.2931 19.9273 10.0411 19.9273 9.75321V0.503856C19.9273 0.503856 19.9273 0.503856 19.9273 0.467866C19.9273 0.431876 19.9273 0.431877 19.9273 0.395887V0.323907C19.9273 0.323907 19.9273 0.287917 19.8909 0.287917C19.8909 0.287917 19.8909 0.251928 19.8545 0.251928L19.8182 0.215938C19.8182 0.215938 19.8182 0.215938 19.8182 0.179949L19.7091 0.071979C19.7091 0.071979 19.6727 0.0719796 19.6727 0.0359899C19.6727 0.0359899 19.6364 0.0359897 19.6364 0H19.6C19.6 0 19.5636 0 19.5273 0H19.4909C19.4909 0 19.4909 0 19.4545 0H0.472727C0.472727 0 0.472727 0 0.436363 0C0.4 0 0.4 0 0.363636 0H0.327273C0.290909 0 0.290909 0 0.290909 0C0.290909 0 0.254545 1.3586e-07 0.254545 0.0359899C0.254545 0.0359899 0.218181 0.0359893 0.218181 0.071979C0.218181 0.071979 0.181818 0.0719792 0.181818 0.107969L0.109091 0.179949C0.109091 0.179949 0.109091 0.179949 0.109091 0.215938L0.0727269 0.251928C0.0727269 0.251928 0.0727267 0.287917 0.0363631 0.287917C0.0363631 0.287917 0.0363636 0.323907 0 0.323907V0.395887C0 0.431877 0 0.431876 0 0.467866C0 0.467866 0 0.467866 0 0.503856V13.4602C0 13.7481 0.254545 14 0.545455 14H19.4545C19.7455 14 20 13.7481 20 13.4602C20 13.1722 19.7455 12.9203 19.4545 12.9203H1.01818V1.65553L9.56364 8.63753C9.6 8.67352 9.67273 8.70951 9.70909 8.70951H9.74545C9.78182 8.70951 9.85455 8.7455 9.89091 8.7455C9.92727 8.7455 10 8.7455 10.0364 8.70951H10.0727C10.1091 8.67352 10.1818 8.67352 10.2182 8.63753L18.7636 1.65553V9.75321C18.8364 10.0411 19.0909 10.2931 19.3818 10.2931ZM9.92727 7.52185L2 1.0437H17.8545L9.92727 7.52185Z" fill="white"/>
</svg></span>   admin@stakeprofitx.com
       </p>
    </div>
    </div>

  </div>
  


  <div className='flex justify-center items-center py-5 bg-gray-950'>
  <h1 className='text-white text-center text-sm/6 text-gray-400'>Made with ❤️ by <a href='https://github.com/kashifal' className='text-green-500 px-1 underline'>Kashif Sulehria</a></h1></div>  
</footer>
    </>
  )
}

export default Footer