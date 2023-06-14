import { calculateCapacity } from './math';

describe.only('calculateCapacity', () => {
  it('should calculate the capacity with 0 assistants', () => {
    const capacity = calculateCapacity({
      shortSide: 410,
      longSide: 500,
      numberOfAssistants: 0,
      programType: 'playgroup',
    });
    expect(capacity).toBe(10);
  });

  it('should calculate the capacity with program type day mother', () => {
    const capacity = calculateCapacity({
      shortSide: 410,
      longSide: 500,
      numberOfAssistants: 1,
      programType: 'dayMother',
    });
    expect(capacity).toBe(6);
  });

  it('should calculate the capacity with program type preschool', () => {
    const capacity = calculateCapacity({
      shortSide: 410,
      longSide: 500,
      numberOfAssistants: 1,
      programType: 'preschool',
    });
    expect(capacity).toBe(20);
  });

  it('should calculate the capacity with less floor space', () => {
    const capacity = calculateCapacity({
      shortSide: 205,
      longSide: 800,
      numberOfAssistants: 1,
      programType: 'preschool',
    });
    expect(capacity).toBe(16);
  });
});
