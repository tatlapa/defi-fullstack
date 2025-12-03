import { Field, Input, Textarea } from "@chakra-ui/react";
import { forwardRef } from "react";
import type { InputProps, TextareaProps } from "@chakra-ui/react";

/**
 * Composant Field compatible avec React Hook Form
 * Affiche le label, l'input et les messages d'erreur de validation
 */
interface FormFieldProps extends Omit<InputProps & TextareaProps, 'ref'> {
  label: string;
  error?: string;
  isTextarea?: boolean;
}

export const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormFieldProps
>(({ label, error, type = "text", placeholder, rows, isTextarea = false, ...rest }, ref) => {
  return (
    <Field.Root invalid={!!error}>
      <Field.Label>{label}</Field.Label>
      {isTextarea ? (
        <Textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          placeholder={placeholder}
          rows={rows}
          {...rest}
        />
      ) : (
        <Input
          ref={ref as React.Ref<HTMLInputElement>}
          type={type}
          placeholder={placeholder}
          {...rest}
        />
      )}
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  );
});

FormField.displayName = "FormField";
