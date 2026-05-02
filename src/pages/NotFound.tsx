import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      
      {/* 404 Text */}
      <h1 className="text-7xl font-bold text-blue-600">404</h1>

      {/* Message */}
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">
        Page Not Found
      </h2>

      <p className="mt-2 text-gray-500 text-center max-w-md">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <Link
          to="/dashboard"
          className="border border-gray-300 px-5 py-2 text-sm hover:bg-gray-100 transition"
        >
          Go Dashboard
        </Link>
      </div>

      {/* Small hint */}
      <p className="mt-6 text-xs text-gray-400">
        Error Code: 404 | Invalid Route
      </p>
    </div>
  );
};

export default NotFound;