import { render, screen, waitFor } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { AssessmentForm } from './AssessmentForm';
import { samplePatient } from './sample';

describe('AssessmentForm', () => {
  it('loads the sample patient and saves the parsed values', async () => {
    const onSave = vi.fn();
    render(<AssessmentForm onSave={onSave} />);

    await userEvent.click(screen.getByRole('button', { name: 'Load sample patient' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save assessment' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith(samplePatient));
  });
});
