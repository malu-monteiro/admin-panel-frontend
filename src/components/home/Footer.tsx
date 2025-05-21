import { FOOTER } from "@/constants";

import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

type IconName = keyof typeof iconsMap;

const iconsMap = {
  FaFacebookF: FaFacebookF,
  FaInstagram: FaInstagram,
  FaXTwitter: FaXTwitter,
  FaYoutube: FaYoutube,
} satisfies Record<string, React.ComponentType>;

export function Footer() {
  return (
    <footer className="w-full py-12 px-6 md:px-24 bg-amber-300 relative z-10">
      <div className="absolute inset-0 pointer-events-none opacity-10 flex flex-wrap"></div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center md:flex-row md:items-start md:justify-between gap-8">
        {/* Logo and slogan */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left min-w-[140px]">
          <h4 className="flex items-center gap-2 font-semibold mb-3 text-neutral-100 text-xl">
            <img
              src={FOOTER.logo.src}
              alt={FOOTER.logo.alt}
              className="h-6 w-6"
            />
            {FOOTER.logo.brandName}
          </h4>
          <p className="text-neutral-100 text-sm max-w-[200px]">
            {FOOTER.logo.slogan}
          </p>
        </div>

        {/* Links */}
        {FOOTER.sections.map(({ title, links }) => (
          <div
            key={title}
            className="flex flex-col items-center md:items-start text-center md:text-left min-w-[140px]"
          >
            <h4 className="font-semibold mb-3 text-neutral-100">{title}</h4>
            <ul className="space-y-2 text-gray-700 text-sm">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-white hover:underline">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Social media */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right min-w-[140px]">
          <h4 className="font-semibold mb-3 text-neutral-100">
            {FOOTER.socialMediaTitle}
          </h4>
          <div className="flex gap-4 text-xl text-white">
            {FOOTER.socialMedia.map(({ label, href, iconName }) => {
              const Icon = iconsMap[iconName as IconName];
              return (
                <a key={label} href={href} aria-label={label}>
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto mt-10 text-center text-neutral-100">
        © Copyright {FOOTER.copyright.year}. {FOOTER.copyright.text}{" "}
        <a
          href={FOOTER.copyright.authorLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-100 hover:text-gray-400 transition-colors"
        >
          {FOOTER.copyright.author}
        </a>
      </div>
    </footer>
  );
}
