import { useState } from "react";

interface User {
  id: number;
  username: string;
  email: string;
}
[];

const Members = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      console.log(document.cookie);
      const response = await fetch("/api/fetchMembers");
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center my-5 divide-y">
      <div>
        <div>
          <h1 className="text-5xl bg-white">MEMBERS</h1>
        </div>
        <div>
          <button
            className="text-3xl mt-10 text-white border-b-2 border-b-rose-600 hover:border-rose-300"
            onClick={fetchUsers}
          >
            Kullanıcıları Getir
          </button>
        </div>
      </div>
      <div className="mt-10 divide-y">
        {users.length > 0 &&
          users.map((user) => (
            <div key={user.id} className="mt-10">
              <h1 className="text-xl text-white my-5 text-center underline underline-offset-8">
                {user.id}
              </h1>
              <h1 className="text-xl text-white">
                Kullanıcı Adı: {user.username}
              </h1>
              <h1 className="text-xl text-white">{user.email}</h1>
              <div className="">
                <div className="cursor-pointer mt-5 text-3xl bg-emerald-600 hover:bg-emerald-400 text-white rounded-lg text-center">
                  TAKİP ET
                </div>
                <div className="cursor-pointer mt-5 text-3xl bg-rose-600 hover:bg-rose-400 text-white rounded-lg text-center">
                  TAKİBİ BIRAK
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Members;
