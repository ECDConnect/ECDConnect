import { render } from '@testing-library/react';
import { ArticleProps } from './article.types';
import { Article } from './article';

describe('Article', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Article />);
    expect(baseElement).toBeTruthy();
  });
});
