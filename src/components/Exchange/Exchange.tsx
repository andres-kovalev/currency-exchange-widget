import React, { useState } from 'react';
import { NumberField } from '..';

const Exchange: React.FC = () => {
    const [ value, setValue ] = useState(0);

    return (
        <NumberField sign="+" value={ value } onChange={ setValue } />
    );
};

export default Exchange;
