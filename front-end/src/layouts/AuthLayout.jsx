import { Outlet } from 'react-router-dom';
import { IoWallet } from 'react-icons/io5';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="mb-8 flex items-center gap-3 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-900/50">
            <IoWallet size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">PFM System</h1>
            <p className="text-sm text-slate-300">
              Personal Finance Management
            </p>
          </div>
        </div>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
