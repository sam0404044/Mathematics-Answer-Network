import Link from 'next/link';
export default function Logo({ onIsActive }) {
    return (
        <Link href='/' onClick={() => onIsActive((isActive) => (isActive ? !isActive : isActive))}>
            <img src='/img/logo.png' width={50} />
        </Link>
    );
}
