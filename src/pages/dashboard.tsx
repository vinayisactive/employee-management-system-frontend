import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { AlertTriangle, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/api/v1/auth", {
          withCredentials: true,
        });
        setUsername(data.data.username);
      } catch (err) {
        const msg =
          (err instanceof AxiosError && err.response?.data?.message) ||
          (err instanceof Error && err.message) ||
          "Failed to fetch user data";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-100">
              Dashboard
            </h1>
            {username && (
              <p className="mt-1 text-gray-400">
                Welcome back,{" "}
                <span className="font-semibold text-blue-400 truncate">
                  {username}
                </span>
              </p>
            )}
          </div>
          
          <div
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <button className=" cursor-pointer" onClick={() => navigate("/create")}>Create Employee</button></div>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="animate-spin text-blue-400 w-8 h-8" />
            </div>
          ) : error ? (
            <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="space-y-4"> 
                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                  Quick Actions
                </h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-100 cursor-pointer"
                    onClick={() => navigate("/list")}
                 >
                    View All Employees
                  </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
