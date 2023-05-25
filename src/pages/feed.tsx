import Sidebar from "@/components/sidebar";
import { useState, useEffect } from "react";
import PostComponent from "@/components/post";
import {
  infinitePostType,
  infiniteScrollResponseSchema,
} from "../utils/zodSchemas";
import { z } from "zod";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
type PostType = z.infer<typeof infinitePostType>;

function HomePage() {
  const [posts, setPosts] = useState<PostType[]>([]);
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
      try {
        const res = await fetch(
          `/api/post/query?page=${pageNumber}&pageSize=${pageSize}`,
        );
        const parsed = await infiniteScrollResponseSchema.safeParseAsync(
          await res.json(),
        );

        if (!parsed.success) {
          console.log("Parse error");
          return;
        }

        if (parsed.success) {
          if (parsed.data.success) {
            const { posts } = parsed.data;
            setPosts((prevPosts) => [...prevPosts, ...posts]);
            setIsLoading(false);
          }
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

      {showNoContentMessage && (
        <p className="text-center text-gray-400 font-bold my-5">
          Gösterilecek yeni içerik yok.
        </p>
      )}
    </>
  );
}

export default HomePage;
