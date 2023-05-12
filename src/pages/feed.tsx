import Image from "next/image";
import { useState, useEffect } from "react";

type Post = {
  id: number;
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
  const [showNoContentMessage, setShowNoContentMessage] = useState<boolean>(false);

  useEffect(() => {

    const loadPosts = async (pageNumber: number) => {
      setIsLoading(true);
      const res = await fetch(`/api/post/query?page=${pageNumber}`);
      const data: ApiResponse = await res.json();
      console.log(data);

      if (data.success === true) {
        setPosts((prevPosts) => [...prevPosts, ...data.posts]); //yeni gelecek postları eski postların üzerine ekliyoruz
        setTotalPages(data.totalPages);
        setIsLoading(false);
      } else {
        console.error(data.errors);
      }
    }

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
  }), [];

  console.log("Sayfa numarası: ", pageNumber);
  console.log("Toplam sayfa: ", totalPages);
  console.log("Kalan sayfa: ", totalPages - pageNumber);

  return (
    <>
      <div className="flex justify-center">
        <ul>
          {posts.map((post, id) => (
            <li key={id}>
              <h2 className="text-2xl text-center font-bold">{post.caption}</h2>
              <Image className="mx-auto" src={post.postImage} alt="image" width={640} height={480} />
              <p className="font-bold text-center my-3">Ekleyen Kullanıcı: {post.authorId}</p>
              <hr className="my-5" />
            </li>
          ))}
        </ul>
      </div>

      {isLoading && (
        <p>Loading...</p>
      )}

      {pageNumber < totalPages && !isLoading && (
        <button onClick={handleLoadMore} disabled={pageNumber >= totalPages}>
          Load More
        </button>
      )}

      {showNoContentMessage && (
        <p className="text-center text-gray-400 font-bold my-5">Gösterilecek yeni içerik yok.</p>
      )}
    </>
  );
}

export default HomePage;
