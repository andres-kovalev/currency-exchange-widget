import { round, floor } from './math';

describe('math', () => {
    describe('round', () => {
        it('should round number to provided precision', () => {
            expect(round(0.55555, 3)).toBe(0.556);
        });

        it('should round number to 2 decimals by default', () => {
            expect(round(0.55555)).toBe(0.56);
        });
    });

    describe('floor', () => {
        it('should floor number to provided precision', () => {
            expect(floor(0.55555, 3)).toBe(0.555);
        });

        it('should floor number to 2 decimals by default', () => {
            expect(floor(0.55555)).toBe(0.55);
        });
    });
});
