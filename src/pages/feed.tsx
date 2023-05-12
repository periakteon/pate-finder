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

  useEffect(() => {

    const loadPosts = async (pageNumber: number) => {
      setIsLoading(true);
      const res = await fetch(`/api/post/query?page=${pageNumber}`);
      const data: ApiResponse = await res.json();
      console.log("Data: ", data);
      

      if (data.success) {
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
    <div className="flex justify-center">
      <ul>
        {posts.map((post, id) => (
          <li key={id}>
            <h2>{post.caption}</h2>
            <Image src={post.postImage} alt="image" width={640} height={480} />
            <p>Ekleyen Kullanıcı: {post.authorId}</p>
            <hr />
          </li>
        ))}
      </ul>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <button onClick={handleLoadMore} disabled={pageNumber >= totalPages}>
          Load More
        </button>
      )}
    </div>
  );
}

export default HomePage;
