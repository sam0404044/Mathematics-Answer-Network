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
        </>
    );
}
