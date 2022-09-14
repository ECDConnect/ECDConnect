import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@store/static-data';

export const useStaticData = () => {
  const workflowStatuses = useSelector(staticDataSelectors.getWorkflowStatuses);
  const documentTypes = useSelector(staticDataSelectors.getDocumentTypes);
  const noteTypes = useSelector(staticDataSelectors.getNoteTypes);

  const getWorkflowStatusIdByEnum = (enumId: string) => {
    const type = workflowStatuses.find((x) => x.enumId === enumId);
    return type?.id;
  };

  const getDocumentTypeIdByEnum = (enumId: string) => {
    const type = documentTypes.find((x) => x.enumId === enumId);
    return type?.id;
  };

  const getNoteTypeIdByEnum = (enumId: string) => {
    const type = noteTypes.find((x) => x.enumId === enumId);
    return type?.id;
  };

  return {
    getWorkflowStatusIdByEnum,
    getDocumentTypeIdByEnum,
    getNoteTypeIdByEnum,
  };
};
