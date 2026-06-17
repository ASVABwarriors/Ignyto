import { prisma } from '../src/lib/prisma';

async function main() {
  const faqs = [
    {
      question: "What is the refund policy?",
      answer: "Our refund policy allows you to request a full refund within the first 7 days of your course start date if you are not satisfied. Please contact our support team for assistance.",
      isActive: true,
      order: 1
    },
    {
      question: "If I still have a question, how do I contact you?",
      answer: "You can reach out to us via the contact form on our website, email us directly at support@ignytotutoring.com, or call our customer service hotline during business hours.",
      isActive: true,
      order: 2
    },
    {
      question: "Can I take the exam on a mobile phone or tablet?",
      answer: "Yes, our platform is fully responsive. You can attend classes, view course materials, and take exams on your mobile phone, tablet, or desktop computer.",
      isActive: true,
      order: 3
    }
  ];

  console.log('Seeding FAQs...');
  for (const faq of faqs) {
    await prisma.faq.create({
      data: faq
    });
  }
  console.log('Finished seeding FAQs.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
// Note: We don't call prisma.$disconnect() here because of the pooled connection setup in dev
