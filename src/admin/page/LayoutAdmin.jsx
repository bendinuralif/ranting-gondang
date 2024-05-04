import PropTypes from 'prop-types';
import Sidebar from "../component/sidebar";
import Footer from "../component/footer";

const LayoutAdmin = ({ children }) => {
    return (
      <div className='min-h-screen'>
        <Sidebar />
        {children}
        <Footer />
      </div>
    );
  };
  
  LayoutAdmin.propTypes = {
    children: PropTypes.node.isRequired,
  };
  
  export default LayoutAdmin;