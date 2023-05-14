import Image from "next/image";
import { useState, useEffect } from "react";
import { z } from "zod";

type Post = {
  id: number;
  author: {
    username: string;
    profile_picture: string | null;
  };
  authorId: number;
  caption: string;
  postImage: string;
  createdAt: string;
  updatedAt: string;
};

const infiniteScrollResponseSchema = z.object({
  success: z.boolean(),
  posts: z.array(
    z.object({
      id: z.number(),
      author: z.object({
        username: z.string(),
        profile_picture: z.string().nullable(),
      }),
      authorId: z.number(),
      caption: z.string(),
      postImage: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  ),
  errors: z.record(z.array(z.string())).optional(),
});

function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showNoContentMessage, setShowNoContentMessage] =
    useState<boolean>(false);

  useEffect(() => {
    const loadPosts = async (pageNumber: number) => {
      setIsLoading(true);

      const res = await fetch(
        `/api/post/query?page=${pageNumber}&pageSize=${10}`,
      );
      try {
        const data = await infiniteScrollResponseSchema.parseAsync(
          await res.json(),
        );

        if (data.posts.length === 0) {
          setShowNoContentMessage(true);
          return;
        }

        if (data.success === true) {
          setPosts((prevPosts) => [...prevPosts, ...data.posts]);
          setIsLoading(false);
        } else {
          console.error(data.errors);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadPosts(pageNumber);
  }, [pageNumber]);

  const handleLoadMore = () => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;

    if (bottom && !isLoading && !showNoContentMessage) {
      handleLoadMore();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }),
    [];

  return (
    <>
      <div className="flex justify-center">
        <ul>
          {posts.map((post, id) => (
            <li key={id}>
              <p className="font-bold text-center my-3">
                USERNAME: {post.author.username}
              </p>
              {post.author.profile_picture === null ? (
                <Image
                  className="mx-auto rounded-full border border-gray-900"
                  src="https://img.freepik.com/free-icon/user_318-804790.jpg"
                  alt="image"
                  width={128}
                  height={128}
                />
              ) : (
                <Image
                  className="mx-auto rounded-full border border-gray-900"
                  src={post.author.profile_picture}
                  alt="image"
                  width={128}
                  height={128}
                />
              )}
              <h2 className="text-2xl text-center font-bold">
                CAPTION: {post.caption}
              </h2>
              <Image
                className="mx-auto"
                src={post.postImage}
                alt="image"
                width={640}
                height={480}
              />
              <p className="font-bold text-center my-3">Post ID: {post.id}</p>
              <p className="font-bold text-center my-3">
                User ID: {post.authorId}
              </p>
              <hr className="my-5" />
            </li>
          ))}
        </ul>
      </div>

      {isLoading && <p>Loading...</p>}

      {pageNumber < totalPages && !isLoading && (
        <button onClick={handleLoadMore} disabled={pageNumber >= totalPages}>
          Load More
        </button>
      )}

      {showNoContentMessage && (
        <p className="text-center text-gray-400 font-bold my-5">
          Gösterilecek yeni içerik yok.
        </p>
      )}
    </>
  );
}

export default HomePage;
