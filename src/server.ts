import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Unable to start server: ${message}`);
        process.exitCode = 1;
    });