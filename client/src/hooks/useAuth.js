import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logoutUser, fetchMe, clearError } from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((s) => s.auth);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: (creds) =>
      dispatch(
        loginUser({
          email: creds.email?.toLowerCase()?.trim(),
          password: creds.password,
        })
      ).unwrap(),
    register: (data) =>
      dispatch(
        registerUser({
          ...data,
          email: data.email?.toLowerCase()?.trim(),
          name: data.name?.trim(),
        })
      ).unwrap(),
    logout: () => dispatch(logoutUser()),
    fetchMe: () => dispatch(fetchMe()).unwrap(),
    clearError: () => dispatch(clearError()),
    hasRole: (...roles) => roles.includes(user?.role),
  };
};
