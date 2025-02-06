import PropTypes from "prop-types";
import { createContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const value = {};

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

DoctorContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DoctorContextProvider;
