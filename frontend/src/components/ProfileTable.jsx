import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import EditProfile from "./EditProfile";
import Password from "./Password";

const ProfileTable = () => {
  const [activeTab, setActiveTab] = useState("edit");

  return (
    <div className="p-4 bg-white shadow-md rounded-lg my-8">
      <h1 className="text-2xl font-bold text-[#1E3A8A] mb-6 flex items-center gap-2">
        <FaUser className="text-[#10B981]" /> Profile Settings
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("edit")}
          className={`flex items-center gap-2 px-5 py-2 font-medium transition-all duration-200 ${
            activeTab === "edit"
              ? "border-b-4 border-[#10B981] text-[#1E3A8A]"
              : "text-[#6B7280] hover:text-[#1E3A8A]"
          }`}
        >
          <FaUser />
          Edit Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`flex items-center gap-2 px-5 py-2 font-medium transition-all duration-200 ${
            activeTab === "password"
              ? "border-b-4 border-[#10B981] text-[#1E3A8A]"
              : "text-[#6B7280] hover:text-[#1E3A8A]"
          }`}
        >
          <FaLock />
          Password
        </button>
      </div>

      {/* Content */}
      <div className="bg-[#F3F4F6] p-6 rounded-lg shadow-md">
        {activeTab === "edit" && <EditProfile />}
        {activeTab === "password" && <Password />}
      </div>
    </div>
  );
};

export default ProfileTable;
