import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@store/static-data';
import { LanguageDto } from '@ecdlink/core';

export const useStaticData = () => {
  const workflowStatuses = useSelector(staticDataSelectors.getWorkflowStatuses);
  const documentTypes = useSelector(staticDataSelectors.getDocumentTypes);
  const noteTypes = useSelector(staticDataSelectors.getNoteTypes);
  const programmeTypes = useSelector(staticDataSelectors.getProgrammeTypes);
  const languages = useSelector(staticDataSelectors.getLanguages);

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

  const getLanguagesByIds = (languageIds: string): LanguageDto[] => {
    const ids = languageIds.split(',').map((id) => id.trim());
    return languages.filter((lang) => ids.includes(lang.id || ''));
  };

  return {
    getWorkflowStatusIdByEnum,
    getDocumentTypeIdByEnum,
    getNoteTypeIdByEnum,
    getProgrammeTypeIdByEnum,
    getLanguagesByIds,
  };
};
