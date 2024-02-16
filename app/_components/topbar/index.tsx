"use client";
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  showLogout: boolean;
  handleSearch: Function;
}

// Topbar component
export default function Topbar(props: any) {
  let router = useRouter();
  const { showLogout, handleSearch } = props;

  const userLogout = () => {
    localStorage.clear();
    signOut();
  };
  // return component
  return (
    <div className="flex items-center justify-between p-2 pr-4 mb-4">
      <div>LOGO</div>
      <input
        className="peer block w-[250] rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={"Search Movie by Title"}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      <div>
        {showLogout ? (
          <button onClick={userLogout} className="flex items-center ">
            <span>logout</span>
            <IoIosLogOut className="ml-2" />
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="flex items-center "
          >
            <span>Login</span>
            <IoIosLogIn className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
}
