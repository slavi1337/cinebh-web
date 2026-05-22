import { useEffect, useRef, useState } from "react";

type VerificationCodeInputProps = {
  value: string;
  length?: number;
  onChange: (value: string) => void;
};

function createDigitsFromValue(value: string, length: number) {
  return Array.from({ length }, (_, index) => value[index] ?? "");
}

export default function VerificationCodeInput({
  value,
  length = 6,
  onChange,
}: VerificationCodeInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [digits, setDigits] = useState(() =>
    createDigitsFromValue(value, length),
  );

  useEffect(() => {
    if (value.length === 0) {
      setDigits(createDigitsFromValue("", length));
    }
  }, [value, length]);

  function updateDigits(nextDigits: string[]) {
    setDigits(nextDigits);
    onChange(nextDigits.join(""));
  }

  function handleChange(index: number, nextValue: string) {
    const digit = nextValue.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];

    nextDigits[index] = digit;
    updateDigits(nextDigits);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key !== "Backspace" || digits[index]) {
      return;
    }

    inputRefs.current[index - 1]?.focus();
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();

    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length)
      .split("");

    const nextDigits = createDigitsFromValue("", length);

    pastedDigits.forEach((digit, index) => {
      nextDigits[index] = digit;
    });

    updateDigits(nextDigits);
    inputRefs.current[Math.min(pastedDigits.length, length - 1)]?.focus();
  }

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={`verification-code-${index}`}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          value={digits[index]}
          inputMode="numeric"
          maxLength={1}
          onPaste={handlePaste}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          className="h-16 w-12 rounded-2xl border border-auth-input-border bg-white/10 text-center text-[40px] font-bold leading-[48px] tracking-[-0.004em] text-auth-text-primary outline-none focus:border-[3px] focus:border-auth-input-border"
        />
      ))}
    </div>
  );
}
