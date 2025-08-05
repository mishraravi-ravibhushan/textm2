// hoc/withAuth.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function withAuth(Component) {
  return function ProtectedComponent(props) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.replace("/login");
      }
    }, [user]);

    if (!user) return null; // or a loading spinner

    return <Component {...props} />;
  };
}
