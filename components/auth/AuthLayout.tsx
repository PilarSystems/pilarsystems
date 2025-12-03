import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './AuthLayout.css'; // Assuming you create an external CSS file for styles

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <Link to="/" className="logo">
        <motion.img
          src="/path/to/pilar-systems-logo.png" // Make sure to replace with actual logo path
          alt="PILAR SYSTEMS Logo"
          whileHover={{ scale: 1.1 }}
        />
      </Link>
      <motion.div className="orbs">
        <motion.div className="orb purple" />
        <motion.div className="orb blue" />
        <motion.div className="orb pink" />
      </motion.div>
      <div className="children-content">
        {children}
      </div>
      <footer className="footer">
        <p>© 2025 PILAR SYSTEMS. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
