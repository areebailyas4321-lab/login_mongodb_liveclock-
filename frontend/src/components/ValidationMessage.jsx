import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ValidationMessage.css';

const ValidationMessage = ({ message, isValid, show }) => {
    if (!show || !message) return null;

    return (
        <AnimatePresence>
            <motion.div
                className={`validation-message ${isValid ? 'valid' : 'invalid'}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                {message}
            </motion.div>
        </AnimatePresence>
    );
};

export default ValidationMessage;
