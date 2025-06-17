import clsx from "clsx";
import { type DetailedHTMLProps, type InputHTMLAttributes } from "react";

interface FormInputProps<
  InputProps extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
> {
  title?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputProps: InputProps;
  image?: React.ReactNode;
  errorString?: string;
  className?: string;
  prefix?: string;
  imageEnd?: React.ReactNode;
  inputClassName?: string;
}

export const FormInput = <
  T extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
>({
  title,
  image,
  errorString,
  onChange,
  inputProps,
  className,
  prefix,
  imageEnd,
  inputClassName,
}: FormInputProps<T>) => {
  return (
    <div className={clsx("flex flex-col space-y-2", className)}>
      {title && (
        <h1 className="font-dm_mono text-[10px] font-[400] leading-[14px] tracking-[8%] text-gray-500 md:text-[14px] md:leading-[16px]">
          {title}
        </h1>
      )}
      <div className="flex items-center border-2 border-gray-500/50 bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
        {image && (
          <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">
            <div className="rounded-full border-2 border-gray-300 px-2 py-1.5 text-gray-500 opacity-50">
              {image}
            </div>
          </div>
        )}
        {prefix && (
          <span className="font-dm_sans text-[16px] leading-[20px] text-gray-400 xl:text-[20px] xl:leading-[24px]">
            {prefix}
          </span>
        )}
        <input
          type="text"
          className={clsx(
            "block w-1/2 min-w-0 grow py-2 pl-1 pr-3 font-dm_sans text-[16px] leading-[20px] tracking-[0.5%] text-gray-400 placeholder:text-gray-400 focus:outline-none xl:py-4 xl:text-[20px] xl:leading-[24px]",
            inputClassName,
          )}
          {...inputProps}
          onChange={onChange}
        />
        {imageEnd && (
          <div className="shrink-0 select-none pr-4 text-base text-gray-500 sm:text-sm/6">
            {imageEnd}
          </div>
        )}
      </div>
      {errorString && (
        <p className="h-2 font-dm_mono text-[8px] font-[400] leading-[14px] tracking-[8%] text-red-500 md:text-[14px] md:leading-[16px]">
          {errorString}
        </p>
      )}
    </div>
  );
};
