import React, {createContext, useContext, useMemo, useState} from 'react';

const Context = createContext();

export const GeneralProvider = ({children}) => {
  const [user, setUser] = useState(false);
  const [isloading, setLoading] = useState(true);
  const [islogged, setIslogged] = useState(false);

  const value = useMemo(
    () => ({
      isloading,
      setLoading,
      user,
      setUser,
      islogged,
      setIslogged,
    }),
    [isloading, setLoading, user, setUser, islogged, setIslogged],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useGeneralContext = () => useContext(Context);
