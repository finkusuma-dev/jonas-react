# Better Check-in Flow

During check-in, the components that are shown or hidden are adjusted so the user can focus clearly on their current task. Removing any unnecessary informations in certain states that could clutter the UI.

## Check-in Process

We can break down the check-in process into 4 conditions:

### 1. When the booking is paid and includes breakfast

![booking paid, has breakfast](https://drive.google.com/thumbnail?id=1nvZE3Kr-D4mxxeeXSZl0yujv5otortPZ&sz=w1000)

On this condition, the user only needs to press the check-in button. There's no need to confirm any payment, so the confirm payment checkbox is hidden.

### 2. When the booking is paid and doesn't include breakfast

![booking paid, no breakfast](https://drive.google.com/thumbnail?id=1Q_gHkFdVOeWjNGus_3b2g-Y7uj_WT7fy&sz=w1000)

There are 2 things to note:

1. The check-in button is shown. The user can click it when the guest wants to directly check in.
2. The add breakfast checkbox is shown along with the amount of payment needed. If the guest asks about the breakfast, user can give that information directly.

   ![booking paid, no breakfast](https://drive.google.com/thumbnail?id=1ck_MUORl0PHFdcRZf4QvQrt_oeRrBDRc&sz=w1000)

   If the guest wants to add breakfast, on activating the add breakfast checkbox, the check-in button will be hidden to remove it from the user's task. The confirm payment checkbox will then be shown with the breakfast price, so the user can focus on confirming only for the additional payment. Also, extra information is added at the bottom, showing each of the cabin & breakfast prices.

### 3. When the booking is not paid and don't have breakfast

![booking not paid, no breakfast](https://drive.google.com/thumbnail?id=1OAqI2y1dX_1M8WfN8JT_6JhWAtxInYtv&sz=w1000)

There are 3 things to note:

1. The check-in button is hidden, removing it from user's task.
2. The add breakfast checkbox is shown with the breakfast price.
3. The confirm checkbox is shown with the total amount of payment.

Once the confirm checkbox is activated, the check-in button will be shown again. There is nothing particularly special here, aside from hiding and showing the check-in button.

### 4. When the booking is not paid and has breakfast

![booking not paid, has breakfast](https://drive.google.com/thumbnail?id=1eyqn7u4lWPZKVUXKKCdKur_ZpCGaV0Sn&sz=w1000)

1. Similar to the previous condition, when the booking hasn't been paid, the check-in button is hidden, removing it from the user's task.
2. The add breakfast checkbox is also shown, allowing the user to cancel the breakfast when the guest request it, as they haven't paid it yet.

The other UI elements remain the same as in the previous conditions.

## Code

You can see the code directly in the [CheckinBooking.jsx](https://github.com/finkusuma-dev/jonas-react/blob/thewildoasis-vite-pnpm/17-the-wild-oasis/src/features/check-in-out/CheckinBooking.jsx). The additional code may be a bit more complex, but sometimes this complexity is necessary to achieve better functionality.
