import React from "react";

const Users = () => {
  const users = [
    {
      id: 1,
      name: "Pristia Candra",
      email: "lincoln@gmail.com",
      balance: "$ 328.00,43",
      staked: "$ 328.00,43",
      registration: "21.01.2025",
      status: "ACTIVE",
      account: "Activated",
    },
    {
      id: 2,
      name: "Miracle Geidt",
      email: "lincoln@gmail.com",
      balance: "$ 328.00,43",
      staked: "$ 328.00,43",
      registration: "21.01.2025",
      status: "BLOCKED",
      account: "Inactive",
    },

    {
      id: 2,
      name: "Miracle Geidt",
      email: "lincoln@gmail.com",
      balance: "$ 328.00,43",
      staked: "$ 328.00,43",
      registration: "21.01.2025",
      status: "ACTIVE",
      account: "Inactive",
    },

    {
      id: 2,
      name: "Miracle Geidt",
      email: "lincoln@gmail.com",
      balance: "$ 328.00,43",
      staked: "$ 328.00,43",
      registration: "21.01.2025",
      status: "ACTIVE",
      account: "Inactive",
    },

    {
      id: 2,
      name: "Miracle Geidt",
      email: "lincoln@gmail.com",
      balance: "$ 328.00,43",
      staked: "$ 328.00,43",
      registration: "21.01.2025",
      status: "ACTIVE",
      account: "Inactive",
    },
    // ... add more users as needed
  ];

  return (
    <div className="w-full px-4 py-6 bg-[#F0F1F1] text-black">
      <h2 className="text-2xl font-semibold mb-6">Users</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full ">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-4 font-normal text-gray-500 items-center ">
                <input type="checkbox" className=" h-[17px] w-[17px]" />
              </th>
              <th className="pb-4 font-normal text-gray-500">
                <div className="flex items-center justify-between pr-8">
                  <span>User name</span>
                  <svg
                    width="8"
                    height="10"
                    viewBox="0 0 8 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2"
                  >
                    <path
                      d="M3.46055 0.320327C3.75848 0.026688 4.24152 0.026688 4.53945 0.320327L7.27503 3.01651C7.75562 3.49019 7.41524 4.3000 6.73558 4.3001H1.26442C0.584758 4.3000 0.244379 3.49019 0.724976 3.01651L3.46055 0.320327Z"
                      fill="#CBD5E0"
                    />
                    <path
                      d="M3.46055 9.67987C3.75848 9.97351 4.24152 9.97351 4.53945 9.67987L7.27503 6.98369C7.75562 6.51001 7.41524 5.7001 6.73558 5.7001H1.26442C0.584758 5.7001 0.244379 6.51001 0.724976 6.98369L3.46055 9.67987Z"
                      fill="#CBD5E0"
                    />
                  </svg>
                </div>
              </th>
              <th className="pb-4 font-normal text-gray-500">
                <div className="flex items-center justify-between pr-8">
                  <span>Balance</span>
                  <svg
                    width="8"
                    height="10"
                    viewBox="0 0 8 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2"
                  >
                    <path
                      d="M3.46055 0.320327C3.75848 0.026688 4.24152 0.026688 4.53945 0.320327L7.27503 3.01651C7.75562 3.49019 7.41524 4.3000 6.73558 4.3001H1.26442C0.584758 4.3000 0.244379 3.49019 0.724976 3.01651L3.46055 0.320327Z"
                      fill="#CBD5E0"
                    />
                    <path
                      d="M3.46055 9.67987C3.75848 9.97351 4.24152 9.97351 4.53945 9.67987L7.27503 6.98369C7.75562 6.51001 7.41524 5.7001 6.73558 5.7001H1.26442C0.584758 5.7001 0.244379 6.51001 0.724976 6.98369L3.46055 9.67987Z"
                      fill="#CBD5E0"
                    />
                  </svg>
                </div>
              </th>
              <th className="pb-4 font-normal text-gray-500">
                <div className="flex items-center justify-between pr-8">
                  <span>Staked</span>
                  <svg
                    width="8"
                    height="10"
                    viewBox="0 0 8 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2"
                  >
                    <path
                      d="M3.46055 0.320327C3.75848 0.026688 4.24152 0.026688 4.53945 0.320327L7.27503 3.01651C7.75562 3.49019 7.41524 4.3000 6.73558 4.3001H1.26442C0.584758 4.3000 0.244379 3.49019 0.724976 3.01651L3.46055 0.320327Z"
                      fill="#CBD5E0"
                    />
                    <path
                      d="M3.46055 9.67987C3.75848 9.97351 4.24152 9.97351 4.53945 9.67987L7.27503 6.98369C7.75562 6.51001 7.41524 5.7001 6.73558 5.7001H1.26442C0.584758 5.7001 0.244379 6.51001 0.724976 6.98369L3.46055 9.67987Z"
                      fill="#CBD5E0"
                    />
                  </svg>
                </div>
              </th>
              <th className="pb-4 font-normal text-gray-500">
                <div className="flex items-center justify-between pr-8">
                  <span>Registration</span>
                  <svg
                    width="8"
                    height="10"
                    viewBox="0 0 8 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2"
                  >
                    <path
                      d="M3.46055 0.320327C3.75848 0.026688 4.24152 0.026688 4.53945 0.320327L7.27503 3.01651C7.75562 3.49019 7.41524 4.3000 6.73558 4.3001H1.26442C0.584758 4.3000 0.244379 3.49019 0.724976 3.01651L3.46055 0.320327Z"
                      fill="#CBD5E0"
                    />
                    <path
                      d="M3.46055 9.67987C3.75848 9.97351 4.24152 9.97351 4.53945 9.67987L7.27503 6.98369C7.75562 6.51001 7.41524 5.7001 6.73558 5.7001H1.26442C0.584758 5.7001 0.244379 6.51001 0.724976 6.98369L3.46055 9.67987Z"
                      fill="#CBD5E0"
                    />
                  </svg>
                </div>
              </th>
              <th className="pb-4 font-normal text-gray-500">
                <div className="flex items-center justify-between pr-8">
                  <span>Status</span>
                  <svg
                    width="8"
                    height="10"
                    viewBox="0 0 8 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2"
                  >
                    <path
                      d="M3.46055 0.320327C3.75848 0.026688 4.24152 0.026688 4.53945 0.320327L7.27503 3.01651C7.75562 3.49019 7.41524 4.3000 6.73558 4.3001H1.26442C0.584758 4.3000 0.244379 3.49019 0.724976 3.01651L3.46055 0.320327Z"
                      fill="#CBD5E0"
                    />
                    <path
                      d="M3.46055 9.67987C3.75848 9.97351 4.24152 9.97351 4.53945 9.67987L7.27503 6.98369C7.75562 6.51001 7.41524 5.7001 6.73558 5.7001H1.26442C0.584758 5.7001 0.244379 6.51001 0.724976 6.98369L3.46055 9.67987Z"
                      fill="#CBD5E0"
                    />
                  </svg>
                </div>
              </th>
              <th className="pb-4 font-normal text-gray-500">
                <div className="flex items-center justify-between pr-8">
                  <span>Account</span>
                  <svg
                    width="8"
                    height="10"
                    viewBox="0 0 8 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2"
                  >
                    <path
                      d="M3.46055 0.320327C3.75848 0.026688 4.24152 0.026688 4.53945 0.320327L7.27503 3.01651C7.75562 3.49019 7.41524 4.3000 6.73558 4.3001H1.26442C0.584758 4.3000 0.244379 3.49019 0.724976 3.01651L3.46055 0.320327Z"
                      fill="#CBD5E0"
                    />
                    <path
                      d="M3.46055 9.67987C3.75848 9.97351 4.24152 9.97351 4.53945 9.67987L7.27503 6.98369C7.75562 6.51001 7.41524 5.7001 6.73558 5.7001H1.26442C0.584758 5.7001 0.244379 6.51001 0.724976 6.98369L3.46055 9.67987Z"
                      fill="#CBD5E0"
                    />
                  </svg>
                </div>
              </th>
              <th className="pb-4 font-normal text-gray-500">
                <div className="flex justify-around items-center  pr-8">
                  <span>Action</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="py-4">
                  <input
                    type="checkbox"
                    className="rounded-xl h-[17px] w-[17px]"
                  />
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    {user.name === "Miracle Geidt" ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm">
                        MG
                      </div>
                    ) : (
                      <img
                        src="/path-to-avatar.jpg"
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">{user.balance}</td>
                <td className="py-4">{user.staked}</td>
                <td className="py-4">{user.registration}</td>
                <td className="py-4 flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      user.status === "ACTIVE"
                        ? "bg-[#E7F7EF] font-semibold w-[100px] flex justify-center text-emerald-600"
                        : "bg-[#F4F0FF] font-semibold w-[100px] justify-center text-purple-600"
                    }`}
                  >
                    {user.status}
                  </span>
                  <svg
                    width="10"
                    height="7"
                    viewBox="0 0 10 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.528636 1.02876C0.788986 0.768409 1.2111 0.768409 1.47145 1.02876L5.00004 4.55735L8.52864 1.02876C8.78899 0.768409 9.2111 0.768409 9.47145 1.02876C9.7318 1.28911 9.7318 1.71122 9.47145 1.97157L5.47145 5.97157C5.2111 6.23192 4.78899 6.23192 4.52864 5.97157L0.528636 1.97157C0.268287 1.71122 0.268287 1.28911 0.528636 1.02876Z"
                      fill="#A0AEC0"
                    />
                  </svg>
                </td>
                <td className="py-4">{user.account}</td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <button className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {user.name === "Miracle Geidt" ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm">
                    MG
                  </div>
                ) : (
                  <img
                    src="/path-to-avatar.jpg"
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  user.status === "ACTIVE"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-purple-100 text-purple-600"
                }`}
              >
                {user.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Balance</span>
                <span>{user.balance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Staked</span>
                <span>{user.staked}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Registration</span>
                <span>{user.registration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account</span>
                <span>{user.account}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                View
              </button>
              <button className="flex-1 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Edit
              </button>
              <button className="flex-1 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
