import { createFormContext } from '@mantine/form';
import * as yup from 'yup';
import { Visit } from '../types';
import { visitSchema } from './visitValidators';
import { ValidationError } from './constants';

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
  year: new Date().getFullYear().toString(),
  lat: 0,
  lng: 0,
};

export const visitFormSchema = visitSchema.shape({
  lat: yup.number().required(ValidationError.NUMBER_REQUIRED),
  lng: yup.number().required(ValidationError.NUMBER_REQUIRED),
});
