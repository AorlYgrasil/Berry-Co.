export interface DemoAdmin {
  id: string;
  name: string;
  username: string;
  password: string; // plain text — DEMO ONLY, never do this with real users
  role: 'super_admin' | 'admin' | 'staff';
}

export const demoAdmins: DemoAdmin[] = [
  { id: '1', name: 'Super Admin', username: 'superadmin', password: 'password', role: 'super_admin' },
  { id: '2', name: 'Admin', username: 'admin', password: 'password', role: 'admin' },
  { id: '3', name: 'Staff', username: 'staff', password: 'password', role: 'staff' },
];