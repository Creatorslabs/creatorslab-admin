"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const SideBar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: "/admin", label: "Dashboard", icon: "/images/admin/dashboard.svg" },
    { href: "/admin/users", label: "Users", icon: "/images/admin/users.svg" },
    { href: "/admin/tasks", label: "Tasks", icon: "/images/admin/tasks.svg" },
    {
      href: "/admin/engagement",
      label: "Engagement",
      icon: "/images/admin/engagement.svg",
    },
  ];

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full transition-all duration-300 bg-card z-50
      ${isCollapsed ? "w-16 md:w-64" : "w-64"} 
      md:relative`}
    >
      {/* Logo */}
      <div className="p-4 px-6">
        <Link href="/" className="flex flex-row gap-2 items-center my-5">
          <Image
            src="/images/logo.png"
            width={30}
            height={30}
            alt="CreatorsLab logo"
          />
          <p className={`text-lg ${isCollapsed ? "hidden md:block" : "block"}`}>
            Creatorslab
          </p>
        </Link>
      </div>

      <div className="flex h-full flex-col justify-between p-4">
        <nav>
          <ul>
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <li key={index} className="mb-4 relative group">
                  <Link
                    href={item.href}
                    className={`flex flex-row gap-2 items-center p-2 hover:bg-gray-700 rounded transition-colors
                      ${
                        isActive ? "font-bold bg-card-foreground" : "hover:bg-card-foreground"
                      }`}
                  >
                    <Image
                      src={item.icon}
                      width={24}
                      height={24}
                      alt={`${item.label} icon`}
                    />
                    <span
                      className={`text-sm ${
                        isCollapsed ? "hidden md:block" : "block"
                      }`}
                    >
                      {item.label}
                    </span>
                    {/* Tooltip - only show on mobile when collapsed */}
                    {isCollapsed && (
                      <div className="md:hidden absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                        {item.label}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex flex-col gap-2">
          {/* Toggle Button - only visible on mobile */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center p-2 hover:bg-gray-700 rounded transition-colors md:hidden text-white relative group"
          >
            {isCollapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {/* Toggle Button Tooltip - only show on mobile */}
            {isCollapsed && (
              <div className="md:hidden absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                {isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              </div>
            )}
          </button>

          <button
            className="flex flex-row gap-2 items-center p-2 hover:bg-gray-700 rounded transition-colors relative group"
            onClick={handleLogout}
          >
            <Image
              src="/images/admin/logout.svg"
              width={24}
              height={24}
              alt="Logout icon"
            />
            <span
              className={`text-sm ${isCollapsed ? "hidden md:block" : "block"}`}
            >
              Logout
            </span>
            {/* Logout Tooltip - only show on mobile when collapsed */}
            {isCollapsed && (
              <div className="md:hidden absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                Logout
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
