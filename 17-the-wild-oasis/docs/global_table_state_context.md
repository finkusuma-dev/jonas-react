# Global Table State Context

This is the new context I created for tables related features. When trying to create the new [highlight table row](/docs/changes/row_table_highlight.md) feature, I feel the need of saving some table related data somewhere up.

## The Story

At first I used `useSearchParams()` hook to save this data on the url. So when showing the popup menu I set the `searchParams`, so the url will be:

> **http:/localhost:5173/bookings?hrow=213**

_Note: `hrow` for highlighted row._

Then on the `<Table.Row>` component, I read the `hrow` using `searchParams.get('hrow')` and compare it with current `booking.id` to make it highlighted.

After it was finished, I worked on the next feature: [auto-navigate to previous page](/docs/changes/auto_navigate_prev_page.md) and it's also required to save the data `count` (from React Query) somewhere up. I thought for this feature it was different. It was okay to save highlighted row state on the url, but it's not okay doing the same for the data count. Because user can modify this value freely (on the url) and it will mess up how the feature works. It's okay if a row is not highlighted, but it's not okay for the auto-navigate feature to fail.

Looking at these requirements and problems hence why the context is created.

## The Context

This context is used by two features, and it only requires two states related with each of the features. State `highlightRow` for **highlight table row** and state `count` for **auto-navigate to previous page**. And another state to save the current table name.

So total it only needs 3 states. But if I was only creating those 3 states, it will limit the features to only 1 table on the page. If in the future I need to show 2 tables on the page, both planned to have these features, there will be an issue.

### The State

So I designed the state to be able to save the data for multiple tables. The state will be array of object like this:

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

Because the state contains multiple objects it needs to have functions to easily get and set the state for certain table. The `getTableState` and `setTableState` functions are made for this. Below are examples of how to use it for certain feature:

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

You can put the Provider on **App.jsx** after the `<ProtectedRoute>`.

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

## Codes

GlobalTableStateContext.jsx

```jsx
const TableStateContext = createContext();

function GlobalTableStateProvider({ children }) {
  const [tables, setTables] = useState([]);

  const getTableState = useCallback(
    (tableName) => {
      if (tables === undefined) return {};
      return tables?.find((el) => el.table === tableName) ?? {};
    },
    [tables]
  );

  const setTableState = useCallback((newTable) => {
    const {
      table: tableName = '',
      // highlightRow, // highlight row id
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
```
