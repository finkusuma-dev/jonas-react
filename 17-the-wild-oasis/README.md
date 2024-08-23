# Readme

This project is a React Tutorial by [Jonas Schmedtmann](https://codingheroes.io/). I made several changes and improvements to the project:

- Add image preview on the add and edit cabin form, and the edit user profile form. [⏩️](#image-preview)
- Row highlight on booking table. To show the active row of the menu popup. Also to make it easier to track which booking detail previously opened.
- Auto-navigate to the previous booking page if the current page has only one row, and the row is performed an operation like delete, check-in, or check-out.
- Better flow of check-in.
- Detailed label for the stays duration summary chart. With the tooltip that adapt to dark mode.

Codes changes and improvements:

- Improvement of `prepareData()` function to prepare the booking data for the stay duration summary chart.

If you want to clone this project and run it, you can go [here](#how-to-run).

## Changes and Improvements

### Image Preview

Added image preview on the cabin & user's profile form so you can see preview of the current image on the database or selected image you want to upload.

![image preview](https://drive.google.com/thumbnail?id=1Y9qKwiGW4Z8mIAEPC291r-CKqVtJNerW&sz=w600)

[Read more](docs/changes/image_preview.md)

### Row Table Highlight

Make a row highlighted on the table when clicking menu popup. This is also used to easily track which booking details opened.

![row table highlight](https://drive.google.com/thumbnail?id=1JR9wJb2Eg3yK1HerRUR4x9tVxfUa_pjV&sz=w600)

[Read more](docs/changes/row_table_highlight.md)

### Auto-Navigate to Previous Page

When the booking row is the last row on the page, deleting it will make the page empty. This feature will automatically navigate to previous page after successful delete. This will also work with other row operations such as check-in or check-out.

![last row on the page](https://drive.google.com/thumbnail?id=1Y0eDQlSenN8IAH-VECbS5RJY8sIgHSAR&sz=w600)

[Read more](docs/changes/auto_navigate_prev_page.md)

### Better Flow of Check-in

When check-in, the components that are shown or hidden is adjusted so the user can focus on his current task. Removing any unnecessary informations at a certain state that can clutter the UI.

[Read more](docs/changes/better_flow_in_checkin.md)

### Detailed Label for Stays Duration Summary Chart

This is just my personal preference to show the pie chart. It shows detailed label on the chart. It also has tooltip that adapts to the dark mode. Unfortunately I can't screenshot the tooltip, so can't show it here.

![stays duration summary chart](https://drive.google.com/thumbnail?id=1cKydj0RPovQT9jHgJA9MJVpyN53IHPwc&sz=w300)

[Read more](docs/changes/stays_duration_chart.md)

## Codes Changes and Improvements

### Better PrepareData Function

## How to Run

This project is created using `pnpm create vite 17-the-wild-oasis --template react`. So you need `pnpm` package instead of `npm`.

If you don't have pnpm package in your computer you can install it with one of the methods in [https://pnpm.io/installation](https://pnpm.io/installation).

And then setup this project with:

```bash
cd 17-the-wild-oasis
pnpm install
pnpm run dev
```

---

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
