
export const handleFormSubmit = async (prevState: any, formData: FormData) => {
  const gender = formData.get("gender") as string;
  console.log(gender)
};

