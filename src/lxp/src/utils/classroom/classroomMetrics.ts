export interface ClassroomMetrics {
  area: string;
  assistants: number;
  capacity: number;
  shortSideCm?: number;
  longSideCm?: number;
}

export const computeClassroomMetrics = (
  questions: any[]
): ClassroomMetrics | null => {
  const shortQ = questions.find(
    (q) => q.name === 'How many cms is the short side of the room?'
  );
  const longQ = questions.find(
    (q) => q.name === 'How many cms is the long side of the room?'
  );
  const assQ = questions.find(
    (q) => q.name === 'How many assistants support this class?'
  );

  if (!shortQ || !longQ || !assQ) return null;

  const shortCm = shortQ.answer ? Number(shortQ.answer.trim()) : NaN;
  const longCm = longQ.answer ? Number(longQ.answer.trim()) : NaN;
  const assistants = assQ.answer ? Number(assQ.answer.trim()) : NaN;

  if (isNaN(shortCm) || isNaN(longCm) || isNaN(assistants)) return null;

  const areaM2 = (shortCm / 100) * (longCm / 100);

  // Show 1 decimal only when needed
  const formattedArea = (() => {
    const fixed = areaM2.toFixed(1);
    return fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
  })();

  const areaForCapacity = Math.floor(areaM2);
  const adultCapacity = (assistants + 1) * 10;
  const capacity = Math.min(areaForCapacity, adultCapacity);

  return {
    area: formattedArea,
    assistants,
    capacity,
    shortSideCm: shortCm,
    longSideCm: longCm,
  };
};
