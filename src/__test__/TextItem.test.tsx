import React from 'react';
import ReactDOM from 'react-dom';
import { TextItem } from 'ObjectVisualisation/Item/TextItem';
import { getByTestId } from '@testing-library/react';



describe('TextItem component tests', () => {
    test('component TextItem renders correctly', async () => {
        const div = document.createElement('div');
        ReactDOM.render(<TextItem
            position={{ x: 0, y: 0 }}
            text={'test'}
            option={'test'}
            setGroupedOption={() => { }}
            type={undefined} />,
            div);
        expect(getByTestId(div, 'text')).toBeTruthy;
    });
});