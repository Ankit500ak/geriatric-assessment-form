import { render, screen, waitFor } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { AssessmentForm } from './AssessmentForm';
import { samplePatient } from './sample';

describe('AssessmentForm', () => {
  it('loads the sample patient and saves the parsed values', async () => {
    const onSave = vi.fn();
    render(<AssessmentForm onSave={onSave} />);

    await userEvent.click(screen.getByRole('button', { name: 'Load sample patient' }));

    // The loaded values must show in the inputs, not just in form state.
    expect(screen.getByLabelText('Barthel Index')).toHaveValue('80');
    expect(screen.getByRole('combobox', { name: 'Mobility' })).toHaveValue('Cane');
    expect(screen.getByLabelText('Date of birth')).toHaveValue('1949-03-12');

    await userEvent.click(screen.getByRole('button', { name: 'Save assessment' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith(samplePatient));
  });
});
