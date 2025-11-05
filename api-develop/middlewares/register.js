export function register(request, response, next) {
    const { email, name, password, repeat_password } = request.body;

    if (!email || !name || !password || !repeat_password) {
        return response.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    if (password.length < 8) {
        return response.status(400).json({ message: "A senha precisa conter ao menos 8 caracteres" });
    }
    if (password != repeat_password) {
        return response.status(400).json({ message: "As senhas não coincidem" });
    }

    next();
}
