# Row Table Highlight

Highlight a row on the table when menu toggle is clicked. This is also can be used to track which booking detail was previously opened.

![row table highlight](https://drive.google.com/thumbnail?id=1JR9wJb2Eg3yK1HerRUR4x9tVxfUa_pjV&sz=w600)

**Row table highlight** and [auto-navigate to previous page](auto_navigate_prev_page.md) features are both using the new Global Table State Context. This context saves the table related variables.

Variable used particularly for the **row table highlight** feature is `highlightRow`. This variable saves the data id related with the row. For example, in case of bookings table, it saves the `booking.id`.

You can read about Global Table State Context and how to setup it [here](../global_table_state_context.md#setup).

## Code

After setting up the context, you can add the following code:

/src/features/booking/BookingRow.jsx:

```jsx
  ...
  <Menus.Menu>
    <Menus.Toggle
      id={bookingId}
      onClick={() => {
        // Call the `setTableState` function inside `<MenusToggle>` component
        // `onClick` event handler.
        setTableState({ // <---
          table: 'bookings',
          highlightRow: bookingId,
        });
      }}
    />
  ...
```

/src/ui/Table.jsx:

```jsx
// Add a new prop: `name` on the `Table` component to specify the table name.
function Table({ children, name = '', columns }) {
  return (
    // Put this `name` on the `<TableContext.Provider value />`.
    // We need to provide this table name for the `Row` component.
    <TableContext.Provider value={{ columns, name }}>
      <StyledTable role="table">{children}</StyledTable>
    </TableContext.Provider>
  );
}

function Row({ children, rowId }) {
  // On the `Row` component, read the table name.
  const { columns, name: tableName } = useContext(TableContext);

  // Get the getTableState function.
  const { getTableState } = useGlobalTableState();

  // Get the table state.
  const tableState = getTableState(tableName);

  return (
    <StyledRow
      role="row"
      columns={columns}

      // Add a new `isActive` property on `StyledRow` component,
      // and use the `tableState?.highlightedRow` to compare it with the `rowId`.
      isActive={rowId && tableState?.highlightRow == rowId}
    >
      {children}
    </StyledRow>
  );
}

const StyledRow = styled(CommonRow)`
  ...

  /* Define the style when the `isActive` prop value is `true` */
  ${(props) =>
    props.isActive &&
    css`
      background-color: var(--color-grey-100);
    `}

  ...
`;
```

/src/features/bookings/bookingTable.jsx:

```jsx
...

// When using the table, pass the table name to the new `name` prop on the `Table` component.
<Table name="bookings" columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">

...
```
