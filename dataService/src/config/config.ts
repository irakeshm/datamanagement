interface Config {
    tokenServiceHost: string;
    tokenServicePort: number;
}
const config: Config = {
    tokenServiceHost: process.env.TOKENS_ERVICE_HOST || 'http://localhost',
    tokenServicePort: parseInt(process.env.TOKENS_ERVICE_PORT || '3001', 10),
};

export default config;
