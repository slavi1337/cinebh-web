import logo from "@/assets/logo.png";
import LeftArrowIcon from "@/components/ui/icons/LeftArrowIcon";

type AuthFormHeaderProps = {
  title: string;
  onBack: () => void;
};

export default function AuthFormHeader({ title, onBack }: AuthFormHeaderProps) {
  return (
    <>
      <div className="mb-10 flex justify-center">
        <img src={logo} alt="Cinebh Logo" className="h-8 w-auto" />
      </div>

      <div className="relative mb-6 flex h-10 items-center">
        <button
          type="button"
          onClick={onBack}
          className="absolute left-0 top-0 flex h-10 w-9 cursor-pointer items-center justify-center rounded-md bg-white/10"
        >
          <LeftArrowIcon className="h-6 w-6 text-[#D0D5DD]" />
        </button>

        <h2 className="mx-auto text-2xl font-bold leading-8 tracking-[-0.0015em] text-[#D0D5DD]">
          {title}
        </h2>
      </div>
    </>
  );
}
