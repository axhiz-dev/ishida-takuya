/** Public Formspree form ID. Email remains available when no verified ID is configured. */
export const contactConfig: { formId: string } = {
  formId: process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID || "",
};
