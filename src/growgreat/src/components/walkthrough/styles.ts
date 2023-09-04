export const getJoyrideStyles = (
  hideBorder?: boolean,
  hideArrow?: boolean
) => ({
  spotlight: {
    borderWidth: hideBorder ? 0 : 4,
    borderRadius: 20,
    borderColor: '#FF6C00',
    borderStyle: 'solid',
    background: hideBorder ? 'transparent' : 'gray',
  },
  options: {
    arrowColor: hideBorder || hideArrow ? 'transparent' : 'white',
  },
});
