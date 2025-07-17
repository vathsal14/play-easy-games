
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "When will the credit card be available?",
      answer: "As early as possible! Stay tuned for announcements!"
    },
    {
      question: "How can I redeem my reward?",
      answer: "Your reward will be available to you after the launch of our credit card/app as early as possible."
    },
    {
      question: "Will there be any charges for gaming credit card?",
      answer: "We will launch the card with two variants - one for free and another with an annual fee that includes extra rewards and features."
    },
    {
      question: "How to get more spins?",
      answer: "You can refer to your friends or family and get 3 spins max."
    },
    {
      question: "How to progress in leaderboard?",
      answer: "Play games, quizzes and spin the wheel to collect points and progress in leaderboards. You can even receive a surprise gift if you are the first in the list!"
    },
    {
      question: "Is it free to register on the website?",
      answer: "Yes, registration is completely free."
    },
    {
      question: "Why should I pre-register for the Aqube Gaming Credit Card?",
      answer: "Pre-registering ensures you are among the first to access exclusive benefits, early offers, and rewards."
    },
    {
      question: "Is my personal information secure?",
      answer: "Absolutely. We prioritize user data privacy and security, following strict data protection policies."
    },
    {
      question: "How will I know when it launches?",
      answer: "We will update you via your email and social media handles."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-orange-900/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Everything you need to know about Aqube XP Credit Card
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 px-6"
              >
                <AccordionTrigger className="text-left text-white hover:text-orange-400 transition-colors duration-300 py-6">
                  <span className="text-lg font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
