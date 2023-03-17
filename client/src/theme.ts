interface Color {
  [key: string]: {
    [key: number]: string;
  };
}

interface Token {
  [key: string]: Color;
}

// color design tokens export
export const tokensDark: Token = {
  grey: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    950: '#121212',
    1000: '#181818',
  },
  primary: {
    // deepPurple
    50: '#ede7f6',
    100: '#d1c4e9',
    200: '#b39ddb',
    300: '#9575cd',
    400: '#7e57c2',
    500: '#673ab7',
    600: '#5e35b1',
    700: '#512da8',
    800: '#4527a0',
    900: '#311b92',
    950: '#221b92',
  },
  secondary: {
    // blue
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
    950: '#283593',
  },
};

// function that reverses the color palette
function reverseTokens(tokensDark: Token) {
  const reversedTokens: any = {};
  Object.entries(tokensDark).forEach(([key, val]) => {
    const keys = Object.keys(val);
    const values = Object.values(val);
    const length = keys.length;
    const reversedObj: any = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}
export const tokensLight = reverseTokens(tokensDark);

interface TypoText {
  fontFamily: any;
  fontSize: number;
}

interface PaleColor {
  light?: string;
  main: string;
  dark?: string;
  [key: number]: string;
}
export interface Theme {
  palette: {
    mode: 'light' | 'dark';
    primary: PaleColor;
    secondary: PaleColor;
    neutral: PaleColor;
    success: PaleColor;
    info: PaleColor;
    warning: PaleColor;
    error: PaleColor;
    common: { [key: string]: string };
  };
  typography: {
    [key: string]: TypoText;
  };
}

// mui theme settings
export const themeSettings = (mode: 'light' | 'dark') => {
  return {
    palette: {
      mode: mode,
      common: {
        main: tokensDark.primary[500],
        white: '#ffffff',
      },
      ...(mode === 'dark'
        ? {
            // palette values for dark mode
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[50],
              light: tokensDark.primary[50],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[300],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            info: {
              main: '#4fc3f7',
            },
            success: {
              main: '#81c784',
            },
            warning: {
              main: '#ffb74d',
            },
            error: {
              main: '#e57373',
            },
          }
        : {
            // palette values for light mode
            primary: {
              ...tokensLight.primary,
              main: tokensDark.primary[500],
              light: tokensDark.primary[500],
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[600],
              light: tokensDark.secondary[700],
            },
            neutral: {
              ...tokensLight.grey,
              main: tokensDark.grey[500],
            },
            info: {
              main: '#29b6f6',
            },
            success: {
              main: '#66bb6a',
            },
            warning: {
              main: '#ffa726',
            },
            error: {
              main: '#f44336',
            },
          }),
    },
    typography: {
      fontFamily: ['Roboto', 'sans-serif'].join(','),
      fontSize: 12,
      h1: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 40,
      },
      h2: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 32,
      },
      h3: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 24,
      },
      h4: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 20,
      },
      h5: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 16,
      },
      h6: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 14,
      },
    },
  };
};
