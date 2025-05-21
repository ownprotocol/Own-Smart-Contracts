import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function FAQPage() {
  return (
    <main className="mt-16 w-full">
      <h1 className="header">Have Questions?</h1>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="border-b border-gray-800">
          <AccordionTrigger>
            <h2 className="text-left font-['DM_Sans'] text-xl leading-6 text-slate-300 md:text-2xl md:leading-8">
              What are Own tokens?
            </h2>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-left font-['DM_Sans'] text-base leading-6 text-[#B4B4B4] md:text-xl md:leading-8">
              Own tokens are the native utility tokens of the Own Layer 2
              blockchain, designed to facilitate low-cost transactions, staking,
              governance, and access to tokenized real-world assets (RWAs).
              These tokens empower users by providing opportunities to earn
              rewards, participate in decentralized decision-making, and unlock
              innovative financial solutions in emerging markets.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border-b border-gray-800">
          <AccordionTrigger>
            <h2 className="text-left font-['DM_Sans'] text-xl leading-6 text-slate-300 md:text-2xl md:leading-8">
              How do I participate in a quest?
            </h2>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-left font-['DM_Sans'] text-base leading-6 text-[#B4B4B4] md:text-xl md:leading-8">
              To participate in a quest, simply log in to the Fasset app and
              visit the Rewards Center. Choose from the list of available
              quests, complete the specified tasks (such as referring friends,
              making deposits, or engaging in the community), and earn points
              that will be converted to Own tokens during the Token Generation
              Event (TGE).
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border-b border-gray-800">
          <AccordionTrigger>
            <h2 className="text-left font-['DM_Sans'] text-xl leading-6 text-slate-300 md:text-2xl md:leading-8">
              Where can I track my rewards?
            </h2>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-left font-['DM_Sans'] text-base leading-6 text-[#B4B4B4] md:text-xl md:leading-8">
              You can track your rewards directly in the Fasset app under the
              Rewards Center section. A real-time dashboard displays your point
              balance, completed quests, and progress toward earning additional
              rewards.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border-b border-gray-800">
          <AccordionTrigger>
            <h2 className="text-left font-['DM_Sans'] text-xl leading-6 text-slate-300 md:text-2xl md:leading-8">
              Why do I need the Fasset app?
            </h2>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-left font-['DM_Sans'] text-base leading-6 text-[#B4B4B4] md:text-xl md:leading-8">
              The Fasset app serves as the gateway to the Own ecosystem,
              allowing you to participate in quests, earn rewards, and manage
              your points. Additionally, the app offers seamless access to
              tokenized real-world assets, staking opportunities, and governance
              features, ensuring an all-in-one solution for financial
              empowerment and engagement.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}

export default FAQPage;
