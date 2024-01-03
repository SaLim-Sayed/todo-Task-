// Define the types for state and actions
export type LoaderState = {
  loading: boolean;
};

export type LoaderActions = {
  showLoading: (loading: boolean) => void;
};
