'use client';

import { logout } from '@/actions/auth-action';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded transition"
    >
      Вийти
    </button>
  );
}
