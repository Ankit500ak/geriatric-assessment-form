import { samplePatient } from './sample';
import { assessmentSchema } from './schema';

describe('assessmentSchema — age 60 rule', () => {
  it('accepts a patient who turns 60 on the assessment date', () => {
    const result = assessmentSchema.safeParse({ ...samplePatient, dateOfBirth: '1966-08-07' });
    expect(result.success).toBe(true);
  });

  it('rejects a patient one day short of 60, with the error on dateOfBirth', () => {
    const result = assessmentSchema.safeParse({ ...samplePatient, dateOfBirth: '1966-08-08' });
    expect(result.success).toBe(false);
    const issues = result.success ? [] : result.error.issues;
    const issue = issues.find((i) => i.path.includes('dateOfBirth'));
    expect(issue?.message).toBe('This pathway is for patients aged 60 and over');
  });
});
