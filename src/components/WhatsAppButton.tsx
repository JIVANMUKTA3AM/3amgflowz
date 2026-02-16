import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WhatsAppButton = () => {
  const link = "https://wa.me/5515997668073?text=Olá,%20vim%20pelo%20site%20da%203AMG%20e%20quero%20falar%20com%20a%20engenharia.";

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a 3AMG no WhatsApp"
      title="Falar com a 3AMG no WhatsApp"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.4 }}
      className="fixed bottom-8 right-6 z-40 flex items-center justify-center w-14 h-14 md:w-[56px] md:h-[56px] rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 cursor-pointer transition-all duration-300 hover:scale-[1.08] hover:shadow-xl hover:shadow-[#25D366]/40"
    >
      <MessageCircle className="h-7 w-7" fill="white" stroke="none" />
    </motion.a>
  );
};

export default WhatsAppButton;
