import express, { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import axios, { AxiosError } from 'axios';
import config from '../config/config';
import { client } from '../config/client';
import validateAccessToken from '../middleware/authentication'
import dataDb from '../db/dataDB';
import App from '../db/Idata';

const tokenServiceHost = config.tokenServiceHost;
const tokenServicePort = config.tokenServicePort;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const router = express.Router();

const secretKey = randomBytes(32).toString('hex');


router.post('/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const authCodeResponse = await axios.post(tokenServiceHost + ':' + tokenServicePort + '/token/auth-code', { username, password });
        const { authCode } = authCodeResponse.data;
        const accessTokenResponse = await axios.post(tokenServiceHost + ':' + tokenServicePort + '/token/access-token', {
            authCode,
            clientId: client.CLIENT[0].id,
            clientSecret: client.CLIENT[0].secret,
        });
        const { accessToken } = accessTokenResponse.data;
        res.json({ accessToken });
    } catch (error) {
        console.log('Error during login:', error);
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                const statusCode = axiosError.response.status;
                if (statusCode === 401) {
                    res.status(401).json({ error: 'Invalid Credentials' });
                } else if (statusCode === 404) {
                    res.status(404).json({ error: 'Not Found' });
                } else {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});


// Get all data
// router.get('/data', validateAccessToken.validateAccessToken, async (req: Request, res: Response) => {
//     try {
//         const data = await dataDb.getAllData();
//         res.json(data);
//     } catch (error) {
//         console.log('Error retrieving data:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

router.get('/data', validateAccessToken.validateAccessToken, async (req: Request, res: Response) => {
    try {
        const { isValid } = req.query;

        if (isValid === 'true') {
            const validData = await dataDb.getValidData();
            res.json(validData);
        } else {
            const data = await dataDb.getAllData();
            res.json(data);
        }
    } catch (error) {
        console.log('Error retrieving data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//Get one record
// router.get('/data/:appName', validateAccessToken.validateAccessToken, async (req: Request, res: Response) => {
//     try {
//         const { appName } = req.params;
//         const data = await dataDb.getDataByName(appName);
//         if (data) {
//             res.json(data);
//         } else {
//             res.status(404).json({ error: 'Record not found' });
//         }
//     } catch (error) {
//         console.log('Error retrieving data:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

router.get('/data/:appName', validateAccessToken.validateAccessToken, async (req: Request, res: Response) => {
    try {
        const { appName } = req.params;
        const { isValid } = req.query;

        if (isValid === 'true') {
            const validData = await dataDb.getValidDataByName(appName);
            if (validData) {
                res.json(validData);
            } else {
                res.status(404).json({ error: 'Record not found' });
            }
        } else {
            const data = await dataDb.getDataByName(appName);
            if (data) {
                res.json(data);
            } else {
                res.status(404).json({ error: 'Record not found' });
            }
        }
    } catch (error) {
        console.log('Error retrieving data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Create new data
router.post('/data', validateAccessToken.validateAccessToken, async (req: Request, res: Response) => {
    try {
        const { appName, appData } = req.body;

        const existingData = await dataDb.getDataByName(appName);
        if (existingData) {
            return res.status(409).json({ error: 'Duplicate appName' });
        }

        // Validate request body fields
        if (!appName || !appData || !appData.appPath || !appData.appOwner || appData.isValid === undefined) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        if (
            !appName ||
            !appData ||
            typeof appName !== 'string' ||
            typeof appData !== 'object' ||
            typeof appData.appPath !== 'string' ||
            typeof appData.appOwner !== 'string' ||
            typeof appData.isValid !== 'boolean'
        ) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        const newData: App = {
            appName,
            appData,
        };

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
            // Validate request body fields
            if (
                !appData ||
                typeof appData !== 'object' ||
                typeof appData.appPath !== 'string' ||
                typeof appData.appOwner !== 'string' ||
                typeof appData.isValid !== 'boolean'
            ) {
                return res.status(400).json({ error: 'Invalid request body' });
            }

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
