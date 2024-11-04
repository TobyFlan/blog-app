import Head from 'next/head';
import Link from 'next/link';

import Loader from '../../components/Loader';

export default function Home() {
  return (
    <>
    <Head>
      <title key="title">Home</title>
    </Head>
      <div>
        <Loader show={true} />
        <h1>Home</h1>
        <Link prefetch={false} href={`/user`}>
          User&apos;s profile
        </Link>
      </div>
      

      </>
  );
}
