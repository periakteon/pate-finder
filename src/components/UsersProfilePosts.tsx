import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faComment } from "@fortawesome/free-solid-svg-icons";
import { profileAtom } from "@/pages/profile/[username]";
import { useAtom } from "jotai";

const UsersProfilePostsComponent = () => {
  const [profile] = useAtom(profileAtom);
  console.log("users profile", profile);
  if (!profile) {
    return null;
  }
  return (
    <div className="p-5 justify-center items-center">
      <div className="flex flex-wrap justify-start">
        {profile.posts.map((post, id) => (
          <div key={id} className="basis-1/3 p-2">
            <button className="relative w-80">
              <Image
                src={post.postImage}
                alt="post image"
                width={320}
                height={320}
                className="rounded-lg"
              />
              <div className="absolute bottom-0 rounded-t-lg left-0 p-2 bg-black bg-opacity-50 w-18 justify-start">
                <div className="flex flex-row text-green-600 hover:text-green-800">
                  <FontAwesomeIcon icon={faPaw} className="text-l mr-2 " />
                  <div>{post.likes.length || 0}</div>
                </div>

                <div className="flex flex-row text-blue-600 hover:text-blue-800">
                  <FontAwesomeIcon icon={faComment} className="text-l mr-2" />
                  <div>{post.comments.length || 0}</div>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersProfilePostsComponent;
