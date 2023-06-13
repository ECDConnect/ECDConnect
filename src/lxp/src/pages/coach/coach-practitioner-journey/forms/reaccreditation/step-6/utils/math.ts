export interface CalculateCapacityProps {
  shortSide: number;
  longSide: number;
  numberOfAssistants: number;
  programType: 'dayMother' | 'playgroup' | 'preschool';
}

export function calculateTotalSquareMeters(
  shortSide: number,
  longSide: number
): number {
  const totalSquareMeters = (shortSide * longSide) / 10000; // Divide by 10000 to convert from cm^2 to m^2
  return totalSquareMeters;
}

export function calculateCapacity({
  longSide,
  numberOfAssistants,
  shortSide,
  programType,
}: CalculateCapacityProps): number {
  const floorSpace = calculateTotalSquareMeters(shortSide, longSide);
  const floorSpaceCapacity = Math.floor(floorSpace);

  const programTypeCapacities = {
    dayMother: 6,
    playgroup: 12,
    preschool: 20,
  };

  const numberOfAdults = numberOfAssistants + 1;
  const adultCapacity = numberOfAdults * 10;

  const capacities = [
    floorSpaceCapacity,
    programTypeCapacities[programType],
    adultCapacity,
  ];
  const capacity = Math.min(...capacities);

  return capacity;
}
