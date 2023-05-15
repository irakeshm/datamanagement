interface Config {
    dataServiceHost: string;
    dataServicePort: number;
}
const config: Config = {
    dataServiceHost: process.env.ENV === 'docker' ? 'http://dataservice' : 'http://localhost',
    dataServicePort: parseInt(process.env.DATA_ERVICE_PORT || '3002', 10)
};

export default config;