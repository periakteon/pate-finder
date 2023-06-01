import Sidebar from "@/components/Sidebar/sidebar";
import { useState, useEffect } from "react";
import PostComponent from "@/components/Post/post";
import {
  infinitePostType,
  infiniteScrollResponseSchema,
} from "../utils/zodSchemas";
import { z } from "zod";
import { toast } from "react-toastify";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
type PostType = z.infer<typeof infinitePostType>;

const HomePage: React.FC = () => {
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
        const json = await res.json();

        const parsed = await infiniteScrollResponseSchema.safeParseAsync(json);

        if (!parsed.success) {
          throw new Error(parsed.error.toString());
        }

        if (parsed.success) {
          if (parsed.data.success) {
            const { posts: newPosts } = parsed.data;

            setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            setIsLoading(false);
          }
        }
      } catch (error) {
        toast.error(`Hata: ${error}`, {
          draggable: false,
          autoClose: 2000,
        });
      }
    };

    loadPosts(pageNumber, pageSize);
  }, [pageNumber, pageSize]);

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight;

      if (bottom && !isLoading && !showNoContentMessage) {
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      <Sidebar />
      <div
        className={`flex ${
          mounted ? "flex" : "hidden"
        } flex md:flex-row justify-center min-h-screen`}
      >
        <div className="flex flex-row">
          <div className="w-full min-h-screen">
            <div className="max-w-2xl mx-auto">
              <ul className="px-2">
                {posts.map((post, id) => (
                  <PostComponent key={id} post={post} />
                ))}
              </ul>
            </div>
          </div>
        </div>

        {showNoContentMessage && (
          <p className="text-center text-gray-400 font-bold my-5">
            Gösterilecek yeni içerik yok.
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
