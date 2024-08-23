# Global Table State Context

This is the new context I created to save table-related variables for the features.

## The Story

At first, while working on the [row table highlight](changes/row_table_highlight.md) feature, I used `useSearchParams()` hook to save the `highlight row` in the url. When displaying the popup menu, I set the `hrow`, so the url becomes:

> **http:/localhost:5173/bookings?hrow=213**

Then, in the `<Table.Row>` component, I retrieved the `hrow` value using `searchParams.get('hrow')` and compare it with current `booking.id` to determine which row to highlight.

After finishing the row highlighting feature, I worked on the next feature: [auto-navigate to previous page](/docs/changes/auto_navigate_prev_page.md). And this feature also required to save the `count` data (from React Query) somewhere up. I thought that this feature was different with the previous one. It was acceptable to save highlighted row state in the URL, but it's not okay doing the same for the `count` data. The reason is that user can modify this `count` value freely (in the url) and it will disrupt the functionality of the feature. While It's okay if a row is not highlighted, it's not okay for the auto-navigate feature to fail.

Given these requirements and potential issues, hence why the context is created.

## The Context

This context is used by two features, each requiring its own state: `highlightRow` for **highlight table row** and `count` for **auto-navigate to previous page**. Additionally, there's state to save the current table name.

In total it only requires 3 states. However, if I were to define just these 3 states, it would limit the features to a single table on the page. If in the future, I need to display multiple tables on the page, all to have these features, this approach will cause issues.

### The State

I designed the state to support multiple tables by storing array of objects. This allow each table to have its own set of state.

```json
[
  {
    table: 'bookings',
    highlightRow: 213,
    count: 22
  },
  ... //other objects for any other tables
]
```

To manage this, I created the `getTableState` and `setTableState` functions to easily get and set the state of a specific table. Below are examples of how to use these functions:

- Save highlighted row for bookings table:

  ```js
  setTableState({ table: 'bookings', highlightRow: booking?.id });
  ```

- Get highlighted row for bookings table:

  ```js
  const { highlightRow } = getTableState('bookings');
  ```

- Save bookings data count from React Query:

  ```js
  setTableState({ table: 'bookings', count });
  ```

- Get bookings data count:

  ```js
  const { count } = getTableState('bookings');
  ```

## Setup

Place the `<GlobalTableStateProvider/>` inside **App.jsx** within the `<ProtectedRoute/>`, and wrap it around the `<AppLayout/>`.

```jsx
import GlobalTableStateProvider from './context/GlobalTableStateContext';
 ...
 <BrowserRouter>
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <GlobalTableStateProvider> // <---
              <AppLayout />
            </GlobalTableStateProvider> // <---
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate replace to="dashboard" />} />
  ...
```

## Code

GlobalTableStateContext.jsx

```jsx
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
  // Define the tableStates
  const [tableStates, setTableStates] = useState([]);

  // getTableState function
  const getTableState = useCallback(
    (tableName) => {
      if (tableStates === undefined) return {};

      // console.log('tables', tables);

      return tableStates?.find((el) => el.table === tableName) ?? {};
    },
    [tableStates]
  );

  // setTableState function
  const setTableState = useCallback((newTableState) => {
    const {
      table: tableName = '',
      // highlightRow, // to save highlighted row id
      // count // to save the data count
    } = newTableState ?? {};

    setTableStates((tables) => {
      if (tables.length > 0 && tables?.find((el) => el.table === tableName)) {
        return tables?.map((table) =>
          table?.table === tableName ? { ...table, ...newTableState } : table
        );
      } else {
        return [...tables, newTableState];
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
```
