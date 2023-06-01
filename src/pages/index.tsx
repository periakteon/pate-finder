import Link from "next/link";

const Home: React.FC = () => {
  return (
    <main className="min-h-screen bg-purple-100 flex flex-col items-center p-24">
      <div className="m-7 text-6xl hover:bg-rose-500 hover:text-white hover:rounded-lg">
        <Link href={"/login"}>Giriş Yap</Link>
      </div>
      <div className="m-7 text-6xl hover:bg-rose-500 hover:text-white hover:rounded-lg">
        <Link href={"/register"}>Kayıt Ol</Link>
      </div>
      <div className="m-7 text-6xl">
        <Link
          href={"/myprofile"}
          className="hover:bg-rose-500 hover:text-white hover:rounded-lg"
        >
          Profilime Git (Protected Route)
        </Link>
      </div>
      <div className="m-7 text-6xl">
        <Link
          href={"/members"}
          className="hover:bg-rose-500 hover:text-white hover:rounded-lg"
        >
          Members
        </Link>
      </div>
      <div className="m-7 text-6xl">
        <Link
          href={"/feed"}
          className="hover:bg-rose-500 hover:text-white hover:rounded-lg"
        >
          Feed
        </Link>
      </div>
    </main>
  );
};

export default Home;
