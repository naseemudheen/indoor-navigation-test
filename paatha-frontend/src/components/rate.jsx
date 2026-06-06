import React, { forwardRef } from "react";
import RcRate from "rc-rate";
import { cn, FieldError, FieldHelperText, Tooltip } from "rizzui";
import { StarIcon } from "@heroicons/react/24/outline";

const labelStyles = {
  size: {
    sm: "text-xs mb-1",
    md: "text-sm mb-1.5",
    lg: "text-sm mb-1.5",
    xl: "text-base mb-2",
  },
};

const rateStyles = {
  base: "flex items-center [&>li]:cursor-pointer [&.rc-rate-disabled>li]:cursor-default [&>li]:relative [&>li]:mr-0.5 rtl:[&>li]:ml-0.5 [&>li]:inline-block text-muted",
  size: {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-7 w-7",
    xl: "h-8 w-8",
  },
  firstStar:
    "[&>li>div>.rc-rate-star-first]:absolute [&>li>div>.rc-rate-star-first]:left-0 rtl:[&>li>div>.rc-rate-star-first]:right-0 [&>li>div>.rc-rate-star-first]:top-0 [&>li>div>.rc-rate-star-first]:w-1/2 [&>li>div>.rc-rate-star-first]:h-full [&>li>div>.rc-rate-star-first]:overflow-hidden",
  color:
    "[&>.rc-rate-star-half>div>.rc-rate-star-first]:text-orange [&>.rc-rate-star-full>div]:text-orange",
  transition:
    "[&>li>div]:transition-all [&>li>div]:duration-300 [&>.rc-rate-star:hover]:scale-110",

};


const Rate = forwardRef(
  (
    {
      size = "md",
      disabled = false,
      character = <StarIcon className="" />,
      label,
      tooltips,
      error,
      helperText,
      labelClassName,
      characterClassName,
      errorClassName,
      helperClassName,
      rateClassName,
      className,
      ...props
    },
    ref
  ) => {
    const characterRender = (
      node,
      { index }
    ) => {
      if (!tooltips) {
        return node;
      }

      return (
        <Tooltip content={tooltips[index]} placement="top">
          {node}
        </Tooltip>
      );
    };

    return (
      <div className={cn("aegon-rate", className)}>
        {label && (
          <div
            className={cn(
              "block font-medium ",
              labelStyles.size[size],
              labelClassName
            )}
          >
            {label}
          </div>
        )}

        <RcRate
          ref={ref}
          disabled={disabled}
          characterRender={characterRender}
          character={({ index }) => (
            <div
              className={cn(
                "[&>svg]:fill-current",
                rateStyles.size[size],
                characterClassName
              )}
            >
              {Array.isArray(character)
                ? character[index]
                : character}
            </div>
          )}
          className={cn(
            rateStyles.base,
            rateStyles.firstStar,
            rateStyles.color,
            !disabled && rateStyles.transition,
            rateClassName
          )}
          {...props}
        />

        {!error && helperText && (
          <FieldHelperText tag="div" size={size} className={helperClassName}>
            {helperText}
          </FieldHelperText>
        )}

        {error && (
          <FieldError size={size} error={error} className={errorClassName} />
        )}
      </div>
    );
  }
);

Rate.displayName = "Rate";

export default Rate;