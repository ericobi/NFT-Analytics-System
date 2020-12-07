import Link from "next/link";

const Home = () => (
  <div className="w-full">
    <h1 className="font-bold text-5xl text-center mt-24 mb-12">
      Welcome to Bondly NFT Analytics
    </h1>
    <Link href="/dashboard">
      <a>
        <span className="text-center rounded-md border flex items-center justify-center h-12 px-4 mx-auto w-48 bg-primary text-white">
          Go to Dashboard
        </span>
      </a>
    </Link>
  </div>
);

export default Home;
