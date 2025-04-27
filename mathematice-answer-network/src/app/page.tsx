// import AlertBox from './components/alert_screen';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Link href={'/login'}>
        <button className='bg-[var(--secondColor)] text-white py-2 rounded-lg font-bold'>
          Login
        </button>
      </Link>
      <div className='hsiao'>
        <h1>
          <Link href="/quiz">quiz_page</Link>
        </h1>
        <h1>
          <Link href="/score">score_page</Link>
        </h1>
        <h1>
          <Link href="/record">record_page</Link>
        </h1>
      </div>
    </>
  );
}
