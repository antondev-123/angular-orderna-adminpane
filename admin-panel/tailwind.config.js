/**
    IMPORTANT:

    If you make changes to the style config in this file,
    please make sure to review and update files in css/material* as well,
    so Tailwind and Angular Material styles are synchronized.
*/

/** @type {import('tailwindcss').Config} */

import colors from 'tailwindcss/colors';
import defaultTheme from 'tailwindcss/defaultTheme';

export const content = [
  "./src/**/*.{html,ts}",
]
export const theme = {
  extend: {
    colors: {
      'primary': colors.indigo,
      'accent': colors.sky,
      'semantic-red': colors.rose,
      'semantic-green': colors.emerald,
      'semantic-yellow': colors.amber,
      'dark': colors.slate,
      'light': colors.white
    },
    fontFamily: {
      'sans': [
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'],
    },
    
  },
}
export const plugins = []

export const darkMode = 'class';
