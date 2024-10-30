import Head from 'next/head';
import Link from 'next/link';


export default function Home() {
  return (
    <>
    <Head>
      <title key="title">Home</title>
    </Head>
      <div>
        <h1>Home</h1>
        <Link prefetch={false} href={`/user`}>
          User&apos;s profile
        </Link>
      </div>
      

      </>
  );
}
