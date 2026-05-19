import { useRef } from "react";

type VerificationCodeInputProps = {
  value: string;
  length?: number;
  onChange: (value: string) => void;
};

export default function VerificationCodeInput({
  value,
  length = 6,
  onChange,
}: VerificationCodeInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  function handleChange(index: number, nextValue: string) {
    const digit = nextValue.replace(/\D/g, "").slice(-1);
    const nextCode = value.split("");

    nextCode[index] = digit;
    onChange(nextCode.join("").slice(0, length));

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key !== "Backspace" || value[index]) {
      return;
    }

    inputRefs.current[index - 1]?.focus();
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();

    const pastedCode = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    onChange(pastedCode);
    inputRefs.current[Math.min(pastedCode.length, length - 1)]?.focus();
  }

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={`verification-code-${index}`}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          value={value[index] ?? ""}
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
