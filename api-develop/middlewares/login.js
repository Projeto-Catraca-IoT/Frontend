export function login(request, response, next) {
    const { email, password } = request.body;

    if (!email || !password) {
        return response.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    if (password.length < 8) {
        return response.status(400).json({ message: "A senha precisa conter ao menos 8 caracteres" });
    }

    next();
}
