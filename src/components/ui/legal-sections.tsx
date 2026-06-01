'use client';

import { motion } from 'framer-motion';

type Section = { title: string; body: string };

interface LegalSectionsProps {
  sections: Section[];
  lastUpdated: string;
}

export default function LegalSections({ sections, lastUpdated }: LegalSectionsProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {sections.map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          className="rounded-2xl border border-foreground/10 bg-background/60 p-6 backdrop-blur-sm md:p-8"
        >
          <h2 className="mb-3 font-heading text-lg font-bold text-primary md:text-xl">
            {i + 1}. {section.title}
          </h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            {section.body}
          </p>
        </motion.div>
      ))}
      <p className="pt-4 text-center text-xs text-foreground/50">
        {lastUpdated}
      </p>
    </div>
  );
}
