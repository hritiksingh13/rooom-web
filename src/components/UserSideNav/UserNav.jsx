import React from "react";

export default function UserNav(props) {
  return (
    <nav className="flex flex-col min-h-0 w-64 h-full border-r">
      <div className="flex font-semibold mt-2 mb-2 justify-center border-b">
        Users
      </div>
      <div className="flex-1 flex-col gap-1 overflow-auto">
        {props.users.map((user) => (
          <span
            key={user.userId}
            className="flex items-center w-full h-10 px-4 text-sm font-medium text-gray-900 dark:text-gray-900
                  peer-disabled:cursor-not-allowed
                  peer-disabled:opacity-70"
          >
            {user.alias}
          </span>
        ))}
      </div>
    </nav>
  );
}
