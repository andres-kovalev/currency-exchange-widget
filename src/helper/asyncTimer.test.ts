import createAsyncTimer from './asyncTimer';

jest.useFakeTimers();

describe('createAsyncTimer', () => {
    it('should run callback', () => {
        const callback = jest.fn(() => Promise.resolve());

        createAsyncTimer(callback, 1000);

        expect(callback).toHaveBeenCalled();
    });

    it('should run callback again after TIMEOUT seconds but only after previous run completed', async () => {
        const callback = createCallbackSpy();

        createAsyncTimer(callback, 1000);

        expect(callback).toHaveBeenCalledTimes(1);

        jest.runAllTimers();

        expect(callback).toHaveBeenCalledTimes(1);

        await callback.wait();

        jest.runAllTimers();

        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should not run callback again when timer disabled', async () => {
        const callback = createCallbackSpy();

        const stop = createAsyncTimer(callback, 1000);

        expect(callback).toHaveBeenCalledTimes(1);

        stop();

        await callback.wait();

        jest.runAllTimers();

        expect(callback).toHaveBeenCalledTimes(1);
    });
});

interface CallbackSpy {
    (): Promise<unknown>;
    wait: () => Promise<unknown>;
}

function createCallbackSpy(): CallbackSpy {
    const callback: CallbackSpy = Object.assign(jest.fn(() => {
        let resolvePromise: () => void;
        const promise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        callback.wait = (): Promise<unknown> => {
            resolvePromise();

            return promise;
        };

        return promise;
    }), { wait: () => Promise.resolve() });

    return callback;
}
