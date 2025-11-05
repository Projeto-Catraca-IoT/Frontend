import crypto from 'crypto';
import prisma from '../config/database.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

export const register = async (request, response) => {
    try {
        const user = request.body;

        //Cria salt para usar em senha
        let SALT = crypto.randomBytes(32);
        SALT = SALT.toString("hex");
        const KEY = crypto.scryptSync(SALT, 'salt', 32);

        // Funções para criptogrfar e decriptografar a senha
        function encrypt(text) {
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv('aes-256-cbc', KEY, iv);
            const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
            return iv.toString('hex') + ':' + encrypted.toString('hex');
        }

        // Criptografando senha
        const password_hash = encrypt(user.password);

        // Criando usuário
        const userBD = await prisma.User.create({
            data: {
                name: user.name,
                email: user.email,
                password: password_hash,
                salt: SALT
            }
        })
        return response.status(201).json({ message: 'Usuário registrado' });

    } catch (error) {
        return response.status(500).json({ message: 'Erro ao realizar registro' });
    }
}

export const login = async (request, response) => {
    try {
        const userInfo = request.body;

        // Busca usuário no banco pelo email
        const user = await prisma.user.findUnique({
            where: { email: userInfo.email }
        });

        if (!user) {
            return response.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Recria a KEY usando o SALT do banco
        const KEY = crypto.scryptSync(user.salt, 'salt', 32);

        // Função para descriptografar senha
        function decrypt(hash) {
            const [iv, encrypted] = hash.split(':');
            const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, Buffer.from(iv, 'hex'));
            const decrypted = Buffer.concat([
                decipher.update(Buffer.from(encrypted, 'hex')),
                decipher.final()
            ]);
            return decrypted.toString();
        }

        // Descriptografa a senha armazenada no banco
        const password_decrypt = decrypt(user.password);

        // Compara com a senha informada
        if (password_decrypt !== userInfo.password) {
            return response.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Gera JWT (login bem-sucedido)
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '10080m' });

        return response.status(200).json({
            message: 'Login realizado com sucesso',
            token: token
        });

    } catch (error) {
        return response.status(500).json({ message: 'Erro ao fazer login' });
    }
}

export const locations = async (request, response) => {
    try {
        const userId = request.authId; // Pega do middleware

        const userLocations = await prisma.Location.findMany({
            where: {
                userId: userId
            }
        });

        return response.status(200).json({data: userLocations});

    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Erro ao buscar por locais' });
    }
}