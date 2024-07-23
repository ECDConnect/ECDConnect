// League management (1 Aug to 30 Sep))
export const checkIfIsNextSeasonManagement = () => {
  const today = new Date();
  const currentYear = today.getFullYear();

  const startDateNextSeasonManagement = new Date(currentYear, 7, 1)
    .toISOString()
    .replace('Z', '');
  const endDateNextSeasonManagement = new Date(currentYear, 8, 30)
    .toISOString()
    .replace('Z', '');

  return (
    today >= new Date(startDateNextSeasonManagement) &&
    today <= new Date(endDateNextSeasonManagement)
  );
};
