import dayjs from 'dayjs';
import { useState } from 'react';
import {
  IconAccessible,
  IconActivity,
  IconCalendar,
  IconCheck,
  IconHash,
  IconPill,
  IconStethoscope,
  IconUser,
} from '@tabler/icons-react';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Group,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { schemaResolver, useForm } from '@mantine/form';
import { AssessmentCard } from './AssessmentCard';
import { samplePatient } from './sample';
import { assessmentSchema, MOBILITY, mobilityLabel, type Assessment } from './schema';

// Options are built from MOBILITY, so a new value in the schema shows up
// here with no other edit.
const mobilityOptions = MOBILITY.map((value) => ({ value, label: mobilityLabel(value) }));

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

function SectionHeading({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <Group gap="sm" mb="md">
      <ThemeIcon size={26} radius="xl" color="teal">
        <Text size="xs" fw={700} c="white">
          {step}
        </Text>
      </ThemeIcon>
      <div>
        <Title order={4}>{title}</Title>
        <Text size="xs" c="dimmed">
          {description}
        </Text>
      </div>
    </Group>
  );
}

export function AssessmentForm({ onSave }: AssessmentFormProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<Assessment | null>(null);

  const form = useForm({
    // Controlled mode, so "Load sample patient" repaints every input.
    mode: 'controlled',
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
    <>
      <Box
        component="header"
        bg="white"
        style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
      >
        <Container size="sm" py="sm">
          <Group justify="space-between">
            <Group gap="sm" wrap="nowrap">
              <ThemeIcon size={38} radius="md" color="teal">
                <IconStethoscope size={22} stroke={1.7} />
              </ThemeIcon>
              <div>
                <Text fw={700} lh={1.15}>
                  Geriatric Care Assessment
                </Text>
                <Text size="xs" c="dimmed">
                  Home visit · Patients aged 60 and over
                </Text>
              </div>
            </Group>
            <Badge variant="light" color="teal" size="md">
              Nurse visit record
            </Badge>
          </Group>
        </Container>
      </Box>

      <Container size="sm" py="xl">
        <Paper withBorder shadow="sm" radius="lg" p="xl">
          <Title order={3}>New assessment</Title>
          <Text size="sm" c="dimmed" mb="xl">
            Fill in the details from today's home visit.
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <SectionHeading step={1} title="Patient details" description="Who the visit is for" />
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label="Medical record number"
                  placeholder="MRN-004821"
                  size="md"
                  radius="md"
                  leftSection={<IconHash size={18} stroke={1.5} />}
                  {...form.getInputProps('mrn')}
                />
                <DateInput
                  label="Date of birth"
                  placeholder="YYYY-MM-DD"
                  valueFormat="YYYY-MM-DD"
                  size="md"
                  radius="md"
                  leftSection={<IconCalendar size={18} stroke={1.5} />}
                  {...form.getInputProps('dateOfBirth')}
                />
              </SimpleGrid>
              <TextInput
                label="Patient name"
                placeholder="Full name"
                size="md"
                radius="md"
                leftSection={<IconUser size={18} stroke={1.5} />}
                {...form.getInputProps('patientName')}
              />
            </Stack>

            <Divider my="xl" />

            <SectionHeading
              step={2}
              title="Today's assessment"
              description="Recorded by the visiting nurse"
            />
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <DateInput
                  label="Assessment date"
                  placeholder="YYYY-MM-DD"
                  valueFormat="YYYY-MM-DD"
                  maxDate={dayjs().format('YYYY-MM-DD')}
                  size="md"
                  radius="md"
                  leftSection={<IconCalendar size={18} stroke={1.5} />}
                  {...form.getInputProps('assessmentDate')}
                />
                <Select
                  label="Mobility"
                  placeholder="Select mobility status"
                  size="md"
                  radius="md"
                  leftSection={<IconAccessible size={18} stroke={1.5} />}
                  data={mobilityOptions}
                  {...form.getInputProps('mobility')}
                />
                <NumberInput
                  label="Barthel Index"
                  description="Independence in daily activities, scored 0–100 in steps of 5"
                  size="md"
                  radius="md"
                  leftSection={<IconActivity size={18} stroke={1.5} />}
                  step={5}
                  min={0}
                  max={100}
                  {...form.getInputProps('barthelIndex')}
                />
                <NumberInput
                  label="Regular medications"
                  description="Medicines the patient takes every day"
                  size="md"
                  radius="md"
                  leftSection={<IconPill size={18} stroke={1.5} />}
                  min={0}
                  max={30}
                  {...form.getInputProps('medicationCount')}
                />
              </SimpleGrid>
              <Checkbox
                label="Pharmacist review requested"
                size="md"
                {...form.getInputProps('pharmacistReviewRequested', { type: 'checkbox' })}
              />
            </Stack>

            <Divider my="xl" />

            <SectionHeading
              step={3}
              title="Follow-up & consent"
              description="Next steps after this visit"
            />
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <DateInput
                  label="Next review date"
                  placeholder="YYYY-MM-DD"
                  valueFormat="YYYY-MM-DD"
                  size="md"
                  radius="md"
                  leftSection={<IconCalendar size={18} stroke={1.5} />}
                  {...form.getInputProps('followUpDate')}
                />
              </SimpleGrid>
              <Checkbox
                label="Patient or representative has given consent"
                size="md"
                {...form.getInputProps('consentObtained', { type: 'checkbox' })}
              />
            </Stack>

            <Divider my="xl" />

            <Group>
              <Button
                type="submit"
                size="md"
                radius="md"
                loading={saving}
                leftSection={<IconCheck size={18} />}
              >
                Save assessment
              </Button>
              <Button
                type="button"
                size="md"
                radius="md"
                variant="light"
                color="gray"
                onClick={loadSample}
              >
                Load sample patient
              </Button>
            </Group>
          </form>

          {saved && <AssessmentCard assessment={saved} />}
        </Paper>

        <Text ta="center" size="xs" c="dimmed" mt="lg">
          Geriatric Care Assessment · Home Visit Programme
        </Text>
      </Container>
    </>
  );
}
