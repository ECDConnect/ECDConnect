import { ClassroomGroupDto } from '@ecdlink/core';

export function filterUniqueClassrooms(inputArray: ClassroomGroupDto[]) {
  return inputArray.reduce((uniqueItems: ClassroomGroupDto[], currentItem) => {
    const alreadyExists = uniqueItems.find(
      (item) => item.name === currentItem.name
    );
    if (!alreadyExists) {
      uniqueItems.push(currentItem);
    }
    return uniqueItems;
  }, []);
}
