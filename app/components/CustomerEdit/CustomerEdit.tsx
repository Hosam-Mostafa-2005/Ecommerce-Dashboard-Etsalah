"use client";

import { useState } from "react";
import { toast } from "sonner";
interface Customer {
  id: string;
  name: string;
  email: string;
}

const CustomerEditableInfo = ({ customer }: { customer: Customer }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email,
    country: "Egypt, Cairo",
    language: "Arabic / English",
  });

  const handleSave = () => {
    toast("Information have been updated");

    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: customer.name,
      email: customer.email,
      country: "Egypt, Cairo",
      language: "Arabic / English",
    });
    setIsEditing(false);
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          General Information
        </h2>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCancel} className="text-sm text-gray-500">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg"
            >
              Save
            </button>
          </div>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        {/* NAME */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
          {isEditing ? (
            <input
              className="border rounded-lg p-2 text-sm w-full"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          ) : (
            <p className="text-sm font-medium">{formData.name}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">
            Email Address
          </label>
          {isEditing ? (
            <input
              className="border rounded-lg p-2 text-sm w-full"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          ) : (
            <p className="text-sm font-medium">{formData.email}</p>
          )}
        </div>

        {/* COUNTRY */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Country</label>
          {isEditing ? (
            <input
              className="border rounded-lg p-2 text-sm w-full"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
            />
          ) : (
            <p className="text-sm font-medium">{formData.country}</p>
          )}
        </div>

        {/* LANGUAGE */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">
            Preferred Language
          </label>
          {isEditing ? (
            <input
              className="border rounded-lg p-2 text-sm w-full"
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
            />
          ) : (
            <p className="text-sm font-medium">{formData.language}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomerEditableInfo;
