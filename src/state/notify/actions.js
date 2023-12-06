import { createAction } from '@reduxjs/toolkit';

export const setOpenSnackbar = createAction('notify/setOpenSnackbar');
export const enqueueSnackbar = createAction('notify/enqueueSnackbar');
export const closeSnackbar = createAction('notify/closeSnackbar');
export const removeSnackbar = createAction('notify/removeSnackbar');
