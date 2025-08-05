'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: '220px' }}>
      <h4>Admin Panel</h4>
      <ul className="nav flex-column mt-4">
        <li className="nav-item"><Link href="/dashboard" className="nav-link text-white">Dashboard</Link></li>
        <li className="nav-item"><Link href="/users" className="nav-link text-white">Users</Link></li>
        <li className="nav-item"><button onClick={logout} className="btn btn-danger mt-3 w-100">Logout</button></li>
      </ul>
    </div>
  );
}