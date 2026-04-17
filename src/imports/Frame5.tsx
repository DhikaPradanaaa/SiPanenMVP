import imgImage1 from "figma:asset/85b54429ff18534590e2881f120f06f05d1f27bf.png";

export default function Frame() {
  return (
    <div className="relative size-full">
      <p className="-translate-x-1/2 absolute font-['Poppins:Bold',sans-serif] leading-[21px] left-[calc(50%+6px)] not-italic text-[#18181b] text-[32px] text-center top-[331px] tracking-[-0.32px] whitespace-nowrap">SiPanen</p>
      <div className="absolute h-[331px] left-[24px] top-[11px] w-[320px]" data-name="image 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[183.45%] left-[-90.45%] max-w-none top-[-35.41%] w-[284.63%]" src={imgImage1} />
        </div>
      </div>
    </div>
  );
}