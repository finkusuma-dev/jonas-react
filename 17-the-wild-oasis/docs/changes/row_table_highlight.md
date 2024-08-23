# Row Table Highlight

Make a row highlighted on the table when clicking menu popup. This can also be used to easily track which booking details opened.

![row table highlight](https://drive.google.com/thumbnail?id=1JR9wJb2Eg3yK1HerRUR4x9tVxfUa_pjV&sz=w600)

**Row table highlight** and [Navigate to previous page](auto_navigate_previous_page.md) features are both using the new Global Table State Context. This context saves variables for the tables. Variable used particularly for **Row table highlight** feature is `highlightRow`.

You can read how to setup Global Table State Context [here](../global_table_state_context.md#setup).

## Codes

After setup the context you can add the codes below.

- /src/features/booking/BookingRow.jsx:

  - Put `setTableState` inside `<MenusToggle>` `onClick` event handler.

  ```jsx
    ...
    <Menus.Menu>
      <Menus.Toggle
        id={bookingId}
        onClick={() => {
          setTableState({ // <---
            table: 'bookings',
            highlightRow: bookingId,
          });
        }}
      />
    ...
  ```

- /src/ui/Table.jsx:
  Steps:

  1. Add a new `name` param on the `Table` component to specify table name. Then put it on the Provider's value. We need to provide this table name for the `Row` component.
  2. On the `Row` component, read the table name. And use it to get the table state using `getTableState(tableName)`
  3. Add a new `isActive` property on `StyledRow` component, and use the `tableState?.highlightedRow` to compare with `rowId`, and set `isActive` to true.

  ```jsx
  // 1.
  function Table({ children, name = '', columns }) {
    return (
      <TableContext.Provider value={{ columns, name }}>
        <StyledTable role="table">{children}</StyledTable>
      </TableContext.Provider>
    );
  }

  function Row({ children, rowId }) {
    // 2.
    const { columns, name: tableName } = useContext(TableContext);
    const { getTableState } = useGlobalTableState();

    const tableState = getTableState(tableName);

    return (
      <StyledRow
        role="row"
        columns={columns}
        /* 3. */
        isActive={rowId && tableState?.highlightRow == rowId}
      >
        {children}
      </StyledRow>
    );
  }

  // Style
  const StyledRow = styled(CommonRow)`
    ...
  
    ${(props) =>
      props.isActive &&
      css`
        background-color: var(--color-grey-100);
      `}
    
    ...
  `;
  ```
