import { motion } from 'framer-motion';
import FormBuilderLayout from '../components/FormBuilderLayout';

const FormBuilderPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1"
    >
      <FormBuilderLayout />
    </motion.div>
  );
};

export default FormBuilderPage;
