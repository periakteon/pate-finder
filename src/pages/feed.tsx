import Sidebar from "@/components/sidebar";
import { useState, useEffect } from "react";
import { z } from "zod";
import PostComponent from "@/components/post";

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

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showNoContentMessage, setShowNoContentMessage] =
    useState<boolean>(false);

  // hydration hatasını çözmek için
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loadPosts = async (pageNumber: number, pageSize: number) => {
      setIsLoading(true);

      const res = await fetch(
        `/api/post/query?page=${pageNumber}&pageSize=${pageSize}`,
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

    loadPosts(pageNumber, pageSize);
  }, [pageNumber, pageSize]);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="flex flex-row">
        <Sidebar />
        <ul className="px-8">
          {posts.map((post, id) => (
            <PostComponent key={id} post={post} />
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
