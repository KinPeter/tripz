import { Flex, Select, TextInput } from '@mantine/core';
import { formFlexProps, useFlightFormContext } from '../../../lib/flightFormTools';
import { FlightClass, FlightReason, SeatType } from '../../../types';

export const MiscTab = () => {
  const form = useFlightFormContext();

  return (
    <>
      <Flex {...formFlexProps}>
        <TextInput
          label="Seat number"
          placeholder="e.g. 21C"
          key={form.key('seatNumber')}
          {...form.getInputProps('seatNumber')}
        />
        <Select
          label="Seat type"
          data={[...Object.values(SeatType)]}
          key={form.key('seatType')}
          {...form.getInputProps('seatType')}
        />
        <Select
          label="Flight class"
          data={[...Object.values(FlightClass)]}
          key={form.key('flightClass')}
          {...form.getInputProps('flightClass')}
        />
        <Select
          label="Flight reason"
          data={[...Object.values(FlightReason)]}
          key={form.key('flightReason')}
          {...form.getInputProps('flightReason')}
        />
        <TextInput
          label="Note"
          placeholder=""
          key={form.key('note')}
          {...form.getInputProps('note')}
        />
      </Flex>
    </>
  );
};
