import dayjs from 'dayjs';
import { IconCircleCheck, IconStethoscope } from '@tabler/icons-react';
import { Badge, Box, Group, SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import { mobilityLabel, type Assessment } from './schema';

function CardField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text size="xs" tt="uppercase" fw={600} c="teal.2" style={{ letterSpacing: 0.8 }}>
        {label}
      </Text>
      <Text fw={600} c="white" mt={2}>
        {value}
      </Text>
    </div>
  );
}

/**
 * The saved assessment, presented as a patient record card. The entrance
 * animation and light sweep live in index.css (.assessment-card).
 */
export function AssessmentCard({ assessment }: { assessment: Assessment }) {
  const date = (iso: string) => dayjs(iso).format('DD MMM YYYY');

  return (
    <Box
      className="assessment-card"
      mt="xl"
      p="xl"
      style={{
        borderRadius: 'var(--mantine-radius-lg)',
        background:
          'linear-gradient(120deg, var(--mantine-color-teal-9) 0%, var(--mantine-color-teal-7) 55%, var(--mantine-color-teal-6) 100%)',
        boxShadow: 'var(--mantine-shadow-lg)',
      }}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size={40} radius="xl" variant="white" color="teal">
            <IconStethoscope size={22} stroke={1.7} />
          </ThemeIcon>
          <div>
            <Text fw={700} c="white" lh={1.15}>
              Geriatric Care Assessment
            </Text>
            <Text size="xs" c="teal.1" tt="uppercase" style={{ letterSpacing: 1 }}>
              Home visit record card
            </Text>
          </div>
        </Group>
        <Badge variant="white" color="teal" leftSection={<IconCircleCheck size={13} />}>
          Saved
        </Badge>
      </Group>

      <Text size="xs" tt="uppercase" fw={600} c="teal.2" mt="xl" style={{ letterSpacing: 0.8 }}>
        Patient name
      </Text>
      <Text fw={700} c="white" size="xl" lh={1.2}>
        {assessment.patientName}
      </Text>

      <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="lg" mt="lg">
        <CardField label="MRN" value={assessment.mrn} />
        <CardField label="Date of birth" value={date(assessment.dateOfBirth)} />
        <CardField label="Assessment date" value={date(assessment.assessmentDate)} />
        <CardField label="Mobility" value={mobilityLabel(assessment.mobility)} />
        <CardField label="Barthel Index" value={`${assessment.barthelIndex} / 100`} />
        <CardField label="Medications" value={String(assessment.medicationCount)} />
        <CardField label="Next review" value={date(assessment.followUpDate)} />
        <CardField
          label="Pharmacist review"
          value={assessment.pharmacistReviewRequested ? 'Requested' : 'Not requested'}
        />
        <CardField label="Consent" value="Given" />
      </SimpleGrid>

      <Group justify="space-between" align="flex-end" mt="xl">
        {/* Card chip, purely decorative. */}
        <Box
          aria-hidden
          w={42}
          h={30}
          style={{
            borderRadius: 7,
            background: 'linear-gradient(135deg, #ffe08a 0%, #d9a62e 100%)',
            boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / 15%)',
          }}
        />
        {/* Scannable strip, purely decorative. */}
        <Box
          aria-hidden
          w={132}
          h={34}
          style={{
            borderRadius: 4,
            background:
              'repeating-linear-gradient(90deg, #fff 0 10px, var(--mantine-color-teal-9) 10px 12px, #fff 12px 15px, var(--mantine-color-teal-9) 15px 18px, #fff 18px 27px, var(--mantine-color-teal-9) 27px 28px, #fff 28px 33px, var(--mantine-color-teal-9) 33px 36px)',
          }}
        />
      </Group>
    </Box>
  );
}
