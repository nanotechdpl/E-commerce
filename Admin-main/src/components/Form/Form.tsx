import { Form } from "antd";
import { ReactNode } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
  DefaultValues,
} from "react-hook-form";

type TFormConfig<T> = {
  defaultValues?: DefaultValues<T>;
  resolver?: any;
};

type TFormProps<T extends FieldValues> = {
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  className?: string;
} & TFormConfig<T>;

const CustomForm = <T extends FieldValues>({
  onSubmit,
  children,
  defaultValues,
  resolver,
  className,
}: TFormProps<T>) => {
  const formConfig: TFormConfig<T> = {
    defaultValues,
    resolver,
  };

  const methods = useForm<T>(formConfig);

  const submit: SubmitHandler<T> = (data) => {
    debugger
    onSubmit(data);
    methods.reset();
  };

  return (
    <FormProvider {...methods}>
      <Form
        style={{ width: "100%" }}
        layout="vertical"
        onFinish={methods.handleSubmit(submit)}
        className={className}
      >
        {children}
      </Form>
    </FormProvider>
  );
};

export default CustomForm;
