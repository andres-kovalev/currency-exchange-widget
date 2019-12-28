// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncFunction = () => Promise<any>;

/**
 * Function to create a timer calling async function with provided interval
 */
export default function createAsyncTimer(callback: AsyncFunction, timeout: number): () => void {
    let active = true;
    let timeoutId: NodeJS.Timeout;

    const run = async (): Promise<void> => {
        await callback();

        if (active) {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            timeoutId = setTimeout(run, timeout);
        }
    };

    run();

    return (): void => {
        active = false;

        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };
}
