import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast'

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
        <br>
        </br>
        <Button variant="default" onClick={() => toast.success('hello toast!')}>
          Click me
        </Button>
      </div>
      

      </>
  );
}
