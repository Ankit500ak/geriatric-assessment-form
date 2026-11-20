import dayjs from 'dayjs';
import { useState } from 'react';
import {
  IconAccessible,
  IconActivity,
  IconCalendar,
  IconCalendarPlus,
  IconCheck,
  IconCircleCheck,
  IconHash,
  IconPill,
  IconStethoscope,
  IconUser,
} from '@tabler/icons-react';
import {
  Alert,
  Badge,
  Box,
  Button,
  Checkbox,
  Code,
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
import { samplePatient } from './sample';
import { assessmentSchema, MOBILITY, type Assessment } from './schema';

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
    <>
      <Box
        component="header"
        pt="xl"
        pb={76}
        style={{
          background:
            'linear-gradient(135deg, var(--mantine-color-teal-9) 0%, var(--mantine-color-teal-6) 100%)',
        }}
      >
        <Container size="sm">
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
          <Badge color="white" variant="light" c="teal.9" mt="md" size="md">
            Elderly home care · Nurse visit record
          </Badge>
        </Container>
      </Box>

      <Container size="sm" style={{ marginTop: -52 }} pb="xl">
        <Paper withBorder shadow="sm" radius="lg" p="xl">
          <form onSubmit={form.onSubmit(handleSubmit)}>
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
                  leftSection={<IconHash size={18} stroke={1.5} />}
                  {...form.getInputProps('mrn')}
                />
                <DateInput
                  label="Date of birth"
                  placeholder="YYYY-MM-DD"
                  valueFormat="YYYY-MM-DD"
                  size="md"
                  leftSection={<IconCalendar size={18} stroke={1.5} />}
                  {...form.getInputProps('dateOfBirth')}
                />
              </SimpleGrid>
              <TextInput
                label="Patient name"
                placeholder="Full name"
                size="md"
                leftSection={<IconUser size={18} stroke={1.5} />}
                {...form.getInputProps('patientName')}
              />
            </Stack>

            <Divider my="xl" />

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
                  leftSection={<IconCalendar size={18} stroke={1.5} />}
                  {...form.getInputProps('assessmentDate')}
                />
                <Select
                  label="Mobility"
                  placeholder="Select mobility status"
                  size="md"
                  leftSection={<IconAccessible size={18} stroke={1.5} />}
                  data={mobilityOptions}
                  {...form.getInputProps('mobility')}
                />
                <NumberInput
                  label="Barthel Index"
                  description="Independence in daily activities, scored 0–100 in steps of 5"
                  size="md"
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
                loading={saving}
                leftSection={<IconCheck size={18} />}
              >
                Save assessment
              </Button>
              <Button type="button" size="md" variant="light" color="gray" onClick={loadSample}>
                Load sample patient
              </Button>
            </Group>
          </form>

          {saved && (
            <Alert color="teal" title="Assessment saved" mt="xl" icon={<IconCircleCheck />}>
              <Code block>{JSON.stringify(saved, null, 2)}</Code>
            </Alert>
          )}
        </Paper>

        <Text ta="center" size="xs" c="dimmed" mt="md">
          Demo form — no patient information is stored or sent anywhere.
        </Text>
      </Container>
    </>
  );
}
