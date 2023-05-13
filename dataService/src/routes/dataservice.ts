import express, { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import axios from 'axios';
import config from '../config/config';
import { client } from '../config/client';
import validateAccessToken from '../middleware/authentication'
import dataDb from '../db/dataDB';


// Access the API host and port from the configuration
const tokenServiceHost = config.tokenServiceHost;
const tokenServicePort = config.tokenServicePort;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const router = express.Router();

const secretKey = randomBytes(32).toString('hex');


router.post('/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        // Call token service to generate auth code
        const authCodeResponse = await axios.post(tokenServiceHost + ':' + tokenServicePort + '/token/auth-code', { username, password });
        const { authCode } = authCodeResponse.data;
        // Call token service to generate access token
        const accessTokenResponse = await axios.post(tokenServiceHost + ':' + tokenServicePort + '/token/access-token', {
            authCode,
            clientId: client.CLIENT[0].id,
            clientSecret: client.CLIENT[0].secret,
        });
        const { accessToken } = accessTokenResponse.data;
        res.json({ accessToken });
    } catch (error) {
        console.log('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all data
router.get('/data', validateAccessToken.validateAccessToken, async (req: Request, res: Response) => {
    try {
        const data = await dataDb.getAllData();
        res.json(data);
    } catch (error) {
        console.log('Error retrieving data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new data
router.post('/data', validateAccessToken.validateAccessToken, async (req: Request, res: Response) => {
    try {
        const { appName, appData } = req.body;
        const newData = { appName, appData };
        const createdData = await dataDb.createData(newData);
        res.json(createdData);
    } catch (error) {
        console.log('Error creating data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update existing data
router.put('/data/:appName', validateAccessToken.validateAccessToken, async (req: Request, res: Response) => {
    try {
        const { appName } = req.params;
        const { appData } = req.body;
        const existingData = await dataDb.getDataByName(appName);

        if (existingData) {
            existingData.appData = appData;
            const updatedData = await dataDb.updateData(existingData);
            if (updatedData) {
                res.json(updatedData);
            } else {
                res.status(404).json({ error: 'Data not found' });
            }
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.log('Error updating data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete data
router.delete('/data/:appName', validateAccessToken.validateAccessToken, async (req: Request, res: Response) => {
    try {
        const { appName } = req.params;
        const success = await dataDb.deleteData(appName);

        if (success) {
            res.json({ message: 'Data deleted successfully' });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.log('Error deleting data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
