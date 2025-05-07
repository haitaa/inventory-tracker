// components/Sidebar.tsx
"use client";

import Link from "next/link";

import { LuLayoutDashboard, LuShoppingBag } from "react-icons/lu";
import { FaCube, FaUserGroup } from "react-icons/fa6";
import { HiOutlineBuildingOffice2, HiCog6Tooth } from "react-icons/hi2";
import { BsFillCreditCard2BackFill } from "react-icons/bs";
import { MdOutlineBarChart } from "react-icons/md";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { FaArrowRightToBracket } from "react-icons/fa6";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LuLayoutDashboard },
  { label: "Siparişler", href: "/orders", icon: LuShoppingBag },
  { label: "Ürünler", href: "/products", icon: FaCube },
  { label: "Müşteriler", href: "/customers", icon: FaUserGroup },
  { label: "Çalışanlar", href: "/employees", icon: HiOutlineBuildingOffice2 },
  { label: "Faturalama", href: "/billing", icon: BsFillCreditCard2BackFill },
  { label: "Analitik", href: "/analytics", icon: MdOutlineBarChart },
  { label: "Ayarlar", href: "/settings", icon: HiCog6Tooth },
  { label: "Yardım", href: "/help", icon: HiQuestionMarkCircle },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white h-screen flex flex-col justify-between border-r">
      <div className="px-6 pt-6">
        {/* Logo */}
        <Link href="/" className="flex items-center mb-12">
          <span className="ml-2 text-2xl font-bold text-indigo-600">Haita</span>
        </Link>

        {/* Nav */}
        <nav className="space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className={`
                flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100
                ${href === window.location.pathname ? "bg-indigo-50 text-indigo-600" : ""}
              `}
            >
              <Icon className="h-5 w-5" />
              <span className="ml-3">{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="px-6 pb-6">
        <button
          onClick={() => {
            /* handle logout */
          }}
          className="w-full flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <FaArrowRightToBracket className="h-5 w-5" />
          <span className="ml-3">Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}
