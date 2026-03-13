const APPOINTMENT_START_HOUR = 9;
const APPOINTMENT_END_HOUR = 18;
const APPOINTMENT_SLOT_MINUTES = 30;

const padTime = (value: number): string => String(value).padStart(2, '0');

const buildAppointmentTimeOptions = (): string[] => {
  const slots: string[] = [];

  for (
    let totalMinutes = APPOINTMENT_START_HOUR * 60;
    totalMinutes <= APPOINTMENT_END_HOUR * 60;
    totalMinutes += APPOINTMENT_SLOT_MINUTES
  ) {
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    slots.push(`${padTime(hour)}:${padTime(minute)}`);
  }

  return slots;
};

export const APPOINTMENT_TIME_OPTIONS = buildAppointmentTimeOptions();
