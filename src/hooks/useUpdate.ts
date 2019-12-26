import { useState, useCallback } from 'react';

/**
 * Custom hook to provide forceUpdate() function
 */
export default function useUpdate(): () => void {
    const [ , setState ] = useState(0);

    return useCallback(() => setState(
        (state) => state + 1
    ), []);
}
