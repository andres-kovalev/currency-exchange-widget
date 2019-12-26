import React from 'react';
import { shallow } from 'enzyme';

import useUpdate from './useUpdate';

describe('useUpdate', () => {
    it('should return function for force update', () => {
        const Component: Function = jest.fn(() => {
            const update = useUpdate();

            return (
                <button onClick={ update } />
            );
        });
        const wrapper = shallow(<Component />);

        expect(Component).toHaveBeenCalledTimes(1);

        wrapper.find('button').simulate('click');

        expect(Component).toHaveBeenCalledTimes(2);

        wrapper.find('button').simulate('click');

        expect(Component).toHaveBeenCalledTimes(3);
    });
});
