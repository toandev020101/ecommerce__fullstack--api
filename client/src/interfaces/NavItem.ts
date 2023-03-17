export interface NavItem {
  name: string;
  slug?: string;
  icon?: JSX.Element | null;
  child?: NavItem[];
}
