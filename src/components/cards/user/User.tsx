"use client";

import React from "react";
import Link from "next/link";
import { User } from "@/types/user";
import Swal from "sweetalert2";

export interface UserCardProps extends User {
  deleteUser?: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ _id, firstName, lastName, email, dateCreated , deleteUser }) => {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
      reverseButtons: true,
    });
    
    if (result.isConfirmed) {
      deleteUser && deleteUser(_id);
      Swal.fire("Supprimé !", "L'utilisateur a été supprimé.", "success");
    }
  };

  // Generate user avatar with initials
  const getUserInitials = () => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Generate random color based on user initials for consistent avatar color
  const getAvatarColor = () => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", 
      "bg-pink-500", "bg-orange-500", "bg-teal-500"
    ];
    const index = (firstName.charCodeAt(0) + lastName.charCodeAt(0)) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <div className="flex items-center">
          <div className={`${getAvatarColor()} w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg`}>
            {getUserInitials()}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{firstName} {lastName}</h3>
            <p className="text-sm text-gray-600">Utilisateur</p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="space-y-3">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span className="text-gray-700">{email}</span>
          </div>
          
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-gray-700">{dateCreated ? dateCreated.toLocaleString() : ""}</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          ID: {_id.substring(0, 8)}...
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/users/update/${_id}`}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Modifier"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </Link>
          
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Supprimer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;