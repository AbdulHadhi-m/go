import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./features/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    let socket;
    if (user && user._id) {
      socket = io(SOCKET_URL, {
        withCredentials: true,
      });

      socket.on('connect', () => {
        socket.emit('join_user_room', user._id);
      });

      socket.on('new_notification', (data) => {
        toast.success(data.title + '\n' + data.message, {
          icon: '🔔',
          duration: 5000,
          position: 'top-right'
        });
      });
    }

    return () => {
      if (socket) {
        if(user && user._id) {
            socket.emit('leave_user_room', user._id);
        }
        socket.disconnect();
      }
    };
  }, [user]);

  return <AppRoutes />;
}

export default App;