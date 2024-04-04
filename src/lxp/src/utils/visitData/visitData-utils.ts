import { SmartSpaceVisitData } from '@/store/trainee/trainee.types';
import { CmsVisitSectionInput } from '@ecdlink/graphql';

export const mapVisitDataToVisitSections = (
  visitData: SmartSpaceVisitData[]
) => {
  const sections = visitData.reduce((result, item) => {
    const updatedSection = result.find(
      (section) => item.visitSection === section.visitSection
    ) || {
      visitSection: item.visitSection,
      questions: [],
    };

    updatedSection.questions?.push({
      question: item.question,
      answer: item.questionAnswer,
    });

    return [
      ...result.filter((section) => item.visitSection !== section.visitSection),
      updatedSection,
    ];
  }, [] as CmsVisitSectionInput[]);

  return sections;
};
