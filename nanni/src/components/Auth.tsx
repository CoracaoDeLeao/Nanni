"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContextProvider";
import { useRouter } from "next/navigation";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(email, password);
      if (isAuthenticated) {
        router.push("/");
      }
    } catch (error) {
      console.error("Erro de login:", error);
      throw new Error("Falha no login. Verifique suas credenciais.");
    }
  };

  return (
    <div>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}
