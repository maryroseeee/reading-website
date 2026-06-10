import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { getCurrentUser } from "../api/auth-api";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [status, setStatus] = useState<"checking" | "authed" | "guest">(
    "checking",
  );

  useEffect(() => {
    getCurrentUser()
      .then(() => setStatus("authed"))
      .catch(() => setStatus("guest"));
  }, []);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (status === "guest") {
    return <Navigate to="/" replace />;
  }

  return children;
}
