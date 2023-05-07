import { followFollowResponse } from "@/utils/zodSchemas";
import { useState } from "react";
import { toast } from "react-toastify";

interface User {
  id: number;
  username: string;
  email: string;
}
[];

const Members = () => {
  const [users, setUsers] = useState<User[]>([]);

  const followUser = async (followingId: number) => {
    try {
      const response = await fetch("/api/follow/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followingId }),
      });
      const data = await response.json();
      const parsed = await followFollowResponse.safeParseAsync(data);

      if (parsed.success) {
        if (parsed.data.success) {
          toast.success(parsed.data.message);
        } else {
          toast.error(parsed.data.error.join("\n"));
        }

        return;
      }

      throw new Error(parsed.error.message);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/fetchMembers");
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error("Takip edilirken hata oluştu!");
      console.error(error);
    }
  };

  return (
    <main>
      <div>
        <h1 className="text-5xl bg-white">MEMBERS</h1>
      </div>
      <button
        className="text-3xl mt-10  border-b-2 border-b-rose-600 hover:border-rose-300"
        onClick={fetchUsers}
      >
        Kullanıcıları Getir
      </button>
      {users.length > 0 &&
        users.map((user) => (
          <div key={user.id} className="mt-10">
            <h1 className="text-xl  my-5 text-center underline underline-offset-8">
              {user.id}
            </h1>
            <h1 className="text-xl ">Kullanıcı Adı: {user.username}</h1>
            <h1 className="text-xl ">{user.email}</h1>
            <button
              onClick={() => followUser(user.id)}
              className="cursor-pointer mt-5 text-3xl bg-emerald-600 hover:bg-emerald-400  rounded-lg text-center"
            >
              TAKİP ET
            </button>
            <div className="cursor-pointer mt-5 text-3xl bg-rose-600 hover:bg-rose-400  rounded-lg text-center">
              TAKİBİ BIRAK
            </div>
          </div>
        ))}
    </main>
  );
};

export default Members;
