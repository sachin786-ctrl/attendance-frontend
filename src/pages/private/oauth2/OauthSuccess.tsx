import { refreshToken } from '@/service/authService';
import useAuth from '@/stores/authStores';
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { FaSync } from 'react-icons/fa';

const OauthSuccess = () => {

  const [ isRefreshing, setIsRefreshing ] = useState<boolean>(false);
  const changeLocalLoginData = useAuth((state) => state.changeLocalLoginData);
useEffect(() => {
  if (localStorage.getItem("accountDeleted")) {
    toast.success("Account deleted successfully!");
    localStorage.removeItem("accountDeleted");
    return; // ❗ IMPORTANT: OAuth login skip
  }

  async function getAccessToken() {
    if (isRefreshing) return;

    setIsRefreshing(true);

    try {
      const res = await refreshToken();
      changeLocalLoginData(res.accessToken, res.user, true);
      toast.success("Login successful!");
    } catch (error) {
      console.error("Token refresh error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  }

  getAccessToken();
}, []);
 
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <h2 className='text-2xl font-semibold'>Processing OAuth Login...</h2>
      <p className='text-gray-600'>Please wait while we log you in.</p>
      <FaSync className={`animate-spin text-4xl ${isRefreshing ? 'text-blue-500' : 'text-gray-400'}`} />
    </div>
  )
}

export default OauthSuccess