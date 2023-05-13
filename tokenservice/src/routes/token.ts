import express, { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user'
import validateAuthCodeInput from '../middleware/validation';
import getUserByUsername from '../middleware/validUser';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import { clients } from '../config/clients';

const router = express.Router();
const secretKey = randomBytes(32).toString('hex');


router.post('/auth-code', validateAuthCodeInput, (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = getUserByUsername(username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    try {
        const payload = { username: user.username, role: user.role };
        const authCode = jwt.sign(payload, secretKey, { expiresIn: '5m' });
        res.json({ authCode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/access-token', (req: Request, res: Response) => {
    const { authCode, clientId, clientSecret } = req.body;
    if (!authCode || !clientId || !clientSecret) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }
    const client = clients.CLIENTS.find((c) => c.id === clientId && c.secret === clientSecret);
    if (!client) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    let payload: JwtPayload;
    try {
        payload = jwt.verify(authCode, secretKey) as JwtPayload;
    } catch (error) {
        return res.status(401).json({ message: 'Invalid authorization code' });
    }
    if (!payload || !payload.username || !payload.role) {
        return res.status(401).json({ message: 'Invalid authorization code' });
    }
    try {
        const accessToken = jwt.sign({ username: payload.username, role: payload.role }, secretKey, { expiresIn: '1h' });
        res.json({ accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/client-token', (req: Request, res: Response) => {
    try {
        const { clientId, clientSecret } = req.body;
        const client = clients.CLIENTS.find((c) => c.id === clientId && c.secret === clientSecret);
        if (!client) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = jwt.sign({ clientId }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error generating access token:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

router.get('/validate', (req: Request, res: Response) => {
    const accessToken = req.header('Authorization');
    try {
        if (!accessToken) {
            return res.status(401).json({ error: 'Access token not provided' });
        }
        const token = accessToken.split('Bearer ')[1];
        jwt.verify(token, secretKey);
        res.json({ valid: true });
    } catch (error) {
        res.json({ valid: false });
    }
});


export default router;
