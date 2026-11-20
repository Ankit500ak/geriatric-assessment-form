import dayjs from 'dayjs';
import { useState } from 'react';
import {
  IconAccessible,
  IconActivity,
  IconCalendar,
  IconCalendarPlus,
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
  icon: Icon,
  title,
  description,
}: {
  icon: typeof IconUser;
  title: string;
  description: string;
}) {
  return (
    <Group gap="sm" mb="md">
      <ThemeIcon variant="light" color="teal" radius="md" size="lg">
        <Icon size={19} stroke={1.8} />
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
    // Controlled on purpose: with the uncontrolled default, setValues (the
    // sample-patient button) updates the state but does not repaint the
    // date, select, number and checkbox inputs.
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
        pt="xl"
        pb={76}
        style={{
          position: 'relative',
          overflow: 'hidden',
          background:
            'linear-gradient(135deg, var(--mantine-color-teal-9) 0%, var(--mantine-color-teal-6) 100%)',
        }}
      >
        {/* Soft decorative circles in the header band. */}
        <Box
          aria-hidden
          style={{
            position: 'absolute',
            top: -70,
            right: -50,
            width: 230,
            height: 230,
            borderRadius: '50%',
            background: 'rgb(255 255 255 / 8%)',
          }}
        />
        <Box
          aria-hidden
          style={{
            position: 'absolute',
            bottom: -90,
            left: '38%',
            width: 170,
            height: 170,
            borderRadius: '50%',
            background: 'rgb(255 255 255 / 6%)',
          }}
        />
        <Container size="sm" style={{ position: 'relative' }}>
          <Group gap="md" wrap="nowrap">
            <ThemeIcon size={52} radius="xl" variant="white" color="teal">
              <IconStethoscope size={28} stroke={1.6} />
            </ThemeIcon>
            <div>
              <Title order={1} c="white" size="h2">
                Geriatric Care Assessment
              </Title>
              <Text c="teal.0" size="sm" mt={2}>
                Home visit assessment for patients aged 60 and over.
              </Text>
            </div>
          </Group>
          <Badge variant="white" color="teal" mt="md" size="md">
            Elderly home care · Nurse visit record
          </Badge>
        </Container>
      </Box>

      <Container size="sm" style={{ marginTop: -52 }} pb="xl">
        <Paper withBorder shadow="sm" radius="lg" p="xl">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="lg">
              <Box p="lg" style={{ borderRadius: 'var(--mantine-radius-lg)' }} bg="gray.0">
                <SectionHeading
                  icon={IconUser}
                  title="Patient details"
                  description="Who the visit is for"
                />
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
              </Box>

              <Box p="lg" style={{ borderRadius: 'var(--mantine-radius-lg)' }} bg="gray.0">
                <SectionHeading
                  icon={IconStethoscope}
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
              </Box>

              <Box p="lg" style={{ borderRadius: 'var(--mantine-radius-lg)' }} bg="gray.0">
                <SectionHeading
                  icon={IconCalendarPlus}
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
              </Box>

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
            </Stack>
          </form>

          {saved && <AssessmentCard assessment={saved} />}
        </Paper>

        <Text ta="center" size="xs" c="dimmed" mt="md">
          Demo form — no patient information is stored or sent anywhere.
        </Text>
      </Container>
    </>
  );
}
