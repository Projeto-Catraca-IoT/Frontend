import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // validações básicas no front
    if (!name || !email || !password || !repeatPassword) {
      return setError("Preencha todos os campos");
    }
    if (password.length < 8) {
      return setError("A senha precisa ter ao menos 8 caracteres");
    }
    if (password !== repeatPassword) {
      return setError("As senhas não coincidem");
    }

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        repeat_password: repeatPassword,
      });

      setSuccess("Cadastro realizado com sucesso!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg = err?.response?.data?.message || "Erro ao cadastrar usuário.";
      setError(msg);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Criar Conta</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Repetir senha"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Cadastrar</button>
        </form>

        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
        {success && <p style={{ color: "green", marginTop: 10 }}>{success}</p>}

        <p style={{ marginTop: 15 }}>
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #2c3e50, #3498db)",
    fontFamily: "sans-serif",
  },
  card: {
    background: "#fff",
    padding: 30,
    borderRadius: 12,
    width: 320,
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    marginBottom: 20,
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: 12,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  button: {
    padding: "10px 12px",
    background: "#3498db",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
  },
};
