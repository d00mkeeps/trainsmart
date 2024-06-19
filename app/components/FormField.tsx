import { FormFieldProps } from "@/types";

const FormField: React.FC<FormFieldProps> = ({
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
  label,
  required,
  children,
}) => {
  const renderField = () => {
    switch (type) {
      case "text":
      case "number":
        return (
          <input
            type={type}
            placeholder={placeholder}
            {...register(name, { valueAsNumber })}
          />
        );
      case "textarea":
        return <textarea placeholder={placeholder} {...register(name)} />;
      case "boolean":
        return <input type="checkbox" {...register(name, { valueAsNumber })} />;
      case "select":
        return (
          <select {...register(name, { required, valueAsNumber })}>
            {children}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      {renderField()}
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};

export default FormField;
