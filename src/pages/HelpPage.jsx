import React from "react";
import { FooterNav } from "../container/Home";
import { Helmet } from "react-helmet-async";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon,ChevronDownCircle, MailCheckIcon, MailIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { LeftArrow } from "../components/Icons";

const HelpPage = () => {
  return (
    <div>
      <Helmet>
        <title>Help</title>
        <meta
          name="description"
          content="Get help and support for using Paadha's indoor navigation system for Government Medical College. Find answers to common questions about using the indoor map."
        />
        <link rel="canonical" href="https://paadha.com/help" />
      </Helmet>
      <div className="flex gap-4 items-center px-4 my-5">
        <Link to="/home">
          <LeftArrow className="self-start h-full" />
        </Link>
        <h2 className="font-semibold">Help</h2>
      </div>
      <div className="flex flex-col justify-between h-[80dvh]">
      <div className="flex flex-col">
      <Disclosure as="div" className="p-4">
        <DisclosureButton className="flex justify-between items-center pb-5 w-full border-b group">
          <span className="text-sm/6 font-medium  group-data-[hover]:text-black/80">
            ഇൻഡോർ മാപ് ഉപയോഗിക്കുന്ന വിധം ?
          </span>
          <ChevronDownCircle className="size-5 fill-white/60 group-data-[hover]:fill-white/50 group-data-[open]:rotate-180" />
        </DisclosureButton>
        <DisclosurePanel className="mt-2 text-sm/5">
          <img src="/Help.jpg" alt="help document" />
        </DisclosurePanel>
      </Disclosure>
      <Disclosure as="div" className="p-4">
        <DisclosureButton className="flex justify-between items-center pb-5 w-full border-b group">
          <span className="text-sm/6 font-medium  group-data-[hover]:text-black/80">
            ഇൻഡോർ മാപ് ലഭ്യമാവുന്ന സ്ഥലങ്ങൾ ?
          </span>
          <ChevronDownCircle className="size-5 fill-white/60 group-data-[hover]:fill-white/50 group-data-[open]:rotate-180" />
        </DisclosureButton>
        <DisclosurePanel className="mt-2 text-sm/5">
          {/* <img src="/Help.jpg" alt="help document" /> */}
          MCH Block
        </DisclosurePanel>
      </Disclosure>
      </div>
      <Disclosure as="div" className="p-4">
        <DisclosureButton className="flex justify-between items-center py-5 w-full border-y group">
          <span className="flex gap-2 items-center">
          <MailIcon className="size-5 fill-white/60 group-data-[hover]:fill-white/50" />
          <span className="text-sm/6 font-medium  group-data-[hover]:text-black/80">
            Send Us An Email
          </span>
          </span>
          <ChevronDownCircle className="size-5 fill-white/60 group-data-[hover]:fill-white/50 group-data-[open]:rotate-180" />
        </DisclosureButton>
        <DisclosurePanel className="mt-2 text-sm/5">
          {/* <img src="/Help.jpg" alt="help document" /> */}
         <a href="mailto:hello@paadha.com" className="text-blue-500 hover:underline">hello@paadha.com</a>
        </DisclosurePanel>
      </Disclosure>
      </div>
    
      <FooterNav />
    </div>
  );
};

export default HelpPage;
