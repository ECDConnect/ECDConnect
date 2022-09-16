import * as Yup from 'yup';

export interface MessageBoardModel {
  message: string;
}

export const messageBoardSchema = Yup.object().shape({
  message: Yup.string().required(),
});
