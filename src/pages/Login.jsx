import React from 'react';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl mb-6">Login</h2>
      {/* Aqui ficará o formulário de login */}
      <form className="flex flex-col gap-4 w-80">
        <input type="email" placeholder="E-mail" className="border p-2 rounded" required />
        <input type="password" placeholder="Senha" className="border p-2 rounded" required />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
