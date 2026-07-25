import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import Sidebar from './Sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const admin = token ? await verifyToken(token) : null;

  if (!admin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar admin={admin} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}