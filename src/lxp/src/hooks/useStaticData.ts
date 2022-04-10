import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@store/static-data';

export const useStaticData = () => {
  const workflowStatuses = useSelector(staticDataSelectors.getWorkflowStatuses);
  const documentTypes = useSelector(staticDataSelectors.getDocumentTypes);
  const noteTypes = useSelector(staticDataSelectors.getNoteTypes);
  const programmeTypes = useSelector(staticDataSelectors.getProgrammeTypes);

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

  const getProgrammeTypeIdByEnum = (enumId: string) => {
    const type = programmeTypes.find((x) => x.enumId === enumId);
    return type?.id;
  };

  return {
    getWorkflowStatusIdByEnum,
    getDocumentTypeIdByEnum,
    getNoteTypeIdByEnum,
    getProgrammeTypeIdByEnum,
  };
};
