import React, {createContext, useContext, useMemo, useState} from 'react';

const Context = createContext();

export const GeneralProvider = ({children}) => {
  const [user, setUser] = useState({});
  const [isloading, setLoading] = useState(false);

  const value = useMemo(
    () => ({
      isloading,
      setLoading,
      user,
      setUser,
    }),
    [isloading, setLoading, user, setUser],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useGeneralContext = () => useContext(Context);
