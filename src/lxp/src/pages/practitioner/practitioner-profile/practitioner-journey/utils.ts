import { VisitData } from '@ecdlink/graphql';
import { Question, SectionQuestions } from './forms/dynamic-form';

export const getSectionQuestions = (data?: VisitData[]) => {
  // Grouping by visitSection
  const groupedArray = data?.reduce((result, obj) => {
    const section = obj.visitSection;

    // Check if the section already exists in the result
    const existingSection = result.find(
      (item) => item.visitSection === section
    );

    // Create a new question based on the current object
    const question: Question = {
      question: obj.question!,
      answer: obj.questionAnswer!,
    };

    if (existingSection) {
      // Check if the question already exists in the existing section
      const existingQuestion = existingSection.questions.find(
        (item) => item.question === question.question
      );

      if (!existingQuestion) {
        // Add the question to the existing section if it doesn't already exist
        existingSection.questions.push(question);
      }
    } else {
      // Create a new section with the question
      const newSection: SectionQuestions = {
        visitSection: section!,
        questions: [question],
      };
      result.push(newSection);
    }

    return result;
  }, [] as SectionQuestions[]);

  return groupedArray;
};
