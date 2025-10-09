"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  tooltip?: string;
}

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: Option[];
  groupLabel?: string;
  className?: string;
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  groupLabel,
  className,
}: FormSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={`flex-1 flex flex-col justify-start ${className}`}>
          {label && <Label className="text-sm font-medium">{label}</Label>}

          <FormControl>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              defaultValue={field.value || ""}
            >
              <SelectTrigger
                className={`w-full mt-1 ${
                  fieldState?.error
                    ? "border-destructive focus:border-destructive focus:ring-destructive"
                    : ""
                }`}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {groupLabel && <SelectLabel>{groupLabel}</SelectLabel>}
                  {options.map((opt) => (
                    <TooltipProvider key={opt.value}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <SelectItem
                              value={opt.value}
                              disabled={opt.disabled}
                            >
                              {opt.label}
                            </SelectItem>
                          </div>
                        </TooltipTrigger>
                        {opt.disabled && opt.tooltip && (
                          <TooltipContent side="right">
                            {opt.tooltip}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>

          <FormMessage className="mt-1" />
        </FormItem>
      )}
    />
  );
}
