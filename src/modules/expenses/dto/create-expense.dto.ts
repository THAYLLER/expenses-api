import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';

export const CreateExpenseSchema = z.object({
  title: z.string().nonempty(),
  amount: z.number().positive(),
  category: z.string().nonempty(),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
});

export class CreateExpenseDto extends createZodDto(CreateExpenseSchema) {}
