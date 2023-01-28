/*
This file is part of the Notesnook project (https://notesnook.com/)

Copyright (C) 2023 Streetwriters (Private) Limited

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import { Theme } from "../types";
import { ThemeLight } from "./light";

export const ThemeDark: Theme = {
  ...ThemeLight,
  colorScheme: "dark",
  scopes: {
    base: {
      primary: {
        accent: "#008837",
        background: "#1f1f1f",
        border: "#383838",
        placeholder: "#404040",
        heading: "#212121",
        paragraph: "#505050",
        icon: "#808080",
        separator: "#383838",
        hover: "#ffffff10",
        shade: "#00883712"
      },
      secondary: {
        accent: "#008837",
        background: "#2b2b2b",
        border: "#383838",
        placeholder: "#404040",
        heading: "#808080",
        paragraph: "#818589",
        icon: "#808080",
        separator: "#383838",
        hover: "#ffffff10",
        shade: "#00883712"
      },
      disabled: {
        accent: "#008837",
        background: "#ffffff",
        border: "#383838",
        placeholder: "#404040",
        heading: "#212121",
        paragraph: "#505050",
        icon: "#808080",
        separator: "#383838",
        hover: "#ffffff10",
        shade: "#00883712"
      },
      error: {
        accent: "#008837",
        background: "#f4433620",
        border: "#383838",
        placeholder: "#404040",
        heading: "#ff6961",
        paragraph: "#ff6961",
        icon: "#ff6961",
        separator: "#383838",
        hover: "#ffffff10",
        shade: "#00883712"
      },
      warning: {
        accent: "#008837",
        background: "#ffffff",
        border: "#383838",
        placeholder: "#404040",
        heading: "#212121",
        paragraph: "#505050",
        icon: "#808080",
        separator: "#383838",
        hover: "#ffffff10",
        shade: "#00883712"
      },
      success: {
        accent: "#008837",
        background: "#00FF0020",
        border: "#383838",
        placeholder: "#404040",
        heading: "#4F8A10",
        paragraph: "#4F8A10",
        icon: "#4F8A10",
        separator: "#383838",
        hover: "#ffffff10",
        shade: "#00883712"
      }
    }
  }
};
