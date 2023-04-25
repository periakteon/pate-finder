import React from "react";

type Props = {};

const login = (props: Props) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 to-purple-600 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="border-solid border-2 border-sky-500 w-56 backdrop-blur-sm bg-white/30 flex justify-center">
        <h1 className="text-5xl">Hello</h1>
      </div>
    </div>
  );
};

export default login;
