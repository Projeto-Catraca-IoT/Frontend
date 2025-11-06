import React from 'react';

const Register = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl mb-6">Registrar</h2>
      {/* Aqui ficará o formulário de registro */}
      <form className="flex flex-col gap-4 w-80">
        <input type="text" placeholder="Nome de usuário" className="border p-2 rounded" required />
        <input type="email" placeholder="E-mail" className="border p-2 rounded" required />
        <input type="password" placeholder="Senha" className="border p-2 rounded" required />
        <button type="submit" className="bg-green-600 text-white p-2 rounded">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
