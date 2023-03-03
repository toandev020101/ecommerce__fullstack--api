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
    0: '#ffffff', // manually adjusted
    10: '#f6f6f6', // manually adjusted
    50: '#f0f0f0', // manually adjusted
    100: '#e0e0e0',
    200: '#c2c2c2',
    300: '#a3a3a3',
    400: '#858585',
    500: '#666666',
    600: '#525252',
    700: '#3d3d3d',
    800: '#292929',
    900: '#141414',
    1000: '#000000', // manually adjusted
  },
  primary: {
    // orange
    100: '#ffdbcc',
    200: '#ffb899',
    300: '#ff9466',
    400: '#ff7133',
    500: '#ff4d00',
    600: '#cc3e00',
    700: '#992e00',
    800: '#661f00',
    900: '#330f00',
  },
  secondary: {
    // blue
    100: '#ccccff',
    200: '#9999ff',
    300: '#6666ff',
    400: '#3333ff',
    500: '#0000ff',
    600: '#0000cc',
    700: '#000099',
    800: '#000066',
    900: '#000033',
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

export interface Theme {
  palette: {
    primary: {
      main: {
        [key: number]: string;
      };
      light: {
        [key: number]: string;
      };
      [key: number]: string;
    };
    secondary: {
      main: {
        [key: number]: string;
      };
      [key: number]: string;
    };
    neutral: {
      main: {
        [key: number]: string;
      };
      [key: number]: string;
    };
    background: {
      default: {
        [key: number]: string;
      };
      alt: {
        [key: number]: string;
      };
    };
    mode: 'light' | 'dark';
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    h1: {
      fontFamily: string;
      fontSize: number;
    };
    h2: {
      fontFamily: string;
      fontSize: number;
    };
    h3: {
      fontFamily: string;
      fontSize: number;
    };
    h4: {
      fontFamily: string;
      fontSize: number;
    };
    h5: {
      fontFamily: string;
      fontSize: number;
    };
    h6: {
      fontFamily: string;
      fontSize: number;
    };
  };
}

// mui theme settings
export const themeSettings = (mode: 'light' | 'dark') => {
  return {
    palette: {
      mode: mode,
      ...(mode === 'dark'
        ? {
            // palette values for dark mode
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[400],
              light: tokensDark.primary[400],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[300],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.primary[600],
              alt: tokensDark.primary[500],
            },
          }
        : {
            // palette values for light mode
            primary: {
              ...tokensLight.primary,
              main: tokensDark.grey[50],
              light: tokensDark.grey[100],
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
            background: {
              default: tokensDark.grey[0],
              alt: tokensDark.grey[50],
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
