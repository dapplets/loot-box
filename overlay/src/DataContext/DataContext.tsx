import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  Reducer,
  useReducer,
  ReactNode,
  FC,
} from 'react';
// export interface ContextProps {
//   children?: ReactNode | undefined;
//   data?: {};
// }
const DataContext = React.createContext({} as any);
{
  /* <Partial<ContextProps>>({}); */
}
{
  /* <ReactNode | undefined>(undefined); */
}

export const DataProvider: FC = ({ children }) => {
  const [data, setData] = useState({});

  // будет принимать новые значения
  const setValues = (values: {}) => {
    // внутри вызываем сетстэйт который будет принимать предыдущие данные
    // затем возвращать объект со всеми предыдущими данными + перезаписывая те поля которые передадим в новых данных
    setData((prevData) => ({
      ...prevData,
      ...values,
    }));
  };
  // value - объект с полями дата и сетvalues
  return <DataContext.Provider value={{ data, setValues }}>{children}</DataContext.Provider>;
};

// делаем  кастомный хук = создаем функцию которая будет оберткой
export const useData = () => useContext(DataContext);

// в индекс оборачиваем апп в дата провайдер
