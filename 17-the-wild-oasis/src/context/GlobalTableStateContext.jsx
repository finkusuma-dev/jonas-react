import { useContext } from 'react';
import { useState } from 'react';
import { createContext } from 'react';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

const TableStateContext = createContext();

GlobalTableStateProvider.propTypes = {
  children: PropTypes.any,
};

function GlobalTableStateProvider({ children }) {
  const [tables, setTables] = useState([]);

  const getTableState = useCallback(
    (tableName) => {
      if (tables === undefined) return {};

      // console.log('tables', tables);

      return tables?.find((el) => el.table === tableName) ?? {};
    },
    [tables]
  );

  const setTableState = useCallback((newTable) => {
    const {
      table: tableName = '',
      // highlightRow, // highlightRowId
      // count //dataCount
    } = newTable ?? {};

    setTables((tables) => {
      if (tables.length > 0 && tables?.find((el) => el.table === tableName)) {
        return tables?.map((table) =>
          table?.table === tableName ? { ...table, ...newTable } : table
        );
      } else {
        return [...tables, newTable];
      }
    });
  }, []);

  return (
    <TableStateContext.Provider
      value={{
        getTableState,
        setTableState,
      }}
    >
      {children}
    </TableStateContext.Provider>
  );
}

const useGlobalTableState = () => {
  const context = useContext(TableStateContext);

  if (context === undefined) {
    throw new Error('useTableState must be used within a TableStateProvider');
  }

  return context;
};

export { useGlobalTableState };

export default GlobalTableStateProvider;
