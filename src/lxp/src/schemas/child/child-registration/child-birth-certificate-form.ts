import * as Yup from 'yup';

export type BirthDocumentationType =
  | 'birthCertificate'
  | 'clinicCard'
  | 'noDocument';

export interface ChildBirthCertificateFormModel {
  childname: string;
  birthCertificateImage: string;
  birthCertificateType: BirthDocumentationType;
  hasChildDocumentation: boolean;
  acceptChildDocumentationDeclaration: boolean;
}

export const childBirthCertificateFormSchema = Yup.object().shape({
  birthCertificateType: Yup.string().when('hasChildDocumentation', {
    is: true,
    then: Yup.string().required(),
  }),
  birthCertificateImage: Yup.string().when('hasChildDocumentation', {
    is: true,
    then: Yup.string().required(),
  }),
  acceptChildDocumentationDeclaration: Yup.bool().when(
    'hasChildDocumentation',
    {
      is: false,
      then: Yup.bool().required().isTrue(),
    }
  ),
});
