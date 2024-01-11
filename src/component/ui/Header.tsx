'use client';
import React, { useEffect, useState } from 'react';

export const Header = () => {
  const [isCheck, setIsCheck] = useState(false);
  const [menuBgStyle, setMenuBgStyle] = useState<string>('hidden z-0');
  const [menuStyle, setMenuStyle] = useState<string>('left-[-100%]');
  const [humbergerStyle, setHumbergerStyle] = useState<string>('');
  const [closeStyle, setCloseStyle] = useState<string>('hidden');

  useEffect(() => {
    if (isCheck === true) {
      setMenuStyle('left-0');
      setMenuBgStyle('fixed z-20');
      setHumbergerStyle('hidden');
      setCloseStyle('');
    } else {
      setMenuStyle('left-[-100%]');
      setMenuBgStyle('hidden z-0');
      setHumbergerStyle('');
      setCloseStyle('hidden');
    }
  }, [isCheck]);

  return (
    <>
      <label
        htmlFor="menu"
        className={`bg-[#0000002d] w-full h-[100vh] ${menuBgStyle}`}
      ></label>
      <nav
        className={`fixed w-2/3 h-[100vh] bg-[#E3DEDA] ${menuStyle}  transition-all z-30 fixed`}
        id="menu-nav"
      >
        <div className="w-full h-12 flex items-center">
          <label
            htmlFor="menu"
            className=" w-7 h-7 block text-center ml-4 z-20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className={`${closeStyle} text-[#646767] humbleicons hi-bars`}
            >
              <g
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="2"
              >
                <path d="M6 18L18 6M18 18L6 6" />
              </g>
            </svg>
          </label>
        </div>
        <ul className={`${menuStyle} mt-28 space-y-4 ml-8`}>
          <li>
            <a href="#" className="text-[#646767]">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-[#646767]">
              Profile
            </a>
          </li>
          <li>
            <a href="#" className="text-[#646767]">
              Likes
            </a>
          </li>
          <li>
            <a href="#" className="text-[#646767]">
              Follows
            </a>
          </li>
          <li>
            <a href="#" className="text-[#646767]">
              Post
            </a>
          </li>
        </ul>
        <button className="bottom-0 absolute h-14 w-full flex items-center">
          <p className="text-base inline-block ml-10 text-[#646767]">Logout</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="w-8 ml-6 text-[#B3D0CF] inline-block humbleicons hi-logout"
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 12h-9.5m7.5 3l3-3-3-3m-5-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h5a2 2 0 002-2v-1"
            />
          </svg>
        </button>
      </nav>
      <header className="w-full h-12 bg-[#B3D0CF] flex items-center fixed top-0">
        <input
          type="checkbox"
          id="menu"
          className="hidden"
          onChange={() => setIsCheck(!isCheck)}
        />
        <label htmlFor="menu" className=" w-7 h-7 block text-center ml-4 z-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className={`${humbergerStyle} text-[#646767] humbleicons hi-bars`}
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </label>
      </header>
    </>
  );
};
