# Auto-Navigate to Previous Page

When the booking row is the last row on the page, deleting it will leave the page empty. This feature automatically navigate to the previous page after successful delete. It also applies to other row operations such as check-in or check-out.

![last row on the page](https://drive.google.com/thumbnail?id=1Y0eDQlSenN8IAH-VECbS5RJY8sIgHSAR&sz=w600)

This features is using the new Global Table State Context. The context saves the table related variables.

Variable used particularly for the **auto-navigate to previous page** feature is `count`. This variable saves the `count` data returned from calling `useQuery`.

You can read about Global Table State Context and how to setup it [here](../global_table_state_context.md#setup).

## Code

After setting up the context, you can add the following code:

```jsx

function BookingTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { bookings, isLoading, count, error, dataError } = useBookings();

  // Get getTableState and setTableState function.
  const { setTableState, getTableState } = useGlobalTableState();

  // Add a new useEffect
  useEffect(() => {

    // get the tableState for bookings table
    const bookingTableState = getTableState('bookings');

    const page = searchParams.get('page');

    // Proceed
    if (bookingTableState?.count !== count) {

      if (
        page &&
        page > 1 &&
        page > Math.ceil((bookingTableState?.count - 1) / PAGE_SIZE)
      ) {
        searchParams.set('page', page - 1);
        setSearchParams(searchParams);
        return;
      }

      setTableState({
        table: 'bookings',
        count: count ?? 0,
      });
    }
  }, [count]);
```
