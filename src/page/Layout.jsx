import CustomFooter from "../components/Footer";
import Navbar from "../components/Navbar";
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
    return (
      <div className='min-h-screen'>
        <Navbar />
        {children}
        <CustomFooter />
      </div>
    );
  };
  
  Layout.propTypes = {
    children: PropTypes.node.isRequired,
  };
  
  export default Layout;