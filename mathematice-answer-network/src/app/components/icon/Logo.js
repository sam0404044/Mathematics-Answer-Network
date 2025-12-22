import Link from 'next/link';
import Image from 'next/image';
export default function Logo({ onIsActive }) {
    return (
        <Link href='/' onClick={() => onIsActive((isActive) => (isActive ? !isActive : isActive))}>
            <Image src='/img/logo.png' width={50} height={50} alt="Logo" />
        </Link>
    );
}
