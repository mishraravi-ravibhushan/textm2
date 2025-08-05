import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    console.log(router.asPath);
    const storedUser = localStorage.getItem("authUser");
    const loginarray = ["/authentication/sign-in", "/authentication/sign-up"];
    if (storedUser) setUser(JSON.parse(storedUser));
    if (!storedUser && !loginarray.includes(router.asPath)) {
      router.replace("/authentication/sign-in");
    }
  }, [router.asPath]);

  const login = (userData) => {
    localStorage.setItem("authUser", JSON.stringify(userData));
    setUser(userData);
    router.replace("/");
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    setUser(null);
    router.push("/authentication/sign-in");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
