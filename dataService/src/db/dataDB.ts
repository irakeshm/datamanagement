import fs from 'fs';
import { promisify } from 'util';
import App from './Idata'
import path from 'path';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const dataFilePath = path.resolve(__dirname, 'data.json');

class DataDb {
    private data: App[] = [];

    constructor() {
        this.loadData();
    }
    private async loadData() {
        try {
            const fileContent = await readFile(dataFilePath, 'utf-8');
            this.data = JSON.parse(fileContent);
        } catch (error) {
            console.log('Error loading data:', error);
        }
    }

    private async saveData() {
        try {
            await writeFile(dataFilePath, JSON.stringify(this.data, null, 2), 'utf-8');
        } catch (error) {
            console.log('Error saving data:', error);
        }
    }

    async getAllData(): Promise<App[]> {
        return this.data;
    }

    async createData(newData: App): Promise<App> {
        this.data.push(newData);
        await this.saveData();
        return newData;
    }

    async getDataByName(appName: string): Promise<App | null> {
        const app = this.data.find((item) => item.appName === appName);
        return app || null;
    }

    async updateData(updatedData: App): Promise<App | null> {
        const index = this.data.findIndex((item) => item.appName === updatedData.appName);
        if (index !== -1) {
            this.data[index] = updatedData;
            await this.saveData();
            return updatedData;
        }
        return null;
    }

    async deleteData(appName: string): Promise<boolean> {
        const index = this.data.findIndex((item) => item.appName === appName);
        if (index !== -1) {
            this.data.splice(index, 1);
            await this.saveData();
            return true;
        }
        return false;
    }
}

export default new DataDb();
