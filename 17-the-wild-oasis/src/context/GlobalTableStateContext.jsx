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
  const [tableStates, setTableStates] = useState([]);

  const getTableState = useCallback(
    (tableName) => {
      if (tableStates === undefined) return {};

      // console.log('tables', tables);

      return tableStates?.find((el) => el.table === tableName) ?? {};
    },
    [tableStates]
  );

  const setTableState = useCallback((newTableState) => {
    const {
      table: tableName = '',
      // highlightRow, // highlightRowId
      // count //dataCount
    } = newTableState ?? {};

    setTableStates((tableStates) => {
      if (
        tableStates.length > 0 &&
        tableStates?.find((el) => el.table === tableName)
      ) {
        return tableStates?.map((el) =>
          el?.table === tableName ? { ...el, ...newTableState } : el
        );
      } else {
        return [...tableStates, newTableState];
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
