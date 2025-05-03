import { useState } from 'react';
import axios, { AxiosError } from 'axios';

const Logoutbtn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:8080/api/v1/auth/logout', null, {
        withCredentials: true,
      });
      
      window.location.href = '/login';
    } catch (err) {

      const msg =
        (err instanceof AxiosError && err.response?.data?.message) ||
        (err instanceof Error && err.message) ||
        'Logout failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-center">
      <button
        onClick={handleLogout}
        disabled={loading}
        className="cursor-pointer px-4 py-2 text-sm font-semibold bg-red-300 text-red-600  hover:bg-red-400 rounded-lg hover:text-black">
        {loading ? 'Logging out...' : 'Logout'}
      </button>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Logoutbtn;
