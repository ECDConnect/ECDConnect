import App from '@/App';
import { render } from '@testing-library/react';

test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});
