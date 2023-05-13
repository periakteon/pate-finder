import Image from "next/image";
import { useState, useEffect } from "react";

type Post = {
  id: number;
  author: {
    username: string;
    profile_picture: string;
  };
  authorId: number;
  caption: string;
  postImage: string;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  success: boolean;
  posts: Post[];
  totalPages: number;
  errors?: string[];
};

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
      const data = await res.json(); // TODO: ALARM ALARM ZOD VALIDATION, COERCING

      // TODO HERE COMES THE ZOD use ResponseTypeSchema from feed.ts
      // TODO PLX
      if (data.posts.length === 0) {
        setShowNoContentMessage(true);
      }

      if (data.success === true) {
        setPosts((prevPosts) => [...prevPosts, ...data.posts]); //yeni gelecek postları eski postların üzerine ekliyoruz
        setTotalPages(data.totalPages);
        setIsLoading(false);
      } else {
        console.error(data.errors);
      }
    };

    // İlk sayfa yükleme
    loadPosts(pageNumber);
  }, [pageNumber]);

  const handleLoadMore = () => {
    if (pageNumber < totalPages) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
      if (pageNumber + 1 === totalPages) {
        setShowNoContentMessage(true);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Sayfa sonuna geldiğimizi kontrol ediyoruz
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        handleLoadMore();
      }
    };
    // Sayfa scroll edildiğinde yeni postlar yükleniyor
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }),
    [];

  console.log("Sayfa numarası: ", pageNumber);
  console.log("Toplam sayfa: ", totalPages);
  console.log("Kalan sayfa: ", totalPages - pageNumber);

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
