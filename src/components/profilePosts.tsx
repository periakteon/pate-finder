import { useEffect, useState } from "react";
import Image from "next/image";

type Post = {
  id: number;
  caption: string;
  postImage: string;
  createdAt: string;
  updatedAt: string;
};

//TODO: type'i infer et

const ProfilePosts = () => {
  const username = "Glen8";
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch(`/api/post/getPostsByUsername?username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
      })
      .catch((error) => console.error(error));
  }, []);

  if (posts.length === 0) {
    return (
      <div className="p-5">
        <h1>No Posts Yet</h1>
      </div>
    );
  }

  return (
    <div className="p-5 justify-center items-center">
      <div className="flex flex-wrap justify-start">
        {posts.map((post) => (
          <div key={post.id} className="basis-1/3 p-2">
            <Image
              src={post.postImage}
              alt="post image"
              width={400}
              height={400}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePosts;
