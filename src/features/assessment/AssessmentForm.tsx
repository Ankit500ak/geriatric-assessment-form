import { useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { schemaResolver, useForm } from '@mantine/form';
import dayjs from 'dayjs';
import { assessmentSchema, MOBILITY, type Assessment } from './schema';
import { samplePatient } from './sample';

// 'home_visit' -> 'Home visit'. Built from MOBILITY, so a new value in the
// schema shows up here with no other edit.
const mobilityOptions = MOBILITY.map((value) => ({
  value,
  label: value.replace(/_/g, ' ').replace(/^./, (letter) => letter.toUpperCase()),
}));

const initialValues = {
  mrn: '',
  patientName: '',
  dateOfBirth: '',
  assessmentDate: '',
  mobility: '',
  barthelIndex: '' as number | '',
  medicationCount: '' as number | '',
  pharmacistReviewRequested: false,
  followUpDate: '',
  consentObtained: false,
};

interface AssessmentFormProps {
  onSave?: (values: Assessment) => void;
}

export function AssessmentForm({ onSave }: AssessmentFormProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<Assessment | null>(null);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues,
    validate: schemaResolver(assessmentSchema),
    validateInputOnBlur: true,
  });

  async function handleSubmit(values: typeof form.values) {
    // Validation has already passed, so this parse cannot fail — it turns the
    // raw form state into the typed Assessment the rest of the app works with.
    const parsed = assessmentSchema.parse(values);
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSaving(false);
    setSaved(parsed);
    onSave?.(parsed);
  }

  function loadSample() {
    form.setValues(samplePatient);
    form.clearErrors();
    setSaved(null);
  }

  return (
    <Container size="sm" py="xl">
      <Paper withBorder shadow="xs" radius="md" p="xl">
        <Title order={2}>Geriatric Care Assessment</Title>
        <Text c="dimmed" size="sm" mt={4} mb="lg">
          Home visit assessment for patients aged 60 and over.
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Medical record number"
              placeholder="MRN-004821"
              size="md"
              {...form.getInputProps('mrn')}
            />
            <TextInput
              label="Patient name"
              placeholder="Full name"
              size="md"
              {...form.getInputProps('patientName')}
            />
            <DateInput
              label="Date of birth"
              placeholder="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              size="md"
              {...form.getInputProps('dateOfBirth')}
            />
            <DateInput
              label="Assessment date"
              placeholder="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              maxDate={dayjs().format('YYYY-MM-DD')}
              size="md"
              {...form.getInputProps('assessmentDate')}
            />
            <Select
              label="Mobility"
              placeholder="Select mobility status"
              size="md"
              data={mobilityOptions}
              {...form.getInputProps('mobility')}
            />
            <NumberInput
              label="Barthel Index"
              size="md"
              step={5}
              min={0}
              max={100}
              {...form.getInputProps('barthelIndex')}
            />
            <NumberInput
              label="Regular medications"
              size="md"
              min={0}
              max={30}
              {...form.getInputProps('medicationCount')}
            />
            <Checkbox
              label="Pharmacist review requested"
              size="md"
              {...form.getInputProps('pharmacistReviewRequested', { type: 'checkbox' })}
            />
            <DateInput
              label="Next review date"
              placeholder="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              size="md"
              {...form.getInputProps('followUpDate')}
            />
            <Checkbox
              label="Patient or representative has given consent"
              size="md"
              {...form.getInputProps('consentObtained', { type: 'checkbox' })}
            />
          </Stack>

          <Group mt="xl">
            <Button type="submit" size="md" loading={saving}>
              Save assessment
            </Button>
            <Button type="button" size="md" variant="light" color="gray" onClick={loadSample}>
              Load sample patient
            </Button>
          </Group>
        </form>

        {saved && (
          <Alert color="teal" title="Assessment saved" mt="xl">
            <Code block>{JSON.stringify(saved, null, 2)}</Code>
          </Alert>
        )}
      </Paper>
    </Container>
  );
}
