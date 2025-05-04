import { Input } from "@/components/ui/input";
import { Bell, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoMdSearch } from "react-icons/io";

const Topbar = () => {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl">
      {/* Search Input */}
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md">
          <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search"
            className="rounded-lg pl-10 py-2 w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md transition-all"
          />
        </div>
      </div>

      {/* Icons and User Info */}
      <div className="flex items-center gap-4 ml-4">
        {/* Mail Icon with red dot */}
        <div className="relative">
          <Mail className="w-5 h-5 text-gray-600" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </div>

        {/* Bell Icon */}
        <Bell className="w-5 h-5 text-gray-600" />

        {/* User Info */}
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={"/user-avatar.png"} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <div className="font-medium text-gray-800">Jane Cooper</div>
            <div className="text-gray-500 text-xs">jane234@example.com</div>
          </div>
        </div>

        {/* Dropdown Indicator */}
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default Topbar;
