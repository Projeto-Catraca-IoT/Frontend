import jwt from 'jsonwebtoken'

export const auth = (request, response, next) => {
    const JWT_SECRET = process.env.JWT_SECRET
    const token = request.headers.authorization

    if (!token) {
        return response.status(401).json({ message: 'Acesso negado' })
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET)
        request.authId = decoded.id;
    } catch (error) {
        return response.status(401).json({ message: 'Token inválido' })
    }

    next()
}