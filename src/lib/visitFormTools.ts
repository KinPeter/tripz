import { ValidationError, Visit, visitSchema } from '@kinpeter/pk-common';
import { createFormContext } from '@mantine/form';
import * as yup from 'yup';

export type FormVisit = Omit<Visit, 'id' | 'createdAt'>;

export const [VisitFormProvider, useVisitFormContext, useVisitForm] =
  createFormContext<FormVisit>();

export function transformVisitValues(values: FormVisit): FormVisit {
  return {
    ...values,
    lat: Number(values.lat),
    lng: Number(values.lng),
  };
}

export const visitInitialValues = {
  city: '',
  country: '',
  lat: 0,
  lng: 0,
};

export const visitFormSchema = visitSchema.shape({
  lat: yup.number().required(ValidationError.NUMBER_REQUIRED),
  lng: yup.number().required(ValidationError.NUMBER_REQUIRED),
});
