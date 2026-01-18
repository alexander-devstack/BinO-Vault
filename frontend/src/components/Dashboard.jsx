import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("sessionToken");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🔐 Your Vault
            </h1>
            <p className="text-gray-400">Secure Password Manager</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
          >
            Logout
          </button>
        </div>

        {/* Success Message */}
        <div className="bg-[#00FFA3]/10 border-2 border-[#00FFA3] rounded-2xl p-8 text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-[#00FFA3] mb-2">
            Login Successful!
          </h2>
          <p className="text-gray-300 text-lg">
            Welcome to BinO-Vault - Your passwords are safe!
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-[#2A2A2A] rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            No Passwords Yet
          </h3>
          <p className="text-gray-400 mb-6">
            Start adding your passwords to keep them secure
          </p>
          <button className="px-8 py-3 bg-[#00FFA3] hover:bg-[#00E693] text-[#1A1A1A] font-semibold rounded-lg transition-all">
            + Add Password
          </button>
        </div>
      </div>
    </div>
  );
}
